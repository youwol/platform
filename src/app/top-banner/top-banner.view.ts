import { child$, children$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { UserAllSettingsView } from './user'
import { TopBannerMenuView } from './top-banner-menu.view'
import { ApplicationsLaunchPadView } from './launch-pad-menu.view'
import { map, shareReplay } from 'rxjs/operators'
import { AssetsGateway, raiseHTTPErrors, Accounts } from '@youwol/http-clients'
import { RegisteredUserBadgeView, VisitorBadgeView } from './badges.view'

const sessionDetails$ = new AssetsGateway.Client().accounts
    .getSessionDetails$()
    .pipe(raiseHTTPErrors(), shareReplay({ bufferSize: 1, refCount: true }))

/**
 *
 * @param state
 * @category View.TopBanner
 */
function getUserBadgeView$(state) {
    return child$(sessionDetails$, (sessionInfo) => {
        return new EnvironmentMenuView({ state, sessionInfo })
    })
}

/**
 *
 * @category View.TopBanner
 */
export class PlatformBannerView implements VirtualDOM {
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(params: {
        state: OsCore.PlatformState
        [key: string]: unknown
    }) {
        Object.assign(this, params)
        this.children = [
            child$(this.state.runningApplication$, (app) =>
                app == undefined
                    ? new RegularBannerView(this.state)
                    : new RunningAppBannerView(this.state, app),
            ),
        ]
    }
}

/**
 *
 * @category View.TopBanner
 */
class YouwolMenuView extends TopBannerMenuView {
    constructor({ state }: { state: OsCore.PlatformState }) {
        super({
            state,
            iconView: {
                class: 'd-flex flex-wrap',
                style: {
                    width: '30px',
                },
                children: children$(
                    state.runningApplications$.pipe(
                        map(
                            (apps) =>
                                new Set(apps.map((app) => app.cdnPackage)),
                        ),
                    ),
                    (distinctApps) =>
                        Array(9)
                            .fill(null)
                            .map((_, i) => {
                                return {
                                    class:
                                        'border rounded ' +
                                        (i < distinctApps.size
                                            ? 'fv-bg-success'
                                            : 'fv-bg-primary'),
                                    style: {
                                        width: '8px',
                                        height: '8px',
                                        margin: '1px',
                                    },
                                }
                            }),
                ),
            },
            contentView: () => new ApplicationsLaunchPadView({ state }),
        })
    }
}

/**
 *
 * @category View.TopBanner
 */
class EnvironmentMenuView extends TopBannerMenuView {
    constructor({
        state,
        sessionInfo,
    }: {
        state: OsCore.PlatformState
        sessionInfo: Accounts.SessionDetails
    }) {
        super({
            state,
            iconView: sessionInfo.userInfo.temp
                ? new VisitorBadgeView({
                      sessionInfo,
                  })
                : new RegisteredUserBadgeView({
                      sessionInfo,
                  }),
            contentView: () =>
                new UserAllSettingsView({
                    sessionInfo,
                }),
        })
    }
}
/**
 * Regular top banner of the application (no application running)
 *
 * @category View.TopBanner
 */
class RegularBannerView implements VirtualDOM {
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
            new YouwolMenuView({ state }),
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
            getUserBadgeView$(state),
        ]
    }
}

/**
 * Top banner when an application is running
 *
 * @category View
 */
class RunningAppBannerView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex w-100'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(state: OsCore.PlatformState, app: OsCore.RunningApp) {
        this.children = [
            new YouwolMenuView({ state }),
            {
                class: 'my-auto d-flex justify-content-between flex-grow-1',
                style: { minWidth: '0px' },
                children: [
                    new RunningAppTitleView(state, app),
                    {
                        class: 'flex-grow-1 my-auto',
                        style: { minWidth: '0px' },
                        children: [
                            child$(app.topBannerActions$, (vDOM) => vDOM),
                        ],
                    },
                ],
            },
            getUserBadgeView$(state),
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
        'd-flex align-items-center mx-3 px-2 py-1 rounded fv-border-primary my-auto'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        height: 'fit-content',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(state: OsCore.PlatformState, app: OsCore.RunningApp) {
        const baseClass = 'fas my-auto fv-pointer fv-hover-text-secondary mx-1'

        this.children = [
            {
                class: 'd-flex align-items-center',
                children: [
                    child$(
                        app.appMetadata$,
                        (appInfo) => appInfo.graphics.appIcon,
                    ),
                    { class: 'mx-1' },
                    child$(app.header$, (view) => view),
                ],
            },
            {
                class: 'd-flex align-items-center',
                children: [
                    {
                        class: `${baseClass} fa-minus-square`,
                        onclick: () => state.minimize(app.instanceId),
                    },
                    {
                        class: `${baseClass} fa-external-link-alt`,
                        onclick: () => state.expand(app.instanceId),
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
