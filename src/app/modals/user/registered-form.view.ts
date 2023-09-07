import { children$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { separatorView, redirectWith } from './common'

import { NewProfileItemView, ProfileItemView, ProfilesState } from '../profiles'

/**
 * @category View
 */
export class RegisteredFormView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = ' bg-transparent fv-hover-bg-background'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({
        sessionInfo,
        state,
    }: {
        sessionInfo: Accounts.SessionDetails
        state: ProfilesState
    }) {
        this.children = [
            new AccountBadge(sessionInfo.userInfo),
            manageIdentityView,
            separatorView,
            otherProfilesView,
            new AllProfilesView({ state }),
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
    public readonly class =
        'd-flex justify-content-center align-items-center rounded me-2'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: '25px',
        height: '25px',
        backgroundColor: 'red',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(userInfos: Accounts.UserInfos) {
        this.children = [
            {
                class: 'rounded text-center',
                style: {
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '13px',
                },
                innerText: userInfos.name
                    .split(' ')
                    .map((name) => name.charAt(0))
                    .join(''),
            },
        ]
    }
}

export const baseDropdownItemsClass =
    'dropdown-item  fv-text-primary yw-hover-text-primary  text-center fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center mb-1 px-3'
export const manageIdentityView = {
    class: baseDropdownItemsClass,
    children: [
        {
            class: 'd-flex justify-content-center align-items-center me-2 ',
            style: {
                width: '25px',
            },
            children: [
                {
                    class: 'fas fa-address-card fa-lg  ',
                },
            ],
        },
        {
            innerText: 'Manage account',
        },
    ],
    onclick: () => {
        window
            .open(
                'https://platform.int.youwol.com/auth/realms/youwol/account/#/',
                '_blank',
            )
            .focus()
    },
}

export const otherProfilesView = {
    class: 'container p-0 m-0 fv-text-primary text-center',
    children: [
        {
            innerText: 'Profiles',
            style: { opacity: '0.5' },
        },
    ],
}

export const logoutView = {
    class: baseDropdownItemsClass,
    children: [
        {
            class: 'd-flex justify-content-center align-items-center me-2 ',
            style: {
                width: '25px',
            },
            children: [{ class: 'fas fa-sign-out-alt fa-lg ' }],
        },
        {
            innerText: 'Logout',
        },
    ],
    onclick: () => {
        redirectWith('logoutUrl', { login_flow: 'temp' })
    },
}

export class AllProfilesView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'w-100 accordion accordion-flush'
    /**
     * @group Immutable DOM Constants
     */
    public readonly id = 'accordionFlushExample'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: Stream$<
        { id: string; name: string }[],
        VirtualDOM[]
    >

    constructor({ state }: { state: ProfilesState }) {
        this.children = children$(state.profiles$, (profiles) => {
            return [
                ...profiles.map(
                    (profile) => new ProfileItemView({ profile, state }),
                ),
                new NewProfileItemView({ state }),
            ]
        })
    }
}

export class AccountBadge implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'dropdown-item  fv-text-primary yw-text-primary  text-center fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center px-3'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        pointerEvents: 'none',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(userInfos: Accounts.UserInfos) {
        this.children = [
            new AvatarView(userInfos),
            { innerText: userInfos.name },
        ]
    }
}
