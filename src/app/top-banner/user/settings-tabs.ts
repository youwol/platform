import { DockableTabs } from '@youwol/fv-tabs'
import { child$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, combineLatest, from, of } from 'rxjs'
import { filter, mergeMap, shareReplay, take } from 'rxjs/operators'
import { install } from '@youwol/cdn-client'
import * as OsCore from '@youwol/os-core'
import { CodeIdeView } from './ts-code-editor.view'
import { Accounts } from '@youwol/http-clients'
import { ProfileTab } from './profile-tab.view'

const bottomNavClasses = 'fv-bg-background fv-x-lighter w-100 overflow-auto'
const bottomNavStyle = {
    height: '100%',
}

export class UserSettingsTabsState extends DockableTabs.State {
    public readonly sessionInfo: Accounts.SessionDetails
    public readonly codeMirror$ = fetchTypescriptCodeMirror$().pipe(
        mergeMap(() => {
            return from(import('./ts-code-editor.view'))
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
    )

    constructor(params: { sessionInfo: Accounts.SessionDetails }) {
        super({
            disposition: 'top',
            viewState$: new BehaviorSubject<DockableTabs.DisplayMode>('pined'),
            tabs$: of([
                new ProfileTab(),
                new PreferencesTab(),
                new InstallersTab(),
            ]),
            selected$: new BehaviorSubject('Profile'),
            persistTabsView: false,
        })
        Object.assign(this, params)
    }
}

export class EnvironmentTabsView extends DockableTabs.View {
    public readonly onclick = (ev) => {
        ev.stopPropagation()
    }
    constructor({ sessionInfo }: { sessionInfo: Accounts.SessionDetails }) {
        super({
            state: new UserSettingsTabsState({ sessionInfo }),
            styleOptions: {
                wrapper: {
                    class: 'flex-grow-1 overflow-auto rounded',
                    style: {
                        minHeight: '0px',
                    },
                },
            },
        })
    }
}
