import {
    attr$,
    Stream$,
    VirtualDOM,
    childrenAppendOnly$,
} from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { filter, map } from 'rxjs/operators'

export class RunningAppView implements VirtualDOM {
    public readonly class: Stream$<OsCore.RunningApp, string>
    public readonly state: OsCore.PlatformState
    public readonly children
    public readonly style = {
        zIndex: 2,
    }
    cacheRunningAppsView = {}

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
