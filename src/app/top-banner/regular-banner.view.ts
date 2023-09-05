import { child$, children$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { EnvironmentBadgesView, LaunchpadBadgeView } from './badges'
import { sessionDetails$ } from './utils.view'
import { CorporationBadgeView } from './badges/corporation.view'
import { ProfilesState } from '../modals/profiles'

/**
 * Regular top banner of the application (no application running)
 *
 * @category View
 */
export class RegularBannerView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex yw-home-icon'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        height: '40px',
    }

    constructor(state: OsCore.PlatformState, profileState: ProfilesState) {
        this.children = [
            child$(
                OsCore.PreferencesFacade.getPreferences$(),
                (preferences) =>
                    new CorporationBadgeView({ preferences, state }),
            ),
            new LaunchpadBadgeView({ state }),
            {
                class: 'flex-grow-1 my-auto h-100 d-flex justify-content-around',
                children: children$(
                    OsCore.PreferencesFacade.getPreferences$(),
                    (preferences) =>
                        OsCore.PreferencesExtractor.getTopBannerWidgets(
                            preferences,
                            { platformState: state },
                        ),
                ),
            },
            child$(sessionDetails$, (sessionInfo) => {
                return new EnvironmentBadgesView({ sessionInfo, profileState })
            }),
        ]
    }
}
