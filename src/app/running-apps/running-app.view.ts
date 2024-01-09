import { AttributeLike, ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import * as OsCore from '@youwol/os-core'
import { filter, map } from 'rxjs/operators'

/**
 * @category View
 */
export class RunningAppView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: AttributeLike<string>
    // Stream$<OsCore.RunningApp, string>
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
        this.class = {
            source$: this.state.runningApplication$,
            vdomMap: (app) =>
                app == undefined
                    ? 'd-none '
                    : 'h-100 flex-grow-1 d-flex yw-animate-in fv-bg-background-alt pt-1',
        }

        this.children = {
            policy: 'append',
            source$: this.state.runningApplication$.pipe(
                filter(
                    (app) =>
                        app &&
                        this.cacheRunningAppsView[app.instanceId] == undefined,
                ),
                map((app) => [app]),
            ),
            vdomMap: (runningApp: OsCore.RunningApp) => {
                const view = runningApp.view
                this.cacheRunningAppsView[runningApp.instanceId] = view
                return view
            },
        }
    }
}
