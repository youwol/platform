import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'

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
        lineHeight: '1.8em',
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
    public readonly class: string = 'fas fa-user-circle px-1'
}
