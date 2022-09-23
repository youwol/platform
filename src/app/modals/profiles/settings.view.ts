import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { SettingsTabsView } from './settings-tabs'
import { ProfilesState } from './profiles.state'

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

    constructor({
        sessionInfo,
        profilesState,
    }: {
        sessionInfo: Accounts.SessionDetails
        profilesState: ProfilesState
    }) {
        this.children = [
            {
                class: 'position-relative h-100 d-flex flex-column',
                children: [
                    new SettingsTabsView({ sessionInfo, profilesState }),
                ],
            },
        ]
    }
}
