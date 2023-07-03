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
    public readonly class =
        'my-auto mr-2  my-auto  p-1 pr-2 fv-hover-bg-background-alt  yw-btn-focus  rounded   top-banner-menu-view d-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ sessionInfo }: { sessionInfo: Accounts.SessionDetails }) {
        this.children = [new UserBadgeDropdownView(sessionInfo)]
    }
}
