import { attr$, child$, children$, VirtualDOM } from '@youwol/flux-view'
import { ProfilesState } from './profiles.state'
import { BehaviorSubject } from 'rxjs'
import { popupModal } from '../common'

/**
 * @category View
 */
export class ProfilesDropDownView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'dropdown'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ state }: { state: ProfilesState }) {
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
                class: 'dropdown-menu fv-bg-background-alt yw-animate-in yw-box-shadow fv-font-size-regular fv-font-family-regular',
                customAttributes: {
                    ariaLabelledby: 'dropdownMenuButton',
                },
                children: children$(state.profiles$, (profiles) => {
                    return [
                        ...profiles.map(
                            (profile) =>
                                new ProfileItemView({ profile, state }),
                        ),
                        new NewProfileItemView({ state }),
                    ]
                }),
            },
        ]
    }
}

const baseClassesItemView =
    'dropdown-item fv-pointer fv-hover-bg-background-alt fv-text-primary'

/**
 * @category View
 */
export class ProfileItemView {
    /**
     * @group Immutable DOM Constants
     */
    // public readonly class = `${baseClassesItemView} d-flex align-items-center justify-content-between`
    public readonly class = `${baseClassesItemView}  rounded d-flex yw-hover-text-primary align-items-center mb-1 px-3`
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        // height: '29px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    public readonly onclick: () => void

    /**
     * @group Immutable DOM Constants
     */

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        const trashView = {
            class: 'fas fa-trash-alt fv-text-primary  yw-hover-text-orange  rounded p-1',
            onclick: () =>
                popupModal(
                    () =>
                        new DeleteProfileConfirmation({
                            profile,
                            state,
                        }),
                ),
        }
        // const uuiLable = v4().substring(0, 6)
        this.children = [
            {
                class: 'd-flex justify-content-center yw-hover-text-primary align-items-center mr-2 ',
                style: {
                    width: '25px',
                },
                children: [
                    {
                        class: attr$(state.selectedProfile$, (activeProfile) =>
                            activeProfile.id === profile.id
                                ? 'fas fa-circle fa-lg text-success'
                                : 'far fa-circle fa-lg',
                        ),
                    },
                ],
            },

            {
                class: 'w-75  text-align-start yw-hover-text-primary fv-pointer m-0',
                innerText: profile.name,
            },
            profile.id != 'default' ? trashView : undefined,
        ]
        this.onclick = () => state.selectProfile(profile.id)
    }
}

/**
 * @category View
 */
export class NewProfileItemView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `${baseClassesItemView}   rounded d-flex align-items-center px-3`
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        height: '29px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: (ev: MouseEvent) => void

    constructor({ state }: { state: ProfilesState }) {
        const value$ = new BehaviorSubject('')
        // If not use and a direct call 'newProfile' is done in 'keydown' => the dropdown does not close
        // There is certainly better to do

        this.children = [
            {
                class: 'd-flex justify-content-center align-items-center mr-2 ',
                style: {
                    width: '25px',
                },
                children: [
                    {
                        class: 'fas fa-plus fv-text-primary yw-hover-text-orange',
                        onclick: (e) => {
                            e.stopPropagation()
                            value$.value ? state.newProfile(value$.value) : ''
                        },
                    },
                ],
            },
            {
                tag: 'input',
                type: 'text',
                class: 'rounded',
                style: {
                    outline: 'none',
                    borderStyle: 'none',
                },
                value: value$.getValue(),
                placeholder: 'Add a new profile . . .',
                oninput: (ev) => {
                    value$.next(ev.target.value)
                },
                onkeydown: (ev: KeyboardEvent) => {
                    ev.key == 'Enter' && state.newProfile(value$.value)
                },
            },
        ]
    }
}

export class DeleteProfileConfirmation implements VirtualDOM {
    public readonly class =
        'w-75 rounded mx-auto my-auto p-4 yw-bg-dark  yw-box-shadow yw-animate-in'

    public children: VirtualDOM[]
    public readonly onclick: () => void

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        ProfilesState.getBootstrap$()
        this.children = [
            {
                tag: 'i',
                class: 'fas fa-trash-alt d-flex fa-lg fv-text-primary ',
                style: {
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                },
                children: [
                    {
                        class: 'ml-3 ',
                        innerText: 'Delete',
                    },
                ],
            },
            {
                class: 'fv-text-primary mt-4 mb-4 text-center',
                innerText:
                    'Are you sure you want to permanently delete this item : ( ' +
                    profile.name +
                    ' ) ?',
            },

            {
                class: 'd-flex align-items-center fv-text-primary yw-hover-text-dark justify-content-around',
                children: [
                    {
                        class: 'btn yw-text-light-orange  yw-border-orange yw-hover-bg-light-orange rounded yw-hover-text-dark yw-text-orange  fv-bg-background',
                        style: {
                            color: 'unset',
                            width: '100px',
                        },
                        innerText: 'Cancel',

                        onclick: () => {
                            document
                                .querySelector('body > div:nth-child(2)')
                                .remove()
                        },
                    },
                    {
                        class: 'btn yw-text-light-orange  yw-border-orange yw-hover-bg-light-orange rounded yw-hover-text-dark yw-text-orange  fv-bg-background',
                        style: {
                            // color: 'unset',
                            width: '100px',
                        },

                        innerText: 'Delete',

                        onclick: () => {
                            state.deleteProfile(profile.id)
                            state.selectProfile('default')
                        },
                    },
                ],
            },
            child$(state.profiles$, (profiles) => {
                return {
                    innerHTML: profiles.includes(profile)
                        ? ''
                        : `<h6 class="text-success text-center mt-2 mb-1 ">Your profile ( ${profile.name} ) was successfully deleted  </h6>`,
                }
            }),
            {
                tag: 'span',
                class: 'fas fa-times  fv-pointer yw-text-orange',
                style: {
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                },
                onclick: () => {
                    document.querySelector('body > div:nth-child(2)').remove()
                },
            },
        ]
    }
}
