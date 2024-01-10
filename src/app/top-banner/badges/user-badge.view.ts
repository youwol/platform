import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { Accounts } from '@youwol/http-clients'
import { AvatarView } from '../../modals/user'
import { redirectWith } from '../../modals/user/common'
import { TooltipsView } from '../../tooltips/tooltips.view'

/**
 * @category View
 */
export class RegisteredBadgeView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly customAttributes

    constructor(userDetails: Accounts.SessionDetails) {
        this.customAttributes = {
            dataBSToggle: 'tooltip',
            title: userDetails.userInfo.name,
        }
        this.children = [
            new AvatarView(userDetails.userInfo),
            {
                tag: 'div',
                class: 'ms-2',
                innerText: userDetails.userInfo.name,
            },
        ]
    }
}

/**
 * @category View
 */
export class VisitorBadgeView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string =
        'my-auto   fv-hover-bg-background-alt  yw-btn-focus  rounded   top-banner-menu-view d-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor() {
        this.children = [
            {
                tag: 'div',
                class: 'fa fa-user-circle fa-2x me-2',
                customAttributes: {
                    dataBSToggle: 'tooltip',
                    title: 'You are a visitor',
                    dataCustom: 'custom-tooltip',
                },
            },
        ]
    }
}

/**
 * @category View
 */
export class LoginBadgeView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string = 'me-1 align-items-center'
    public readonly style = {
        position: 'relative' as const,
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly id = 'visitorLogin'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor() {
        this.children = [
            {
                tag: 'div',
                class: 'fas fa-sign-in-alt fa-2x fv-hover-bg-background-alt p-1 yw-btn-focus  rounded fv-pointer  top-banner-menu-view',
                customAttributes: {
                    dataBSToggle: 'tooltip',
                    title: 'Login to platform',
                    dataCustom: 'custom-tooltip',
                },
                onclick: () => redirectWith('loginAsUserUrl'),
            },
            new TooltipsView({
                tooltipPlace: { top: 3, right: 6 },
                tooltipArrow: {
                    arrowLength: 50,
                    leftRightMove: 100,
                    arrowWidth: 0,
                },
                divId: 'login-badge',
                tooltipText:
                    'If you already have an account, click here to login directly.',
            }),
        ]
    }
}
