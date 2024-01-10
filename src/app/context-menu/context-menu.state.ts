import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { fromEvent, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ContextMenu } from '@youwol/rx-context-menu-views'

export class ContextMenuState extends ContextMenu.State {
    public readonly div: HTMLElement
    public readonly children: ChildrenLike

    constructor(params: { div: HTMLElement; children: ChildrenLike }) {
        super(
            fromEvent(params.div, 'contextmenu').pipe(
                tap((ev: Event) => ev.preventDefault()),
            ) as Observable<MouseEvent>,
        )
        Object.assign(this, params)
    }

    dispatch(_ev: MouseEvent): VirtualDOM<'div'> {
        return {
            tag: 'div',
            style: {
                zIndex: 1,
            },
            children: this.children,
        }
    }
}

export function installContextMenu({
    div,
    children,
}: {
    div: HTMLElement
    children: ChildrenLike
}) {
    return new ContextMenu.View({
        state: new ContextMenuState({
            div: div,
            children: children,
        }),
        style: {
            zIndex: 20,
        },
        zIndex: 9999,
    })
}
