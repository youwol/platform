import { child$, VirtualDOM } from '@youwol/flux-view'
import { combineLatest } from 'rxjs'
import * as OsCore from '@youwol/os-core'
import { UserSettingsTabsState } from './settings-tabs'
import { createEditor, UserSettingsTabBase } from './common'

const bottomNavClasses = 'fv-bg-background fv-x-lighter w-100 overflow-auto'
const bottomNavStyle = {
    height: '100%',
}

/**
 * @category View.Tab
 */
export class InstallersTab extends UserSettingsTabBase {
    constructor() {
        super({
            id: 'Installers',
            title: 'Installers',
            icon: 'fas fa-cubes',
            content: ({ tabsState }: { tabsState: UserSettingsTabsState }) => {
                return new InstallersView({
                    tabsState: tabsState,
                })
            },
        })
        Object.assign(this)
    }
}

/**
 * @category View
 */
export class InstallersView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = bottomNavClasses
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = bottomNavStyle
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor(params: { tabsState: UserSettingsTabsState }) {
        this.children = [
            child$(
                combineLatest([
                    OsCore.Installer.getInstallerScript$(),
                    params.tabsState.codeMirror$,
                ]),
                ([installerScript, mdle]) => {
                    const view = createEditor(
                        mdle,
                        params.tabsState,
                        installerScript.tsSrc,
                    )
                    view.ideState.parsedSrc$.subscribe((parsed) => {
                        OsCore.Installer.setInstallerScript(parsed)
                    })
                    return view
                },
            ),
        ]
    }
}
