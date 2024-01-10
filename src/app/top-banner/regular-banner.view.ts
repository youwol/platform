import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import * as OsCore from '@youwol/os-core'
import { EnvironmentBadgesView, LaunchpadBadgeView } from './badges'
import { sessionDetails$ } from './utils.view'
import { CorporationBadgeView } from './badges/corporation.view'
import { ProfilesState } from '../modals/profiles'
import { Accounts } from '@youwol/http-clients'

/**
 * Regular top banner of the application (no application running)
 *
 * @category View
 */
export class RegularBannerView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex yw-home-icon'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        height: '40px',
    }

    constructor(state: OsCore.PlatformState, profileState: ProfilesState) {
        this.children = [
            {
                source$: OsCore.PreferencesFacade.getPreferences$(),
                vdomMap: (preferences: OsCore.Preferences) =>
                    new CorporationBadgeView({ preferences, state }),
            },
            new LaunchpadBadgeView({ state }),
            {
                tag: 'div',
                class: 'flex-grow-1 my-auto h-100 d-flex justify-content-around',
                children: {
                    policy: 'replace',
                    source$: OsCore.PreferencesFacade.getPreferences$(),
                    vdomMap: (preferences: OsCore.Preferences) =>
                        OsCore.PreferencesExtractor.getTopBannerWidgets(
                            preferences,
                            { platformState: state },
                        ),
                },
            },
            {
                source$: sessionDetails$,
                vdomMap: (
                    sessionInfo:
                        | Accounts.SessionImpersonationDetails
                        | Accounts.SessionBaseDetails,
                ) => {
                    return new EnvironmentBadgesView({
                        sessionInfo,
                        profileState,
                    })
                },
            },
        ]
    }
}
