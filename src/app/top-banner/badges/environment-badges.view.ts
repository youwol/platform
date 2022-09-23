import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { UserBadgeView } from './user-badge.view'
import { ProfilesBadgeView } from './profiles-badge.view'

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
        this.children = [
            new UserBadgeView(sessionInfo),
            new ProfilesBadgeView(sessionInfo),
        ]
    }
}
