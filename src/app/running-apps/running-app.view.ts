import {
    attr$,
    Stream$,
    VirtualDOM,
    childrenAppendOnly$,
} from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { filter, map } from 'rxjs/operators'

/**
 * @category View
 */
export class RunningAppView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: Stream$<OsCore.RunningApp, string>
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group Immutable DOM Constants
     */
    public readonly children
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        zIndex: 2,
    }
    /**
     * @group Mutable
     */
    private cacheRunningAppsView = {}

    constructor(params: { state: OsCore.PlatformState }) {
        Object.assign(this, params)
        this.class = attr$(this.state.runningApplication$, (app) =>
            app == undefined ? 'd-none' : 'h-100 flex-grow-1 d-flex',
        )
        this.children = childrenAppendOnly$(
            this.state.runningApplication$.pipe(
                filter(
                    (app) =>
                        app &&
                        this.cacheRunningAppsView[app.instanceId] == undefined,
                ),
                map((app) => [app]),
            ),
            (runningApp: OsCore.RunningApp) => {
                const view = runningApp.view
                this.cacheRunningAppsView[runningApp.instanceId] = view
                return view
            },
        )
    }
}
