import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { Accounts } from '@youwol/http-clients'
import { Modal } from '@youwol/rx-group-views'
import { RegisteredBadgeView, VisitorBadgeView } from '../badges'
import { ProfilesState } from '../../modals/profiles'
import { RegisteredFormView, VisitorFormView } from '../../modals/user'
import { TooltipsView } from '../../tooltips/tooltips.view'

/**
 * @category View
 */
export class UserBadgeDropdownView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'dropdown '
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group Immutable Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails

    constructor(
        sessionInfo: Accounts.SessionDetails,
        profileState: ProfilesState,
    ) {
        Object.assign(this, { sessionInfo })
        const modalState = new Modal.State()
        ProfilesState.getBootstrap$()

        this.children = [
            {
                tag: 'button',
                class: 'btn  dropdown-toggle fv-font-size-regular yw-border-none fv-font-family-regular d-flex align-items-center  fv-text-primary yw-hover-text-primary dropdown-toggle yw-btn-no-focus-shadow me-2  my-auto  p-1 pe-2 fv-hover-bg-background-alt  yw-btn-focus  rounded   top-banner-menu-view  align-items-center',
                type: 'button',
                id: 'dropdownMenuClickableInside',
                customAttributes: {
                    dataBsToggle: 'dropdown',
                    dataBsAutoClose: 'outside',
                    ariaExpanded: false,
                    ariaHaspopup: 'true',
                },
                children: [
                    sessionInfo.userInfo.temp
                        ? new VisitorBadgeView()
                        : new RegisteredBadgeView(this.sessionInfo),
                ],
            },
            {
                tag: 'div',
                class: 'dropdown-menu fv-bg-background yw-animate-in yw-box-shadow fv-font-size-regular fv-font-family-regular',
                style: {
                    background: '#070707',
                    width: 'fit-content',
                },
                customAttributes: {
                    ariaLabelledby: 'dropdownMenuClickableInside',
                },
                children: [
                    this.sessionInfo.userInfo.temp
                        ? new VisitorFormView({ modalState })
                        : new RegisteredFormView({
                              sessionInfo,
                              state: profileState,
                          }),
                ],
            },
            new TooltipsView({
                tooltipPlace: { top: 7, right: 1 },
                tooltipArrow: {
                    arrowLength: 190,
                    leftRightMove: 65,
                    arrowWidth: 10,
                },
                divId: 'top-dropdown-menu',
                tooltipText:
                    'Click here to register, login and access your profile and account settings.',
            }),
        ]
    }
}
