import {
    attr$,
    child$,
    children$,
    render,
    Stream$,
    VirtualDOM,
} from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { RunningApp } from '@youwol/os-core'

import { RunningAppView } from './running-apps'
import { PlatformBannerView, sessionDetails$ } from './top-banner'
import { popupModal } from './modals'
import {
    WelcomeVisitorState,
    WelcomeVisitorView,
} from './modals/welcome-visitor/welcome-visitor.view'

require('./style.css')

const searchParams = new URLSearchParams(window.location.search)

if (searchParams.has('mode') && searchParams.get('mode') == 'safe') {
    OsCore.PlatformState.setSafeMode()
}

/**
 * @category Getting Started
 * @category View
 */
export class PlatformView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'h-100 w-100 d-flex flex-column fv-text-primary position-relative'
    /**
     * @group States
     */
    public readonly state = new OsCore.PlatformState()
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
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

        sessionDetails$.subscribe((sessionInfo) => {
            if (!sessionInfo.userInfo.temp) {
                return
            }
            WelcomeVisitorState.isShowAgainMode() &&
                popupModal(() => new WelcomeVisitorView())
        })
    }
}

/**
 * @category View
 */
export class BackgroundView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'position-absolute w-100 h-100'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        top: '0px',
        left: '0px',
        zIndex: '-1',
    }
    /**
     * @group Immutable DOM Constants
     */
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

/**
 * @category View
 */
export class DesktopWidgetsView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: Stream$<RunningApp, string>
    /**
     * @group Immutable DOM Constants
     */
    public readonly children //: VirtualDOM[]
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState

    constructor(params: { state: OsCore.PlatformState }) {
        Object.assign(this, params)

        this.class = attr$(
            this.state.runningApplication$,
            (runningApp): string =>
                runningApp ? 'd-none' : 'd-flex flex-column',
            {
                wrapper: (d) => `w-100 h-100 p-2 ${d}`,
            },
        )
        this.children = children$(
            OsCore.PreferencesFacade.getPreferences$(),
            (preferences) =>
                OsCore.PreferencesExtractor.getDesktopWidgets(preferences, {
                    platformState: this.state,
                }),
        )
    }
}

document.getElementById('content').appendChild(render(new PlatformView()))
