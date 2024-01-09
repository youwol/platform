import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { combineLatest } from 'rxjs'
import { LoadingScreenView } from '@youwol/webpm-client'
import { filter, mergeMap } from 'rxjs/operators'
import { SettingsView } from './settings.view'
import { Profile, ProfilesState } from './profiles.state'
import { Accounts } from '@youwol/http-clients'
import { ClosePopupButtonView } from './profiles-dropdown.view'

/**
 * @category View
 */
export class ProfilesView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'vw-25 vh-25 rounded mx-auto my-auto p-4 fv-bg-background-alt yw-box-shadow yw-animate-in '
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor({
        sessionInfo,
        state,
    }: {
        sessionInfo: Accounts.SessionDetails
        state: ProfilesState
    }) {
        const cm$ = ProfilesState.getBootstrap$().pipe(
            mergeMap(() => ProfilesState.getFvCodeMirror$()),
        )

        this.children = [
            {
                tag: 'div',
                class: 'd-flex align-items-center justify-content-center w-100 my-2',
                children: [
                    { tag: 'div', class: 'mx-3', innerText: 'Profile name :' },
                    {
                        tag: 'div',
                        class: {
                            source$: ProfilesState.getBootstrap$(),
                            vdomMap: (): string => '',
                            untilFirst: 'fas fa-spin fa-spinner',
                        },
                    },
                    {
                        tag: 'div',
                        innerText: {
                            source$: state.editedProfile$,
                            vdomMap: (profile: Profile) => profile.name,
                        },
                    },
                    {
                        source$: state.editionMode$,
                        vdomMap: (edition) =>
                            edition
                                ? { tag: 'div' }
                                : new EditProfileButton(state),
                    },
                ],
            },
            {
                source$: state.editedProfile$,
                vdomMap: (profile: Profile) =>
                    profile.id == 'default'
                        ? new ReadonlyWarningView()
                        : { tag: 'div' },
            },
            {
                source$: state.editionMode$.pipe(filter((v) => v)),
                vdomMap: () => {
                    return new LoadingTypescriptView()
                },
            },
            {
                source$: combineLatest([
                    state.editionMode$.pipe(filter((v) => v)),
                    cm$,
                ]),
                vdomMap: () => {
                    return new SettingsView({
                        sessionInfo,
                        profilesState: state,
                    })
                },
            },
            {
                tag: 'div',
                class: 'w-100 d-flex justify-content-center',
                children: [
                    {
                        tag: 'div',
                        class: {
                            source$: state.profileProcessing$,
                            vdomMap: (isProcessing) => {
                                return isProcessing
                                    ? 'fas fa-spinner fa-spin p-1'
                                    : ''
                            },
                        },
                    },
                ],
            },
            new ClosePopupButtonView(),
        ]
    }
}

/**
 * @category View
 */
export class ReadonlyWarningView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'fv-text-focus my-2 text-center w-100'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        fontWeight: 'bold' as const,
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly innerText =
        '⚠️The default profile is read-only: it can not be edited'
}

/**
 * @category View
 */
export class LoadingTypescriptView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    class = {
        source$: ProfilesState.getFvCodeMirror$(),
        vdomMap: () => 'd-none',
    }
    /**
     * @group Immutable DOM Constants
     */
    style = {
        maxWidth: '500px',
        maxHeight: '500px',
    }
    /**
     * @group Immutable DOM Constants
     */
    connectedCallback = (elemHTML: HTMLDivElement) => {
        const loadingScreen = new LoadingScreenView({
            container: elemHTML,
            logo: `<div style='font-size:x-large'>TypeScript</div>`,
            wrapperStyle: {
                width: '500px',
                height: '500px',
                'font-weight': 'bolder',
            },
        })
        loadingScreen.render()
        ProfilesState.cdnEvents$.subscribe((ev) => loadingScreen.next(ev))
    }
}

/**
 * @category View
 */
export class EditProfileButton implements VirtualDOM<'button'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'button'
    /**
     * @group Immutable DOM Constants
     */
    public readonly type = 'button'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'btn btn-outline-secondary mx-3 d-flex align-items-center fv-border-secondary fv-text-primary'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: (ev: MouseEvent) => void

    /**
     * @group Immutable DOM Constants
     */
    constructor(state: ProfilesState) {
        this.children = [
            {
                tag: 'div',
                class: 'fas fa-pen me-1 ',
            },
        ]
        this.onclick = () => state.edit()
    }
}
