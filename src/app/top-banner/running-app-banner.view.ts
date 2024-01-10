import { AnyVirtualDOM, ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import * as OsCore from '@youwol/os-core'
import { EnvironmentBadgesView, LaunchpadBadgeView } from './badges'
import { sessionDetails$ } from './utils.view'
import { CorporationBadgeView } from './badges/corporation.view'
import { ProfilesState } from '../modals/profiles'
import { Accounts } from '@youwol/http-clients'

/**
 * Top banner when an application is running
 *
 * @category View
 */
export class RunningAppBannerView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
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
    public readonly children: ChildrenLike

    constructor(
        state: OsCore.PlatformState,
        profileState: ProfilesState,
        app: OsCore.RunningApp,
    ) {
        this.children = [
            {
                source$: OsCore.PreferencesFacade.getPreferences$(),
                vdomMap: (preferences: OsCore.Preferences) =>
                    new CorporationBadgeView({ preferences, state }),
            },
            new LaunchpadBadgeView({ state }),
            {
                tag: 'div',
                class: 'my-auto d-flex justify-content-between flex-grow-1',
                style: { minWidth: '0px' },
                children: [
                    new RunningAppTitleView(state, app),
                    {
                        tag: 'div',
                        class: 'flex-grow-1 my-auto',
                        style: { minWidth: '0px' },
                        children: [
                            {
                                source$: app.topBannerActions$,
                                vdomMap: (vDOM: AnyVirtualDOM) => {
                                    vDOM.style = { maxHeight: 'fit-content' }
                                    return vDOM
                                },
                            },
                        ],
                    },
                ],
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

/**
 *
 * @category View
 */
class RunningAppTitleView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
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
    public readonly children: ChildrenLike

    constructor(state: OsCore.PlatformState, app: OsCore.RunningApp) {
        const baseClass = 'fas my-auto fv-pointer fv-hover-text-secondary mx-1'

        this.children = [
            {
                tag: 'div',
                class: 'd-flex align-items-center yw-opened-app',
                children: [
                    {
                        source$: app.appMetadata$,
                        vdomMap: (appInfo: OsCore.ApplicationInfo) => {
                            return {
                                tag: 'div',
                                style: {
                                    height: '25px',
                                    width: '25px',
                                    borderRadius: '5px',
                                },
                                children: [appInfo.graphics.appIcon],
                            }
                        },
                    },
                    {
                        source$: app.header$,
                        vdomMap: (view: AnyVirtualDOM) => {
                            return view
                        },
                    },
                ],
            },
            {
                tag: 'div',
                class: 'd-flex align-items-center  rounded p-1 ms-2  ',
                style: {
                    fontSize: 'medium',
                },
                children: [
                    {
                        tag: 'div',
                        class: `${baseClass} fa-minus  `,
                        onclick: () => state.minimize(app.instanceId),
                    },
                    {
                        tag: 'div',
                        class: `${baseClass} fa-clone`,

                        onclick: () => {
                            state.expand(app.instanceId)
                            state.minimize(app.instanceId)
                        },
                    },
                    {
                        tag: 'div',
                        class: `${baseClass} fa-times`,
                        onclick: () => state.close(app.instanceId),
                    },
                ],
            },
        ]
    }
}
