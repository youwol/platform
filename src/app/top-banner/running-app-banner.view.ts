import { child$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { EnvironmentBadgesView, LaunchpadBadgeView } from './badges'
import { sessionDetails$ } from './utils.view'

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
    public readonly children: VirtualDOM[]

    constructor(state: OsCore.PlatformState, app: OsCore.RunningApp) {
        this.children = [
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
                                vDOM.style = { maxHeight: '32px' }
                                return vDOM
                            }),
                        ],
                    },
                ],
            },
            child$(sessionDetails$, (sessionInfo) => {
                return new EnvironmentBadgesView({ sessionInfo })
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
        height: 'fit-content',
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
                class: 'd-flex align-items-center border rounded p-1 fv-xx-darker fv-bg-background-alt',
                style: {
                    fontSize: '11px',
                },
                children: [
                    {
                        class: `${baseClass} fa-minus-square fv-xx-lighter `,
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
