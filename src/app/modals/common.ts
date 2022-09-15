import { HTMLElement$, render, VirtualDOM } from '@youwol/flux-view'
import { merge } from 'rxjs'
import { take } from 'rxjs/operators'
import { Modal } from '@youwol/fv-group'

export function popupModal(contentView: () => VirtualDOM) {
    const modalState = new Modal.State()

    const view = new Modal.View({
        state: modalState,
        contentView,
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
