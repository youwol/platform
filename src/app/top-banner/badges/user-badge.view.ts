import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { AvatarView } from '../../modals/user'

/**
 * @category View
 */
export class RegisteredBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex align-items-center'

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    public readonly customAttributes

    constructor(userInfos: Accounts.UserInfos) {
        this.customAttributes = {
            dataToggle: 'tooltip',
            title: userInfos.name,
        }
        this.children = [
            new AvatarView(userInfos),
            {
                innerText: userInfos.name,
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
    public readonly class: string = 'd-flex align-items-center'

    public readonly children: VirtualDOM[]

    constructor() {
        this.children = [
            {
                class: 'fa fa-users fa-2x mr-2',
                customAttributes: {
                    dataToggle: 'tooltip',
                    // dataPlacement: '*',
                    title: 'You are a visitor',
                    dataCustom: 'custom-tooltip',
                },
            },

            // {
            //     innerText: 'Visitor',
            // },
        ]
    }
}
