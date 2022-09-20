import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { VisitorFormView, RegisteredFormView } from '../../modals/user'
import { popupModal } from '../../modals'

/**
 * @category View
 */
export class RegisteredBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'rounded text-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: '25px',
        height: '25px',
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 'bold',
        lineHeight: '1.6em',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly innerText: string

    constructor(userInfos: Accounts.UserInfos) {
        this.innerText = userInfos.name[0]
    }
}

/**
 * @category View
 */
export class VisitorBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        transform: 'scale(1.3)',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string = 'fas fa-user px-1'
}

/**
 * @category View
 */
export class UserBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'rounded fv-pointer py-1 px-1 fv-hover-bg-background-alt '
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: (ev: MouseEvent) => void

    constructor(sessionInfo: Accounts.SessionDetails) {
        Object.assign(this, { sessionInfo })
        this.children = [
            sessionInfo.userInfo.temp
                ? new VisitorBadgeView()
                : new RegisteredBadgeView(this.sessionInfo.userInfo),
        ]

        this.onclick = () =>
            popupModal(() =>
                this.sessionInfo.userInfo.temp
                    ? new VisitorFormView()
                    : new RegisteredFormView(sessionInfo.userInfo),
            )
    }
}
