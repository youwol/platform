import { Observable, Subject } from 'rxjs'
import { child$, VirtualDOM } from '@youwol/flux-view'
import { Common, TsCodeEditorModule } from '@youwol/fv-code-mirror-editors'

import CodeMirror from 'codemirror'
import { ProfilesState } from './profiles.state'

/**
 * @category View
 */
export class CodeEditorView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string = 'w-100 h-100 d-flex flex-column'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({
        CodeEditorModule,
        tsSrc,
        readOnly,
        onRun,
    }: {
        profileState: ProfilesState
        CodeEditorModule: TsCodeEditorModule
        tsSrc: string
        readOnly: boolean
        onRun: (editor) => Promise<unknown>
    }) {
        const ideState = new CodeEditorModule.IdeState({
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

        const codeEditorView = new CodeEditorModule.CodeEditorView({
            ideState,
            path: './index.ts',
            config: {
                readOnly,
                extraKeys: {
                    'Ctrl-Enter': (editor) => onRunWithErrors(editor),
                },
            },
        })
        this.children = [
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
        ]
    }
}

export class ToolbarView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string =
        'w-100 fv-bg-background d-flex justify-content-center align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({
        highlights$,
        onRun,
        editor,
        error$,
    }: {
        highlights$: Observable<Common.SrcHighlight[]>
        onRun: (editor: CodeMirror.Editor) => Promise<unknown>
        editor: CodeMirror.Editor
        error$
    }) {
        this.children = [
            child$(highlights$, (highlights) => {
                return highlights.length > 0
                    ? {
                          class: 'fas fa-exclamation fv-text-error p-1',
                      }
                    : {
                          class: 'fas fa-save mx-1 fv-text-success fv-hover-xx-lighter fv-pointer rounded p-1',
                          onclick: () => {
                              onRun(editor).then(() => {
                                  /* no op: errors are handle separately using 'error$' */
                              })
                          },
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
