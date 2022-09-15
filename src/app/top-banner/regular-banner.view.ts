import { child$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { EnvironmentBadgesView, LaunchpadBadgeView } from './badges'
import { sessionDetails$ } from './utils.view'

/**
 * Regular top banner of the application (no application running)
 *
 * @category View.TopBanner
 */
export class RegularBannerView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(state: OsCore.PlatformState) {
        this.children = [
            new LaunchpadBadgeView({ state }),
            {
                class: 'flex-grow-1 my-auto h-100',
                children: [
                    child$(
                        OsCore.PreferencesFacade.getPreferences$(),
                        (preferences) => {
                            return preferences.desktop.topBannerView
                        },
                    ),
                ],
            },
            child$(sessionDetails$, (sessionInfo) => {
                return new EnvironmentBadgesView({ sessionInfo })
            }),
        ]
    }
}
