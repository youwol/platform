import { DockableTabs } from '@youwol/fv-tabs'
import { VirtualDOM } from '@youwol/flux-view'
import { combineLatest, from, Observable } from 'rxjs'
import { install } from '@youwol/cdn-client'
import { filter, map, shareReplay, take } from 'rxjs/operators'
import { Accounts } from '@youwol/http-clients'
import { setup } from '../../../auto-generated'

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

declare type CodeEditorModule = typeof import('@youwol/fv-code-mirror-editors')
const fvCodeMirrorEditorsVersion =
    setup.runTimeDependencies.differed['@youwol/fv-code-mirror-editors']
/**
 * Lazy loading of the module `@youwol/fv-code-mirror-editors`
 *
 * @category HTTP
 */
export const loadFvCodeEditorsModule$: () => Observable<CodeEditorModule> =
    () =>
        from(
            install({
                modules: [
                    `@youwol/fv-code-mirror-editors#${fvCodeMirrorEditorsVersion}`,
                ],
                scripts: [
                    'codemirror#5.52.0~mode/javascript.min.js',
                    'codemirror#5.52.0~addons/lint/lint.js',
                ],
                css: [
                    'codemirror#5.52.0~codemirror.min.css',
                    'codemirror#5.52.0~theme/blackboard.min.css',
                    'codemirror#5.52.0~addons/lint/lint.css',
                ],
                aliases: {
                    codeMirrorEditors: '@youwol/fv-code-mirror-editors',
                },
            }),
        ).pipe(
            map((window) => window['codeMirrorEditors'] as CodeEditorModule),
            shareReplay({ bufferSize: 1, refCount: true }),
        )

/**
 * @category View
 */
export function createEditor(
    mdle: CodeEditorModule,
    tabsState: DockableTabs.State,
    tsSrcs: string,
) {
    console.log('Module', mdle)
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
