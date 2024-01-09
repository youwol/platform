import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import * as OsCore from '@youwol/os-core'
import { RunningAppBannerView } from './running-app-banner.view'
import { RegularBannerView } from './regular-banner.view'
import { ProfilesState } from '../modals/profiles'

/**
 *
 * @category View
 */
export class PlatformBannerView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group States
     */
    public readonly profileState: ProfilesState
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(params: {
        state: OsCore.PlatformState
        profileState: ProfilesState
        [key: string]: unknown
    }) {
        Object.assign(this, params)
        this.children = [
            {
                source$: this.state.runningApplication$,
                vdomMap: (app: OsCore.RunningApp) =>
                    app == undefined
                        ? new RegularBannerView(this.state, this.profileState)
                        : new RunningAppBannerView(
                              this.state,
                              this.profileState,
                              app,
                          ),
            },
        ]
    }
}
