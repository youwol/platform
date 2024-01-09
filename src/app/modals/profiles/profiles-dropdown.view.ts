import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { Profile, ProfilesState } from './profiles.state'
import { BehaviorSubject } from 'rxjs'
import { ProfileOptionsView } from './profile-options.view'
import { Accounts } from '@youwol/http-clients'

const baseClassesItemView =
    'dropdown-item fv-pointer fv-hover-bg-background-alt fv-text-primary'

/**
 * @category View
 */
export class ProfileItemView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `accordion-item`

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: (ev) => void

    constructor({
        sessionInfo,
        profile,
        state,
    }: {
        sessionInfo?: Accounts.SessionDetails
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        const divId = profile.id.substring(0, 5)
        this.children = [
            {
                tag: 'div',
                class: `${baseClassesItemView}  rounded d-flex yw-hover-text-primary align-items-center mb-1 px-3`,
                children: [
                    {
                        tag: 'div',
                        class: 'd-flex justify-content-center yw-hover-text-primary align-items-center me-2 ',
                        style: {
                            width: '25px',
                        },
                        children: [
                            {
                                tag: 'div',
                                class: {
                                    source$: state.selectedProfile$,
                                    vdomMap: (activeProfile: Profile) =>
                                        activeProfile.id === profile.id
                                            ? 'fas fa-circle fa-lg text-success'
                                            : 'far fa-circle fa-lg',
                                },
                            },
                        ],
                        onclick: () => state.selectProfile(profile.id),
                    },

                    {
                        tag: 'div',
                        class: 'w-75  text-align-start yw-hover-text-primary fv-pointer m-0',
                        innerText: profile.name,
                        onclick: () => state.selectProfile(profile.id),
                    },
                    {
                        tag: 'div',
                        class: 'accordion-button collapsed fv-text-primary ',
                        customAttributes: {
                            dataBsToggle: 'collapse',
                            dataBsTarget: '#profilesOpt' + divId,
                        },
                        ariaExpanded: 'false',
                    },
                ],
            },
            new ProfileOptionsView({
                sessionInfo,
                profile,
                state,
                divId,
            }),
        ]
    }
}

/**
 * @category View
 */
export class NewProfileItemView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
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
    public readonly children: ChildrenLike
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
                tag: 'div',
                class: 'd-flex justify-content-center align-items-center me-2 ',
                style: {
                    width: '25px',
                },
                children: [
                    {
                        tag: 'div',
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
                    value$.next(ev.target['value'])
                },
                onkeydown: (ev: KeyboardEvent) => {
                    ev.key == 'Enter' && state.newProfile(value$.value)
                },
            },
        ]
    }
}

export class ClosePopupButtonView implements VirtualDOM<'span'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'fas fa-times  fv-pointer yw-text-orange'
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'span'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        position: 'absolute' as const,
        top: '10px',
        right: '10px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick = () => {
        document.querySelector('body > div:nth-child(2)').remove()
    }
}

export class CanclePopupButtonView implements VirtualDOM<'span'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'btn yw-text-light-orange  yw-border-orange yw-hover-bg-light-orange rounded yw-hover-text-dark yw-text-orange  fv-bg-background'

    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'span'
    /**
     * @group Immutable DOM Constants
     */
    public readonly innerText = 'Cancel'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        color: 'unset',
        width: '100px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick = () => {
        document.querySelector('body > div:nth-child(2)').remove()
    }
}

export const leavePopupAfterClickBtn = (): void => {
    document.querySelector('body > div:nth-child(2)').remove()
}
