import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { redirectWith } from './user'

/**
 * @category View
 */
export class RegisteredUserBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails

    constructor(params: { sessionInfo: Accounts.SessionDetails }) {
        Object.assign(this, params)

        this.children = [
            {
                class: 'fas fa-user fa-2x',
            },
            {
                class: 'mx-1',
            },
            {
                class: 'd-flex flex-column h-100 justify-content-between',
                onclick: (ev) => ev.stopPropagation(),
                children: [
                    {
                        class: 'fas fa-sign-out-alt position-relative  fv-hover-text-focus',
                        onclick: () => redirectWith('logoutUrl'),
                    },
                    ...(this.sessionInfo.userInfo.groups
                        .map((grp) => grp.path)
                        .includes('/youwol-users/youwol-devs/youwol-admins')
                        ? this.youwolAdminActions()
                        : []),
                ],
            },
        ]
    }

    youwolAdminActions(): VirtualDOM[] {
        return [
            {
                style: {
                    marginTop: '2px',
                },
            },
            {
                class: 'fas fa-user-secret  fv-hover-text-focus',
                onclick: () => redirectWith('loginAsTempUserUrl'),
            },
        ]
    }
}

/**
 * @category View
 */
export class VisitorBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails

    constructor(params: { sessionInfo: Accounts.SessionDetails }) {
        Object.assign(this, params)

        this.children = [
            {
                class: 'fas fa-user-secret fa-2x',
            },
            {
                class: 'mx-1',
            },
            {
                class: 'd-flex flex-column h-100 justify-content-between',
                onclick: (ev) => ev.stopPropagation(),
                children: [
                    {
                        class: 'fas fa-registered fv-hover-text-focus',
                        onclick: () => redirectWith('loginAsUserUrl'),
                    },
                    {
                        style: {
                            marginTop: '2px',
                        },
                    },
                    {
                        class: 'fas fa-sign-in-alt position-relative  fv-hover-text-focus',
                        onclick: () => redirectWith('loginAsUserUrl'),
                    },
                ],
            },
        ]
    }
}
