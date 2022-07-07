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

export class EnvironmentTab extends DockableTabs.Tab {
    protected constructor(params: {
        id: string
        content: ({ tabsState }) => VirtualDOM
        title: string
        icon: string
    }) {
        super({ ...params, id: params.id })
    }
}

export class PreferencesTab extends EnvironmentTab {
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

export class InstallersTab extends EnvironmentTab {
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

function createEditor(mdle, tabsState: DockableTabs.State, tsSrcs: string) {
    const ideState = new mdle.CodeIdeState({
        files: {
            path: './index.ts',
            content: tsSrcs,
        },
        entryPoint: './index.ts',
    })
    const view: CodeIdeView = new mdle.CodeIdeView({
        ideState,
    })
    combineLatest([
        view.tsCodeEditorView.nativeEditor$,
        tabsState.viewState$,
        tabsState.selected$,
    ])
        .pipe(
            filter(([_, viewState, selected]) => {
                return viewState == 'expanded' && selected == 'Installers'
            }),
            take(1),
        )
        .subscribe(([editor]) => {
            editor.refresh()
        })
    return view
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

export const fetchTypescriptCodeMirror$ = () =>
    from(
        install({
            modules: ['codemirror', 'typescript'],
            scripts: [
                'codemirror#5.52.0~mode/javascript.min.js',
                'codemirror#5.52.0~addons/lint/lint.js',
            ],
            css: [
                'codemirror#5.52.0~codemirror.min.css',
                'codemirror#5.52.0~theme/blackboard.min.css',
                'codemirror#5.52.0~addons/lint/lint.css',
            ],
        }),
    ).pipe(shareReplay({ bufferSize: 1, refCount: true }))

export class InstallersView implements VirtualDOM {
    public readonly class = bottomNavClasses
    public readonly style = bottomNavStyle
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
