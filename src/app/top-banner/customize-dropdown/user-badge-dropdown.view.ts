import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { Modal } from '@youwol/fv-group'
import { VisitorBadgeView } from '../badges'
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
                class: 'btn  d-flex align-items-center  fv-text-primary yw-text-primary dropdown-toggle yw-btn-focus yw-btn-no-focus-shadow',
                type: 'button',
                id: 'dropdownMenuButton',
                customAttributes: {
                    dataToggle: 'dropdown',
                    ariaHaspopup: 'true',
                },
                ariaExpanded: false,

                children: [
                    {
                        class: 'fa fa-user-circle fa-2x mr-2',
                    },
                    {
                        innerText: sessionInfo.userInfo.temp
                            ? new VisitorBadgeView()
                            : this.sessionInfo.userInfo.name,
                    },
                ],
            },
            {
                class: 'dropdown-menu fv-bg-background yw-animate-in  yw-box-shadow',
                style: {
                    background:
                        'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))',
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
