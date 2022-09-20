import { attr$, children$, VirtualDOM } from '@youwol/flux-view'
import { ProfilesState } from './profiles.state'
import { BehaviorSubject } from 'rxjs'

export class ProfilesDropDownView implements VirtualDOM {
    public readonly class = 'dropdown'
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
                class: 'dropdown-menu',
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
    'dropdown-item fv-pointer fv-hover-bg-background-alt fv-hover-text-primary'

export class ProfileItemView {
    public readonly class = `${baseClassesItemView} d-flex align-items-center justify-content-between`
    public readonly children: VirtualDOM[]
    public readonly onclick: (ev: MouseEvent) => void
    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        const trashView = {
            class: 'fas fa-trash fv-text-error fv-hover-xx-lighter fv-hover-border-primary rounded p-1',
            onclick: () => state.deleteProfile(profile.id),
        }
        this.children = [
            {
                innerText: profile.name,
            },
            profile.id != 'default' ? trashView : undefined,
        ]
        this.onclick = () => state.selectProfile(profile.id)
    }
}

export class NewProfileItemView {
    public readonly class = `${baseClassesItemView}`
    public readonly children: VirtualDOM[]
    public readonly onclick: (ev: MouseEvent) => void

    constructor({ state }: { state: ProfilesState }) {
        const value$ = new BehaviorSubject('')
        // If not use and a direct call 'newProfile' is done in 'keydown' => the dropdown does not close
        // There is certainly better to do
        let plusBtn: HTMLDivElement

        this.children = [
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
                connectedCallback: (elem: HTMLDivElement) => {
                    plusBtn = elem
                },
            },
        ]
    }
}
