import { DockableTabs } from '@youwol/fv-tabs'
import { VirtualDOM } from '@youwol/flux-view'
import { combineLatest } from 'rxjs'
import { filter, take } from 'rxjs/operators'
import { Accounts } from '@youwol/http-clients'

type NavigateMethod =
    | 'logoutAndForgetUserUrl'
    | 'logoutUrl'
    | 'loginAsUserUrl'
    | 'loginAsTempUserUrl'

export function redirectWith(method: NavigateMethod) {
    window.location.replace(new Accounts.Client()[method](window.location.href))
}

/**
 * @category View
 */
export class UserSettingsTabBase extends DockableTabs.Tab {
    protected constructor(params: {
        id: string
        content: ({ tabsState }) => VirtualDOM
        title: string
        icon: string
    }) {
        super({ ...params, id: params.id })
    }
}

export type CodeEditorModule = typeof import('@youwol/fv-code-mirror-editors')
/**
 * @category View
 */
export function createEditor(
    mdle: CodeEditorModule,
    tabsState: DockableTabs.State,
    tsSrcs: string,
) {
    const ideState = new mdle.CodeIdeState({
        files: {
            path: './index.ts',
            content: tsSrcs,
        },
        entryPoint: './index.ts',
    })
    const view = new mdle.CodeIdeView({
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
