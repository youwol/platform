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
            {
                class: 'd-flex rounded fv-border-primary px-2 mx-1',
                children: [
                    {
                        class: 'fas fa-puzzle-piece p-1 fv-hover-bg-background-alt rounded fv-pointer',
                    },
                    {
                        class: 'fas fa-puzzle-piece p-1 fv-hover-bg-background-alt rounded fv-pointer',
                    },
                    {
                        class: 'fas fa-puzzle-piece p-1 fv-hover-bg-background-alt rounded fv-pointer',
                    },
                ],
            },
            {
                class: 'far fa-envelope p-1 mx-2 fv-hover-bg-background-alt rounded fv-pointer',
            },
            new UserBadgeView(sessionInfo),
            new SettingsBadgeView(sessionInfo),
        ]
    }
}
