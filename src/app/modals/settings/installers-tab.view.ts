import { child$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { SettingsTabsState } from './settings-tabs'
import { createEditor, UserSettingsTabBase } from './common'
import { ProfilesState } from './profiles.state'

const bottomNavClasses = 'fv-bg-background fv-x-lighter w-100 overflow-auto'
const bottomNavStyle = {
    height: '100%',
}

/**
 * @category View
 */
export class InstallersTab extends UserSettingsTabBase {
    constructor() {
        super({
            id: 'Installers',
            title: 'Installers',
            icon: 'fas fa-cubes',
            content: ({ tabsState }: { tabsState: SettingsTabsState }) => {
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

    constructor(params: { tabsState: SettingsTabsState }) {
        this.children = [
            child$(
                OsCore.Installer.getInstallerScript$(),
                (installerScript) => {
                    const view = createEditor(
                        ProfilesState.CodeEditorModule,
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
