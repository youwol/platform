import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { BaseUserFormView, separatorView, redirectWith } from './common'

/**
 * @category View
 */
export class RegisteredFormView extends BaseUserFormView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(userInfos: Accounts.UserInfos) {
        super()
        this.children = [
            new HeaderView(userInfos),
            manageIdentityView,
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
class HeaderView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex flex-column align-items-center px-4 py-2 justify-content-center fv-text-focus'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        fontSize: 'x-large',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(userInfos: Accounts.UserInfos) {
        this.children = [
            {
                class: 'd-flex align-items-center',
                children: [
                    {
                        class: 'px-2',
                        innerText: userInfos.name,
                    },
                ],
            },
            {
                class: 'd-flex align-items-center my-2',
                children: [new AvatarView(userInfos)],
            },
        ]
    }
}

/**
 * @category View
 */
class AvatarView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex align-items-center my-2'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(userInfos: Accounts.UserInfos) {
        this.children = [
            {
                class: 'rounded text-center',
                style: {
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '32px',
                },
                innerText: userInfos.name[0],
            },
            new AvatarPickerView(),
        ]
    }
}

/**
 * @category View
 */
class AvatarPickerView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex flex-column align-items-center fv-text-primary'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        fontSize: 'large',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor() {
        this.children = [
            {
                class: 'fas fa-palette fv-pointer fv-hover-bg-background-alt p-1 rounded',
            },
        ]
    }
}

const manageIdentityView = {
    class: 'container mt-4 fv-text-primary text-center fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center ',
    children: [
        {
            class: 'fas fa-key mx-3',
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

const logAsVisitorView = {
    class: 'd-flex align-items-center my-2 fv-pointer fv-hover-bg-background-alt rounded',
    children: [
        {
            class: 'fas fa-user mx-2',
        },
        {
            innerText: 'visitor',
        },
    ],

    onclick: () => {
        redirectWith('loginAsTempUserUrl')
    },
}

const otherProfilesView = {
    class: 'container fv-text-primary text-center',
    children: [
        {
            innerText: 'Other profiles',
            style: { opacity: '0.5' },
        },
        logAsVisitorView,
    ],
}

const logoutView = {
    class: 'd-flex align-items-center justify-content-center fv-pointer fv-hover-bg-background-alt rounded',
    children: [
        {
            innerText: 'logout',
        },
        { class: 'fas fa-sign-out-alt mx-2' },
    ],
    onclick: () => {
        redirectWith('logoutUrl')
    },
}
