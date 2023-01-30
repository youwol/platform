import { attr$, VirtualDOM } from '@youwol/flux-view'
import { VisitorFormView } from '../user'
import { separatorView } from '../user/common'
import { BehaviorSubject } from 'rxjs'
import { Modal } from '@youwol/fv-group'

/**
 * @category State
 */
export class WelcomeVisitorState {
    /**
     * @group Storage
     */
    static isShowAgainMode() {
        const config = WelcomeVisitorState.getYouwolConfig()
        return config['show-visitor-welcome-page'] == undefined
            ? true
            : config['show-visitor-welcome-page']
    }

    /**
     * @group Storage
     */
    static getYouwolConfig() {
        return JSON.parse(localStorage.getItem('youwol-storage-config')) || {}
    }

    /**
     * @group Storage
     */
    static setShowAgainMode(showAgain: boolean) {
        const config = WelcomeVisitorState.getYouwolConfig()
        config['show-visitor-welcome-page'] = showAgain
        localStorage.setItem('youwol-storage-config', JSON.stringify(config))
    }
    /**
     * @group Observables
     */
    public readonly showAgain$: BehaviorSubject<boolean>

    constructor() {
        this.showAgain$ = new BehaviorSubject<boolean>(
            WelcomeVisitorState.isShowAgainMode(),
        )
    }

    /**
     * Toggle the 'do not show again' message on/off
     */
    toggleShowAgain() {
        const showAgain = !this.showAgain$.value
        WelcomeVisitorState.setShowAgainMode(showAgain)
        this.showAgain$.next(showAgain)
    }
}

/**
 * @category View
 */
export class WelcomeVisitorView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string =
        'fv-border-primary rounded p-3 fv-text-primary fv-bg-background'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ modalState }: { modalState: Modal.State }) {
        const state = new WelcomeVisitorState()
        this.children = [
            new VisitorFormView({ modalState, class: '' }),
            separatorView,
            new DoNotShowAgainView({ state }),
        ]
    }
}

/**
 * @category View
 */
export class DoNotShowAgainView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string = 'd-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group States
     */
    public readonly state: WelcomeVisitorState

    constructor(params: { state: WelcomeVisitorState }) {
        Object.assign(this, params)
        this.children = [
            {
                tag: 'input',
                type: 'checkbox',
                checked: attr$(this.state.showAgain$, (v) => !v),
                onclick: () => this.state.toggleShowAgain(),
            },
            {
                class: 'px-2',
                innerText: 'Do not show again.',
            },
        ]
    }
}
