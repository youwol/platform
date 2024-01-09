import { DockableTabs } from '@youwol/rx-tab-views'
import { VirtualDOM } from '@youwol/rx-vdom'

/**
 * @category View
 */
export class UserSettingsTabBase extends DockableTabs.Tab {
    protected constructor(params: {
        id: string
        content: ({ tabsState }) => VirtualDOM<'div'>
        title: string
        icon: string
    }) {
        super({ ...params, id: params.id })
    }
}
