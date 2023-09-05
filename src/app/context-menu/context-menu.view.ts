import { VirtualDOM } from '@youwol/flux-view'
import { DesktopCtxMenuView } from './desktop-ctx-menu.view'

export class ContextMenuDesktopView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string = baseClassCtxMenuView
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = baseStyleMenuView
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ profileState }) {
        this.children = [new DesktopCtxMenuView({ profileState })]
    }
}

const baseStyleMenuView = { maxWidth: 'fit-content' }
const baseClassCtxMenuView =
    'customContextMenu py-2 rounded yw-box-shadow fv-text-primary'
export const baseClassCtxMenuActions =
    'd-flex align-items-center fv-hover-bg-background-alt fv-pointer ps-2 pe-2 rounded'
