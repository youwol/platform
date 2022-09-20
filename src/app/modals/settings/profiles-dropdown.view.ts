import { attr$, children$, VirtualDOM } from '@youwol/flux-view'
import { ProfilesState } from './profiles.state'
import { BehaviorSubject } from 'rxjs'

export class ProfilesDropDownView implements VirtualDOM {
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
