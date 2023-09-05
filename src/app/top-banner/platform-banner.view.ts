import { child$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { RunningAppBannerView } from './running-app-banner.view'
import { RegularBannerView } from './regular-banner.view'
import { ProfilesState } from '../modals/profiles'

/**
 *
 * @category View
 */
export class PlatformBannerView implements VirtualDOM {
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
    public readonly children: VirtualDOM[]

    constructor(params: {
        state: OsCore.PlatformState
        profileState: ProfilesState
        [key: string]: unknown
    }) {
        Object.assign(this, params)
        this.children = [
            child$(this.state.runningApplication$, (app) =>
                app == undefined
                    ? new RegularBannerView(this.state, this.profileState)
                    : new RunningAppBannerView(
                          this.state,
                          this.profileState,
                          app,
                      ),
            ),
        ]
    }
}
