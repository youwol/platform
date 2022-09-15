import { VirtualDOM } from '@youwol/flux-view'
import { SettingsTabsView } from './settings-tabs'
import { Accounts } from '@youwol/http-clients'

/**
 * @category View
 */
export class SettingsView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: '75vw',
        height: '75vh',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ sessionInfo }: { sessionInfo: Accounts.SessionDetails }) {
        this.children = [
            {
                class: 'position-relative h-100 d-flex flex-column',
                children: [new SettingsTabsView({ sessionInfo })],
            },
        ]
    }
}
