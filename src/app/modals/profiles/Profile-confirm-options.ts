import { ProfilesState } from './profiles.state'
import {
    CanclePopupButtonView,
    ClosePopupButtonView,
    leavePopupAfterClickBtn,
} from './profiles-dropdown.view'
import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'

export class DeleteProfileConfirmation implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'w-75 rounded mx-auto my-auto p-4 yw-bg-dark  yw-box-shadow yw-animate-in'
    /**
     * @group Immutable DOM Constants
     */
    public children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        this.children = [
            new PopupTitleProfileOptionView({
                title: 'Delete profile',
                fa: 'trash-alt',
            }),
            {
                tag: 'div',
                class: 'fv-text-primary mt-4 mb-4 text-center',
                innerText:
                    'Are you sure you want to permanently delete this item : ( ' +
                    profile.name +
                    ' ) ?',
            },

            {
                tag: 'div',
                class: 'd-flex  fv-text-primary yw-hover-text-dark justify-content-between',
                children: [
                    new CanclePopupButtonView(),
                    {
                        tag: 'div',
                        class: 'btn yw-text-light-orange  yw-border-orange yw-hover-bg-light-orange rounded yw-hover-text-dark yw-text-orange  fv-bg-background',
                        style: {
                            width: '100px',
                        },
                        innerText: 'Delete',
                        onclick: () => {
                            state.deleteProfile(profile.id)
                            state.selectedProfile$
                                .pipe(
                                    tap((selectedProfile) =>
                                        selectedProfile.id !== profile.id
                                            ? ''
                                            : state.selectProfile('default'),
                                    ),
                                )
                                .subscribe()
                            leavePopupAfterClickBtn()
                        },
                    },
                ],
            },

            new ClosePopupButtonView(),
        ]
    }
}

export class RenameProfileConfirmation implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'w-100 rounded mx-auto my-auto p-4 yw-bg-dark  yw-box-shadow yw-animate-in'
    /**
     * @group Immutable DOM Constants
     */
    public children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        const rename$ = new BehaviorSubject('')
        this.children = [
            new PopupTitleProfileOptionView({
                title: 'Rename profile',
                fa: 'edit',
            }),
            new PopupProfileOptsInputView({ value$: rename$, state, profile }),
            {
                tag: 'div',
                class: 'd-flex fv-text-primary yw-hover-text-dark justify-content-between',
                children: [
                    new CanclePopupButtonView(),
                    {
                        tag: 'div',
                        class: 'btn yw-text-light-orange  yw-border-orange yw-hover-bg-light-orange rounded yw-hover-text-dark yw-text-orange  fv-bg-background',
                        style: {
                            width: '100px',
                        },
                        innerText: 'Rename',

                        onclick: () => {
                            if (
                                rename$.value !== profile.name &&
                                rename$.value !== ''
                            ) {
                                state.renameProfile(profile.id, rename$.value)
                                leavePopupAfterClickBtn()
                            }
                        },
                    },
                ],
            },
            new ClosePopupButtonView(),
        ]
    }
}

export class DuplicatedProfileConfirmation implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'w-100 rounded mx-auto my-auto p-4 yw-bg-dark  yw-box-shadow yw-animate-in'
    /**
     * @group Immutable DOM Constants
     */

    public children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        const value$ = new BehaviorSubject(profile.name + '-copy')
        this.children = [
            new PopupTitleProfileOptionView({
                title: 'Duplicate profile',
                fa: 'clone',
            }),
            new PopupProfileOptsInputView({ value$, state, profile }),

            {
                tag: 'div',
                class: 'd-flex fv-text-primary yw-hover-text-dark justify-content-between',
                children: [
                    new CanclePopupButtonView(),
                    {
                        tag: 'div',
                        class: 'btn yw-text-light-orange  yw-border-orange yw-hover-bg-light-orange rounded yw-hover-text-dark yw-text-orange  fv-bg-background',
                        style: {
                            width: '100px',
                        },

                        innerText: 'Duplicate',

                        onclick: () => {
                            if (
                                value$.value !== profile.name &&
                                value$.value !== ''
                            ) {
                                state.duplicateProfile(profile.id, value$.value)
                                leavePopupAfterClickBtn()
                            }
                        },
                    },
                ],
            },
            new ClosePopupButtonView(),
        ]
    }
}

export class PopupTitleProfileOptionView implements VirtualDOM<'i'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'i'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor({ title, fa }: { title: string; fa: string }) {
        this.children = [
            {
                tag: 'div',
                style: {
                    fontSize: '16px',
                },
                class: 'ms-3 fv-font-family-regular',
                innerHTML: title,
            },
        ]
        this.class = `fas fa-${fa} d-flex fa-lg fv-text-primary `
    }
}

export class PopupProfileOptsInputView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex mt-4 mb-4  text-center justify-content-center align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor({ value$, state, profile }) {
        this.children = [
            {
                tag: 'div',
                style: {
                    minWidth: 'fit-content',
                },
                innerHTML: value$.value === '' ? 'New name' : 'Name',
            },
            {
                tag: 'input',
                type: 'text',
                class: 'rounded ms-2 text-center ',
                style: {
                    width: '15rem',
                    outline: 'none',
                    borderStyle: 'none',
                },
                value: value$.value == '' ? profile.name : value$.value,
                placeholder: value$.value,
                oninput: (ev) => {
                    value$.next(ev.target['value'])
                },
                onkeydown: (ev: KeyboardEvent) => {
                    ev.key == 'Enter' &&
                        state.duplicateProfile(profile.id, value$.value)
                },
            },
        ]
    }
}
