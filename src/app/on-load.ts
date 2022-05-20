import { render, VirtualDOM, Stream$, child$ } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'

import { DesktopFavoritesView } from './desktop/favorites.view'
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
            {
                class: 'position-absolute w-100 h-100',
                style: {
                    top: '0px',
                    left: '0px',
                },
                children: [
                    child$(
                        OsCore.PreferencesFacade.getPreferences$(),
                        (preferences) => {
                            return preferences.desktop.backgroundView
                        },
                    ),
                ],
            },
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
                    new DesktopFavoritesView({ state: this.state }),
                ],
            },
        ]
    }
}

document.getElementById('content').appendChild(render(new PlatformView()))
