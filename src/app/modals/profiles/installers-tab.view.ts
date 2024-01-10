import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { SettingsTabsState } from './settings-tabs'
import { UserSettingsTabBase } from './common'
import { Profile, ProfilesState } from './profiles.state'
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
export class InstallersView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
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
    public readonly children: ChildrenLike

    constructor(params: { tabsState: SettingsTabsState }) {
        this.children = [
            {
                source$: params.tabsState.profilesState.editedProfile$,
                vdomMap: (profile: Profile) => {
                    return new CodeEditorView({
                        profileState: params.tabsState.profilesState,
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
            },
        ]
    }
}
