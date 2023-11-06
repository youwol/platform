import {
    attr$,
    child$,
    children$,
    render,
    Stream$,
    VirtualDOM,
} from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { RunningApp, Preferences } from '@youwol/os-core'

import { RunningAppView } from './running-apps'

import {
    Accounts,
    AssetsGateway,
    CdnSessionsStorage,
} from '@youwol/http-clients'
import { HTTPError, raiseHTTPErrors } from '@youwol/http-primitives'
import { map, shareReplay } from 'rxjs/operators'
import { PlatformBannerView } from './top-banner'
import { BehaviorSubject, Observable } from 'rxjs'
import { ProfilesState } from './modals/profiles'
import { setup } from '../auto-generated'
import { ContextMenuDesktopView } from './context-menu/context-menu.view'
import { installContextMenu } from './context-menu/context-menu.state'

require('./style.css')

const searchParams = new URLSearchParams(window.location.search)

export const sessionDetails$ = new AssetsGateway.Client().accounts
    .getSessionDetails$()
    .pipe(
        raiseHTTPErrors(),
        shareReplay({
            bufferSize: 1,
            refCount: true,
        }),
    )
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
    public readonly tabIndex = '-1'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails
    /**
     * @group Immutable DOM Constants
     */
    public readonly style: Stream$<
        { [_key: string]: string },
        { [_key: string]: string }
    >
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: (ev) => void

    constructor() {
        this.children = [
            new BackgroundView(),
            child$(
                getProfileStateData$(),
                (profileState) =>
                    new PlatformBannerView({
                        state: this.state,
                        profileState: profileState,
                        class: 'fv-bg-background yw-box-shadow',
                        style: {
                            background: '#070707',
                        },
                    }),
            ),
            {
                class: 'd-flex align-items-center flex-grow-1 w-100 yw-iframe-border-none',
                style: {
                    minHeight: '0px',
                    overflow: 'auto',
                },
                children: [
                    new RunningAppView({ state: this.state }),
                    new DesktopWidgetsView({ state: this.state }),
                ],
                connectedCallback: (elem: HTMLElement) => {
                    return installContextMenu({
                        div: elem,
                        children: [
                            child$(getProfileStateData$(), (profileState) => {
                                return new ContextMenuDesktopView({
                                    profileState,
                                })
                            }),
                        ],
                    })
                },
            },
        ]

        sessionDetails$.subscribe((sessionInfo) => {
            if (!sessionInfo.userInfo.temp) {
                return
            }
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
    /**
     * @group Immutable DOM Constants
     */
    public readonly connectedCallback: (elem) => void
    public readonly hovered$ = new BehaviorSubject(false)

    public readonly onmouseenter = () => {
        this.hovered$.next(true)
    }

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
    public readonly children: Stream$<Preferences, VirtualDOM[]>
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

export function getProfileStateData$(): Observable<ProfilesState> {
    const getData$ = new CdnSessionsStorage.Client().getData$({
        packageName: setup.name,
        dataName: 'profilesInfo',
    }) as unknown as Observable<
        | {
              customProfiles: { id: string; name: string }[]
              selectedProfile: string
          }
        | HTTPError
    >
    return getData$.pipe(
        raiseHTTPErrors(),
        map((jsonResp) =>
            jsonResp.customProfiles
                ? jsonResp
                : {
                      customProfiles: [],
                      selectedProfile: 'default',
                  },
        ),
        map((profilesInfo) => new ProfilesState({ profilesInfo })),
    )
}

document.getElementById('content').appendChild(render(new PlatformView()))
