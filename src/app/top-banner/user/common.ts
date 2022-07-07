import { DockableTabs } from '@youwol/fv-tabs'
import { VirtualDOM } from '@youwol/flux-view'
import { combineLatest, from } from 'rxjs'
import { install } from '@youwol/cdn-client'
import { filter, shareReplay, take } from 'rxjs/operators'
import { CodeIdeView } from './ts-code-editor.view'

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

export function createEditor(
    mdle,
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
