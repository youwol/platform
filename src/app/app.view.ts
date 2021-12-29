import { attr$, childrenAppendOnly$, Stream$, VirtualDOM } from '@youwol/flux-view'
import {
    PlatformBannerView, PlatformState, RunningApp, SettingsMenuItem,
    PlatformSettingsStore
} from '@youwol/platform-essentials'

import { filter, map } from 'rxjs/operators'


export class AppView implements VirtualDOM {

    public readonly class = 'h-100 w-100 d-flex flex-column fv-text-primary'
    public readonly state = new PlatformState()
    public readonly children: VirtualDOM[]
    public readonly style: Stream$<string, { backgroundImage: string }>

    cacheRunningAppsView = {}

    constructor() {

        this.style = attr$(
            PlatformSettingsStore.desktopImages$,
            (url) => ({ backgroundImage: url })
        )

        this.children = [
            new PlatformBannerView({ state: this.state, class: 'fv-bg-background', style: { opacity: '0.85' } } as any),
            {
                class: attr$(
                    this.state.runningApplication$,
                    (app) => app == undefined ? 'd-none' : 'h-100 d-flex'
                ),
                children: childrenAppendOnly$(
                    this.state.runningApplication$.pipe(
                        filter(app => app && this.cacheRunningAppsView[app.instanceId] == undefined),
                        map(app => [app])
                    ),
                    (runningApp: RunningApp) => {
                        let view = runningApp.view
                        this.cacheRunningAppsView[runningApp.instanceId] = view
                        return view
                    }
                )
            }
        ]
    }
}


