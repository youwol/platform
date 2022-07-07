import { DockableTabs } from '@youwol/fv-tabs'
import { BehaviorSubject, from, of } from 'rxjs'
import { mergeMap, shareReplay } from 'rxjs/operators'
import { Accounts } from '@youwol/http-clients'
import { ProfileTab } from './profile-tab.view'
import { PreferencesTab } from './preferences-tab.view'
import { InstallersTab } from './installers-tab.view'
import { fetchTypescriptCodeMirror$ } from './common'

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

export class UserSettingsTabsView extends DockableTabs.View {
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
