import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { redirectWith } from './user/common'

type SessionInfo =
    | Accounts.SessionBaseDetails
    | Accounts.SessionImpersonationDetails

export class RegisteredUserBadgeView implements VirtualDOM {
    public readonly class = 'd-flex align-items-center'
    public readonly children: VirtualDOM[]
    public readonly sessionInfo: SessionInfo

    constructor(params: { sessionInfo: SessionInfo }) {
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
                        class: 'fas fa-sync  fv-hover-text-focus',
                        onclick: () => redirectWith('loginAsUserUrl'),
                    },
                    {
                        style: {
                            marginTop: '2px',
                        },
                    },
                    {
                        class: 'fas fa-sign-out-alt position-relative  fv-hover-text-focus',
                        onclick: () => redirectWith('logoutUrl'),
                    },
                ],
            },
        ]
    }
}

export class VisitorBadgeView implements VirtualDOM {
    public readonly class = 'd-flex align-items-center'
    public readonly children: VirtualDOM[]
    public readonly sessionInfo: SessionInfo

    constructor(params: { sessionInfo: SessionInfo }) {
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
