import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { UserBadgeDropdownView } from '../customize-dropdown/user-badge-dropdown.view'

/**
 *
 * @category View
 */
export class EnvironmentBadgesView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'my-auto d-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ sessionInfo }: { sessionInfo: Accounts.SessionDetails }) {
        this.children = [new UserBadgeDropdownView(sessionInfo)]
    }
}
