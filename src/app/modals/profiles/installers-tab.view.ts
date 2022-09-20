import { child$, VirtualDOM } from '@youwol/flux-view'
import { SettingsTabsState } from './settings-tabs'
import { UserSettingsTabBase } from './common'
import { ProfilesState } from './profiles.state'
import { CodeEditorView } from './code-editor.view'

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
                params.tabsState.profilesState.selectedProfile$,
                (profile) => {
                    return new CodeEditorView({
                        CodeEditorModule: ProfilesState.CodeEditorModule,
                        tsSrc: profile.installers.tsSrc,
                        readOnly: profile.id == 'default',
                        onRun: (editor) => {
                            const parsed =
                                ProfilesState.CodeEditorModule.parseTypescript(
                                    editor.getValue(),
                                )
                            return params.tabsState.profilesState.updateProfile(
                                profile.id,
                                {
                                    preferences: profile.preferences,
                                    installers: parsed,
                                },
                            )
                        },
                    })
                },
            ),
        ]
    }
}
