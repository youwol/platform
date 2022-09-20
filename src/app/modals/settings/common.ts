import { DockableTabs } from '@youwol/fv-tabs'
import { child$, VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'
import { Observable, Subject } from 'rxjs'
import { SrcHighlight } from '@youwol/fv-code-mirror-editors'
import CodeMirror from 'codemirror'

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
export function createEditor({
    CodeEditorModule,
    tsSrc,
    readOnly,
    onRun,
}: {
    CodeEditorModule: CodeEditorModule
    tsSrc: string
    readOnly: boolean
    onRun: (editor) => Promise<unknown>
}) {
    const ideState = new CodeEditorModule.Typescript.IdeState({
        files: [
            {
                path: './index.ts',
                content: tsSrc,
            },
        ],
    })

    const error$ = new Subject<Error | undefined>()
    const onRunWithErrors = (editor) =>
        onRun(editor)
            .then(() => error$.next())
            .catch((e) => {
                error$.next(e)
                console.error('An error occurred', e)
            })

    const codeEditorView = new CodeEditorModule.Typescript.CodeEditorView({
        ideState,
        path: './index.ts',
        config: {
            readOnly,
            extraKeys: {
                'Ctrl-Enter': (editor) => onRunWithErrors(editor),
            },
        },
    })
    return {
        class: 'w-100 h-100 d-flex flex-column',
        children: [
            readOnly
                ? {}
                : child$(
                      codeEditorView.nativeEditor$,
                      (editor) =>
                          new ToolbarView({
                              highlights$: codeEditorView.highlights$,
                              onRun: onRunWithErrors,
                              editor,
                              error$,
                          }),
                  ),
            {
                class: 'w-100 flex-grow-1 overflow-auto',
                children: [codeEditorView],
            },
        ],
    }
}

export class ToolbarView implements VirtualDOM {
    public readonly class: string =
        'w-100 fv-bg-background d-flex justify-content-center align-items-center'
    public readonly children: VirtualDOM[]

    constructor({
        highlights$,
        onRun,
        editor,
        error$,
    }: {
        highlights$: Observable<SrcHighlight[]>
        onRun: (editor: CodeMirror.Editor) => Promise<unknown>
        editor: CodeMirror.Editor
        error$
    }) {
        this.children = [
            child$(highlights$, (highlights) => {
                return highlights.length > 0
                    ? {
                          class: 'fas fa-exclamation fv-text-error  p-1',
                      }
                    : {
                          class: 'fas fa-play mx-1 fv-text-success fv-hover-xx-lighter fv-pointer rounded p-1',
                          onclick: () => onRun(editor),
                      }
            }),
            child$(error$, (error) => {
                return error
                    ? { class: 'fas fa-times fv-text-error  p-1' }
                    : { class: 'fas fa-check fv-text-success  p-1' }
            }),
        ]
    }
}