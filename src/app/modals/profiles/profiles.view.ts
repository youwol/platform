import { attr$, child$, VirtualDOM } from '@youwol/flux-view'
import { combineLatest } from 'rxjs'
import { LoadingScreenView } from '@youwol/cdn-client'
import { filter, mergeMap } from 'rxjs/operators'
import { SettingsView } from './settings.view'
import { ProfilesState } from './profiles.state'
import { Accounts } from '@youwol/http-clients'
import { ProfilesDropDownView } from './profiles-dropdown.view'

/**
 * @category View
 */
export class ProfilesView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'vw-25 vh-25 border fv-border-primary rounded mx-auto my-auto p-4 fv-bg-background-alt'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({
        sessionInfo,
        profilesInfo,
    }: {
        sessionInfo: Accounts.SessionDetails
        profilesInfo: {
            customProfiles: { id: string; name: string }[]
            selectedProfile: string
        }
    }) {
        const state = new ProfilesState({ profilesInfo })
        const cm$ = ProfilesState.getBootstrap$().pipe(
            mergeMap(() => ProfilesState.getFvCodeMirror$()),
        )

        this.children = [
            {
                class: 'd-flex align-items-center justify-content-center w-100 my-2',
                children: [
                    { class: 'mx-3', innerText: 'Selected profile' },
                    {
                        class: attr$(
                            ProfilesState.getBootstrap$(),
                            (): string => '',
                            {
                                untilFirst: 'fas fa-spin fa-spinner',
                            },
                        ),
                    },
                    child$(ProfilesState.getBootstrap$(), () => {
                        return new ProfilesDropDownView({
                            state,
                        })
                    }),
                    child$(state.editionMode$, (edition) =>
                        edition ? {} : new EditProfileButton(state),
                    ),
                ],
            },
            child$(state.selectedProfile$, (profile) =>
                profile.id == 'default' ? new ReadonlyWarningView() : {},
            ),
            child$(state.editionMode$.pipe(filter((v) => v)), () => {
                return new LoadingTypescriptView()
            }),
            child$(
                combineLatest([state.editionMode$.pipe(filter((v) => v)), cm$]),
                () => {
                    return new SettingsView({
                        sessionInfo,
                        profilesState: state,
                    })
                },
            ),
        ]
    }
}

/**
 * @category View
 */
export class ReadonlyWarningView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'fv-text-focus my-2 text-center w-100'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        fontWeight: 'bold',
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
export class LoadingTypescriptView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    class = attr$(ProfilesState.getFvCodeMirror$(), () => 'd-none')
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
export class EditProfileButton implements VirtualDOM {
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
    public readonly children: VirtualDOM[]
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
                class: 'fas fa-pen mr-1 ',
            },
            child$(state.selectedProfile$, ({ id }) => {
                return {
                    innerText:
                        id == 'default' ? 'View profile' : 'Edit profile',
                }
            }),
        ]
        this.onclick = () => state.edit()
    }
}
