import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { DesktopCtxMenuView } from './desktop-ctx-menu.view'

export class ContextMenuDesktopView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'

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
    public readonly children: ChildrenLike

    constructor({ profileState }) {
        this.children = [new DesktopCtxMenuView({ profileState })]
    }
}

const baseStyleMenuView = { maxWidth: 'fit-content' }
const baseClassCtxMenuView =
    'customContextMenu py-2 rounded yw-box-shadow fv-text-primary'
export const baseClassCtxMenuActions =
    'd-flex align-items-center fv-hover-bg-background-alt fv-pointer ps-2 pe-2 rounded'
