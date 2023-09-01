import { child$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { EnvironmentBadgesView, LaunchpadBadgeView } from './badges'
import { sessionDetails$ } from './utils.view'
import { CorporationBadgeView } from './badges/corporation.view'
import { ProfilesState } from '../modals/profiles'

/**
 * Top banner when an application is running
 *
 * @category View
 */
export class RunningAppBannerView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex w-100'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = { height: '40px' }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(
        state: OsCore.PlatformState,
        profileState: ProfilesState,
        app: OsCore.RunningApp,
    ) {
        this.children = [
            child$(
                OsCore.PreferencesFacade.getPreferences$(),
                (preferences) =>
                    new CorporationBadgeView({ preferences, state, app }),
            ),
            new LaunchpadBadgeView({ state }),
            {
                class: 'my-auto d-flex justify-content-between flex-grow-1',
                style: { minWidth: '0px' },
                children: [
                    new RunningAppTitleView(state, app),
                    {
                        class: 'flex-grow-1 my-auto',
                        style: { minWidth: '0px' },
                        children: [
                            child$(app.topBannerActions$, (vDOM) => {
                                vDOM.style = { maxHeight: 'fit-content' }
                                return vDOM
                            }),
                        ],
                    },
                ],
            },
            child$(sessionDetails$, (sessionInfo) => {
                return new EnvironmentBadgesView({ sessionInfo, profileState })
            }),
        ]
    }
}

/**
 *
 * @category View
 */
class RunningAppTitleView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex align-items-center mx-3 px-2 my-auto fv-bg-background-alt rounded overflow-hidden'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        height: '33px',
        fontSize: '13px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(state: OsCore.PlatformState, app: OsCore.RunningApp) {
        const baseClass = 'fas my-auto fv-pointer fv-hover-text-secondary mx-1'

        this.children = [
            {
                class: 'd-flex align-items-center yw-opened-app',
                children: [
                    child$(
                        app.appMetadata$,
                        (appInfo) => appInfo.graphics.appIcon,
                    ),
                    // { class: 'mx-1' },
                    child$(app.header$, (view) => view),
                ],
            },
            {
                class: 'd-flex align-items-center  rounded p-1 ms-2  ',
                style: {
                    fontSize: 'medium',
                },
                children: [
                    {
                        class: `${baseClass} fa-minus  `,
                        onclick: () => state.minimize(app.instanceId),
                    },
                    {
                        class: `${baseClass} fa-clone`,

                        onclick: () => {
                            state.expand(app.instanceId)
                            state.minimize(app.instanceId)
                        },
                    },
                    {
                        class: `${baseClass} fa-times`,
                        onclick: () => state.close(app.instanceId),
                    },
                ],
            },
        ]
    }
}
