import { child$, VirtualDOM } from '@youwol/flux-view'
import { combineLatest } from 'rxjs'
import * as OsCore from '@youwol/os-core'
import { UserSettingsTabsState } from './settings-tabs'
import { createEditor, UserSettingsTabBase } from './common'

const bottomNavClasses = 'fv-bg-background fv-x-lighter w-100 overflow-auto'
const bottomNavStyle = {
    height: '100%',
}

export class PreferencesTab extends UserSettingsTabBase {
    constructor() {
        super({
            id: 'Preferences',
            title: 'Preferences',
            icon: 'fas fa-user-cog',
            content: ({ tabsState }: { tabsState: UserSettingsTabsState }) => {
                return new PreferencesView({
                    tabsState: tabsState,
                })
            },
        })
        Object.assign(this)
    }
}

export class PreferencesView implements VirtualDOM {
    public readonly class = bottomNavClasses
    public readonly style = bottomNavStyle
    public readonly children: VirtualDOM[]
    constructor(params: { tabsState: UserSettingsTabsState }) {
        this.children = [
            child$(
                combineLatest([
                    OsCore.PreferencesFacade.getPreferencesScript$(),
                    params.tabsState.codeMirror$,
                ]),
                ([preferencesScript, mdle]) => {
                    const view = createEditor(
                        mdle,
                        params.tabsState,
                        preferencesScript.tsSrc,
                    )
                    view.ideState.parsedSrc$.subscribe((parsed) => {
                        OsCore.PreferencesFacade.setPreferencesScript(parsed)
                    })
                    return view
                },
            ),
        ]
    }
}
