import { DockableTabs } from '@youwol/fv-tabs'
import { BehaviorSubject, of } from 'rxjs'
import { Accounts } from '@youwol/http-clients'
import { ProfileTab } from './profile-tab.view'
import { PreferencesTab } from './preferences-tab.view'
import { InstallersTab } from './installers-tab.view'
import { loadFvCodeEditorsModule$ } from './common'

/**
 * @category State
 */
export class UserSettingsTabsState extends DockableTabs.State {
    /**
     * @group Immutable Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails
    /**
     * @group Observable
     */
    public readonly codeMirror$ = loadFvCodeEditorsModule$()

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

/**
 * @category View
 */
export class UserSettingsTabsView extends DockableTabs.View {
    /**
     * @group Immutable DOM Constants
     */
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
