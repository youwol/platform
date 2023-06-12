import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { separatorView, redirectWith } from './common'
import { ProfilesBadgeView } from '../../top-banner/badges'

/**
 * @category View
 */
export class RegisteredFormView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'dropdown-item bg-transparent fv-hover-bg-background'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(sessionInfo: Accounts.SessionDetails) {
        this.children = [
            manageIdentityView,
            new ProfilesBadgeView(sessionInfo),
            separatorView,
            otherProfilesView,
            separatorView,
            logoutView,
        ]
    }
}

/**
 * @category View
 */
export class AvatarView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex align-items-center mr-2'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(userInfos: Accounts.UserInfos) {
        this.children = [
            {
                class: 'rounded text-center',
                style: {
                    width: '35px',
                    height: 'auto',
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    padding: '5px',
                },
                innerText: userInfos.name
                    .split(' ')
                    .map((name) => name.charAt(0))
                    .join(''),
            },
        ]
    }
}

export const manageIdentityView = {
    class: 'mt-2 p-1 fv-text-primary yw-text-primary  text-center fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center ',
    children: [
        {
            class: 'fas fa-address-card mx-3',
        },
        {
            innerText: 'Manage your identity',
        },
    ],
    onclick: () => {
        window
            .open(
                'https://platform.youwol.com/auth/realms/youwol/account/#/',
                '_blank',
            )
            .focus()
    },
}

export const logAsVisitorView = {
    class: 'mt-2 p-1 fv-text-primary yw-text-primary  text-center fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center',
    children: [
        {
            class: 'fas fa-users mx-2',
        },
        {
            innerText: 'Visitor',
        },
    ],

    onclick: () => {
        redirectWith('loginAsTempUserUrl')
    },
}

export const otherProfilesView = {
    class: 'container fv-text-primary text-center',
    children: [
        {
            innerText: 'Other profiles',
            style: { opacity: '0.5' },
        },
        logAsVisitorView,
    ],
}

export const logoutView = {
    class: 'd-flex fv-text-primary yw-text-primary bg-danger bg-gradient p-1 align-items-center justify-content-center fv-pointer  rounded',
    children: [
        { class: 'fas fa-sign-out-alt mx-2' },
        {
            innerText: 'Logout',
        },
    ],
    onclick: () => {
        redirectWith('logoutUrl')
    },
}
