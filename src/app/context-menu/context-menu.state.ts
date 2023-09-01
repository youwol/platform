import { VirtualDOM } from '@youwol/flux-view'
import { fromEvent, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ContextMenu } from '@youwol/fv-context-menu'

export class ContextMenuState extends ContextMenu.State {
    public readonly div: HTMLElement
    public readonly children: VirtualDOM[]

    constructor(params: { div: HTMLElement; children: VirtualDOM[] }) {
        super(
            fromEvent(params.div, 'contextmenu').pipe(
                tap((ev: Event) => ev.preventDefault()),
            ) as Observable<MouseEvent>,
        )
        Object.assign(this, params)
    }

    dispatch(_ev: MouseEvent): VirtualDOM {
        return {
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
    children: VirtualDOM[]
}) {
    return new ContextMenu.View({
        state: new ContextMenuState({
            div: div,
            children: children,
        }),
        class: 'fv-bg-background border fv-color-primary fv-text-primary',
        style: {
            zIndex: 20,
        },
        zIndex: 9999,
    })
}
