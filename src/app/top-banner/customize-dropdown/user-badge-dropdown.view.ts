import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { Modal } from '@youwol/fv-group'
import { RegisteredBadgeView, VisitorBadgeView } from '../badges'
import { ProfilesState } from '../../modals/profiles'
import { RegisteredFormView, VisitorFormView } from '../../modals/user'

/**
 * @category View
 */
export class UserBadgeDropdownView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'dropdown '
    public readonly style = {
        height: '25px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    /**
     * @group Immutable Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails

    constructor(sessionInfo: Accounts.SessionDetails) {
        Object.assign(this, { sessionInfo })

        const modalState = new Modal.State()
        ProfilesState.getBootstrap$()

        this.children = [
            {
                tag: 'button',
                class: 'btn p-0  fv-font-size-regular fv-font-family-regular d-flex align-items-center  fv-text-primary yw-text-primary dropdown-toggle fv-hover-bg-background-alt yw-btn-focus yw-btn-no-focus-shadow',
                type: 'button',
                id: 'dropdownMenuButton',
                customAttributes: {
                    dataToggle: 'dropdown',
                    ariaHaspopup: 'true',
                },
                ariaExpanded: false,

                children: [
                    sessionInfo.userInfo.temp
                        ? new VisitorBadgeView()
                        : new RegisteredBadgeView(this.sessionInfo.userInfo),
                ],
            },
            {
                class: 'dropdown-menu fv-bg-background yw-animate-in  yw-box-shadow  fv-font-size-regular fv-font-family-regular',
                style: {
                    background: '#070707',
                },
                customAttributes: {
                    ariaLabelledby: 'dropdownMenuButton',
                },
                children: [
                    this.sessionInfo.userInfo.temp
                        ? new VisitorFormView({ modalState })
                        : new RegisteredFormView(sessionInfo),
                ],
            },
        ]
    }
}
