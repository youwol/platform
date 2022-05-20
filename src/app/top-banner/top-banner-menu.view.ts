import { HTMLElement$, render, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { Modal } from '@youwol/fv-group'
import { merge } from 'rxjs'
import { take } from 'rxjs/operators'

/**
 * Encapsulates YouWol logo with optional badges & YouWol menu.
 */
export class TopBannerMenuView implements VirtualDOM {
    static ClassSelector = 'top-banner-menu-view'
    public readonly class = `d-flex my-auto  p-2 rounded fv-hover-bg-background-alt fv-pointer ${TopBannerMenuView.ClassSelector}`
    public readonly state: OsCore.PlatformState
    public readonly children: VirtualDOM[]
    public readonly iconView: VirtualDOM
    public readonly contentView: (state: OsCore.PlatformState) => VirtualDOM

    onclick: () => void
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
                    width: '30px',
                    overflow: 'hidden',
                },
                children: [this.iconView],
            },
        ]
    }
}
