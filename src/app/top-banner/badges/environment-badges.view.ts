import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { Accounts } from '@youwol/http-clients'
import { UserBadgeDropdownView } from '../customize-dropdown/user-badge-dropdown.view'
import { LoginBadgeView } from './user-badge.view'
import { ProfilesState } from '../../modals/profiles'

/**
 *
 * @category View
 */
export class EnvironmentBadgesView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        ' d-flex align-items-center  yw-btn-focus align-self-center '
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor({
        sessionInfo,
        profileState,
    }: {
        sessionInfo: Accounts.SessionDetails
        profileState: ProfilesState
    }) {
        this.children =
            // [new UserBadgeDropdownView(sessionInfo)]
            sessionInfo.userInfo.temp
                ? [
                      new LoginBadgeView(),
                      new UserBadgeDropdownView(sessionInfo, profileState),
                  ]
                : [new UserBadgeDropdownView(sessionInfo, profileState)]
    }
}
