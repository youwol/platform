import { attr$, child$, render, Stream$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { RunningApp } from '@youwol/os-core'

import { RunningAppView } from './running-apps/running-app.view'
import { PlatformBannerView } from './top-banner/top-banner.view'

require('./style.css')

export class PlatformView implements VirtualDOM {
    public readonly class =
        'h-100 w-100 d-flex flex-column fv-text-primary position-relative'
    public readonly state = new OsCore.PlatformState()
    public readonly children: VirtualDOM[]
    public readonly style: Stream$<
        { [_key: string]: string },
        { [_key: string]: string }
    >

    constructor() {
        this.children = [
            new BackgroundView(),
            new PlatformBannerView({
                state: this.state,
                class: 'fv-bg-background',
                style: {
                    background:
                        'linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.7))',
                    zIndex: 0,
                },
            }),
            {
                class: 'd-flex align-items-center flex-grow-1 w-100',
                children: [
                    new RunningAppView({ state: this.state }),
                    new DesktopWidgetsView({ state: this.state }),
                ],
            },
        ]
    }
}

export class BackgroundView implements VirtualDOM {
    public readonly class = 'position-absolute w-100 h-100'
    public readonly style = {
        top: '0px',
        left: '0px',
        zIndex: '-1',
    }
    public readonly children: VirtualDOM[]
    constructor() {
        this.children = [
            child$(
                OsCore.PreferencesFacade.getPreferences$(),
                (preferences) => {
                    return preferences.desktop.backgroundView
                },
            ),
        ]
    }
}

export class DesktopWidgetsView {
    public readonly class: Stream$<RunningApp, string>
    public readonly children: VirtualDOM[]
    public readonly state: OsCore.PlatformState

    constructor(params: { state: OsCore.PlatformState }) {
        Object.assign(this, params)

        this.class = attr$(
            this.state.runningApplication$,
            (runningApp): string => (runningApp ? 'd-none' : 'd-flex'),
            {
                wrapper: (d) => `w-100 h-100 p-2 ${d}`,
            },
        )
        this.children = [
            child$(
                OsCore.PreferencesFacade.getPreferences$(),
                (preferences) => {
                    return preferences.desktop['widgets'] || {}
                },
            ),
        ]
    }
}

document.getElementById('content').appendChild(render(new PlatformView()))
