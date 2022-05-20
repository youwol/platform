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
                innerHTML: `
<svg id="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109.58 121.1">
  <defs></defs>
  <title>logo_YouWol_white</title>
  <polygon class="fv-fill-primary" points="109.58 94.68 109.58 84.14 91.39 73.64 109.58 63.14 109.58 42.06 63.95 68.41 63.94 68.41 63.94 121.1 82.2 110.56 82.2 89.41 100.52 99.99 109.58 94.76 109.58 94.68"/>
  <polygon class="fv-fill-primary" points="54.8 52.69 9.17 26.35 27.42 15.81 45.61 26.31 45.61 5.31 54.73 0.04 54.8 0 63.86 5.23 63.86 26.39 82.18 15.81 100.43 26.35 54.8 52.7 54.8 52.69"/>
  <polygon class="fv-fill-primary" points="0.07 94.72 9.2 99.99 27.38 89.49 27.38 110.56 45.64 121.1 45.64 68.41 45.64 68.41 0.01 42.06 0.01 63.14 18.33 73.64 0 84.22 0 94.68 0.07 94.72"/>
</svg>`,
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
