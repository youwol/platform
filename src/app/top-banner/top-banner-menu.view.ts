import { HTMLElement$, render, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { Modal } from '@youwol/fv-group'
import { merge } from 'rxjs'
import { take } from 'rxjs/operators'

/**
 * Encapsulates YouWol logo with optional badges & YouWol menu.
 *
 * @category View
 */
export class TopBannerMenuView implements VirtualDOM {
    static ClassSelector = 'top-banner-menu-view'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `d-flex my-auto  p-2 rounded fv-hover-bg-background-alt fv-pointer ${TopBannerMenuView.ClassSelector}`
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable Constants
     */
    public readonly iconView: VirtualDOM
    /**
     * @group Immutable Constants
     */
    public readonly contentView: (state: OsCore.PlatformState) => VirtualDOM

    /**
     * @group Immutable DOM Constants
     */
    onclick: () => void
    /**
     * @group Immutable DOM Constants
     */
    onmouseleave: () => void

    constructor(params: {
        state: OsCore.PlatformState
        iconView: VirtualDOM
        contentView: (state: OsCore.PlatformState) => VirtualDOM
    }) {
        Object.assign(this, params)
        this.onclick = () => {
            const modalState = new Modal.State()
            const view = new Modal.View({
                state: modalState,
                contentView: () => this.contentView(this.state),
                connectedCallback: (elem: HTMLDivElement & HTMLElement$) => {
                    elem.children[0].classList.add('w-100')
                    // https://stackoverflow.com/questions/63719149/merge-deprecation-warning-confusion
                    merge(...[modalState.cancel$, modalState.ok$])
                        .pipe(take(1))
                        .subscribe(() => {
                            modalDiv.remove()
                        })
                },
            })
            const modalDiv = render(view)
            document.querySelector('body').appendChild(modalDiv)
        }

        this.children = [
            {
                style: {
                    overflow: 'hidden',
                },
                children: [this.iconView],
            },
        ]
    }
}
