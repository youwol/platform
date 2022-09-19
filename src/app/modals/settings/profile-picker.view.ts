import { attr$, child$, children$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { LoadingScreenView } from '@youwol/cdn-client'
import { filter, mergeMap } from 'rxjs/operators'
import { SettingsView } from './settings.view'
import { ProfilesState } from './profiles.state'
import { Accounts } from '@youwol/http-clients'

export class ProfilePickerView {
    public readonly class =
        'vw-25 vh-25 border fv-border-primary rounded mx-auto my-auto p-4 fv-bg-background-alt'
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
                        return new ProfilesDropDown({
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

export class ReadonlyWarningView implements VirtualDOM {
    public readonly class = 'fv-text-focus my-2 text-center w-100'
    public readonly style = {
        fontWeight: 'bold',
    }
    public readonly innerText =
        '⚠️The default profile is read-only: it can not be edited'
}

export class LoadingTypescriptView implements VirtualDOM {
    class = attr$(ProfilesState.getFvCodeMirror$(), () => 'd-none')
    style = {
        maxWidth: '500px',
        maxHeight: '500px',
    }
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

export class EditProfileButton implements VirtualDOM {
    public readonly tag = 'button'
    public readonly type = 'button'
    public readonly class =
        'btn btn-outline-secondary mx-3 d-flex align-items-center fv-border-secondary fv-text-primary'
    public readonly children: VirtualDOM[]
    public readonly onclick: (ev: MouseEvent) => void
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

export class ProfilesDropDown implements VirtualDOM {
    public readonly class = 'dropdown'
    public readonly children: VirtualDOM[]

    constructor({ state }: { state: ProfilesState }) {
        const value$ = new BehaviorSubject('')
        // If not use and a direct call 'newProfile' is done in 'keydown' => the dropdown does not close
        // There is certainly better to do
        let plusBtn: HTMLDivElement

        this.children = [
            {
                tag: 'button',
                class: 'btn btn-secondary dropdown-toggle',
                type: 'button',
                id: 'dropdownMenuButton',
                customAttributes: {
                    dataToggle: 'dropdown',
                    ariaHaspopup: 'true',
                },
                ariaExpanded: false,
                innerText: attr$(
                    state.selectedProfile$,
                    (profile) => profile.name,
                ),
            },
            {
                class: 'dropdown-menu',
                customAttributes: {
                    ariaLabelledby: 'dropdownMenuButton',
                },
                children: children$(state.profiles$, (profiles) => {
                    return [
                        ...profiles.map((profile) => ({
                            class: 'dropdown-item fv-pointer fv-hover-bg-background-alt fv-hover-text-primary',
                            innerText: profile.name,
                            onclick: () => state.selectProfile(profile.id),
                        })),
                        {
                            class: 'dropdown-item fv-pointer fv-hover-bg-background-alt fv-hover-text-primary',
                            children: [
                                {
                                    tag: 'input',
                                    type: 'text',
                                    value: value$.getValue(),
                                    placeholder: "enter profile's name",
                                    oninput: (ev) => {
                                        value$.next(ev.target.value)
                                    },
                                    onkeydown: (ev: KeyboardEvent) => {
                                        ev.key == 'Enter' &&
                                            plusBtn.dispatchEvent(
                                                new MouseEvent('click', {
                                                    bubbles: true,
                                                }),
                                            )
                                    },
                                },
                                {
                                    class: 'fas fa-plus mx-2',
                                    onclick: () => {
                                        state.newProfile(value$.value)
                                    },
                                    connectedCallback: (
                                        elem: HTMLDivElement,
                                    ) => {
                                        plusBtn = elem
                                    },
                                },
                            ],
                        },
                    ]
                }),
            },
        ]
    }
}
