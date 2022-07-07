import { child$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { EnvironmentView } from './environment-menu.view'
import { TopBannerMenuView } from './top-banner-menu.view'
import { ApplicationsLaunchPadView } from './launch-pad-menu.view'

export class PlatformBannerView implements VirtualDOM {
    public readonly state: OsCore.PlatformState
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

class EnvironmentMenuView extends TopBannerMenuView {
    constructor({ state }: { state: OsCore.PlatformState }) {
        super({
            state,
            iconView: child$(
                OsCore.PreferencesFacade.getPreferences$(),
                (preferences) => {
                    return preferences.profile.avatar
                },
            ),
            contentView: () => new EnvironmentView(),
        })
    }
}

/**
 * Regular top banner of the application (no application running)
 */
class RegularBannerView implements VirtualDOM {
    public readonly class = 'd-flex'
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
            new EnvironmentMenuView({ state }),
        ]
    }
}

/**
 * Top banner when an application is running
 */
class RunningAppBannerView implements VirtualDOM {
    public readonly class = 'd-flex w-100'
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
            new EnvironmentMenuView({ state }),
        ]
    }
}

class RunningAppTitleView implements VirtualDOM {
    public readonly class =
        'd-flex align-items-center mx-3 px-2 py-1 rounded fv-border-primary my-auto'
    public readonly style = {
        height: 'fit-content',
    }
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
