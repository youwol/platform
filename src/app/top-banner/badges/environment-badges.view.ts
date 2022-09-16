import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { UserBadgeView } from './user-badge.view'
import { SettingsBadgeView } from './settings-badge.view'

/**
 *
 * @category View.TopBanner
 */
export class EnvironmentBadgesView implements VirtualDOM {
    public readonly class = 'my-auto d-flex align-items-center'
    public readonly children: VirtualDOM[]
    constructor({ sessionInfo }: { sessionInfo: Accounts.SessionDetails }) {
        this.children = [
            new UserBadgeView(sessionInfo),
            new SettingsBadgeView(sessionInfo),
        ]
    }
}
