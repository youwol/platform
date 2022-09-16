import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs'
import { CdnEvent, install } from '@youwol/cdn-client'
import { CodeEditorModule } from './common'
import { map, shareReplay, tap } from 'rxjs/operators'
import { setup } from '../../../auto-generated'
import { PreferencesFacade } from '@youwol/os-core'

const cmInstall = {
    modules: [
        `@youwol/fv-code-mirror-editors#${setup.runTimeDependencies.differed['@youwol/fv-code-mirror-editors']}`,
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
        codeMirrorEditors: setup.getDependencySymbolExported(
            '@youwol/fv-code-mirror-editors',
        ),
    },
    onEvent: (event) => {
        ProfilesState.cdnEvents$.next(event)
    },
}

type Profile = {
    id: string
    name: string
    tsSrc?: string
    jsSrc?: string
}

export class ProfilesState {
    public readonly profiles$ = new BehaviorSubject<Profile[]>([
        {
            id: 'default',
            name: 'Default',
        },
    ])

    public readonly selectedProfile$ = new BehaviorSubject<string>('default')

    public readonly editionMode$ = new BehaviorSubject<boolean>(false)

    static bootstrap$: Observable<Window>

    static cdnEvents$ = new ReplaySubject<CdnEvent>()

    static fvCodeMirror$: Observable<CodeEditorModule>

    edit() {
        this.editionMode$.next(true)
    }

    newProfile(name: string) {
        const profiles = this.profiles$.value
        const id = name
        const defaults = PreferencesFacade.getDefaultPreferences()
        this.profiles$.next([
            ...profiles,
            { name, id, jsSrc: defaults.js, tsSrc: defaults.ts },
        ])
        this.selectedProfile$.next(id)
        PreferencesFacade.getDefaultPreferences()
        this.edit()
    }

    selectProfile(id: string) {
        this.selectedProfile$.next(id)
    }

    getProfile(id: string) {
        return this.profiles$.value.find((p) => p.id == id)
    }
    static getBootstrap$() {
        if (ProfilesState.bootstrap$) {
            return ProfilesState.bootstrap$
        }
        ProfilesState.bootstrap$ = from(
            install({ modules: ['bootstrap#^4.0.0'] }),
        ).pipe(shareReplay({ bufferSize: 1, refCount: true }))
        return ProfilesState.getBootstrap$()
    }

    static CodeEditorModule: CodeEditorModule

    static getFvCodeMirror$(): Observable<CodeEditorModule> {
        if (ProfilesState.fvCodeMirror$) {
            return ProfilesState.fvCodeMirror$
        }
        ProfilesState.fvCodeMirror$ = from(install(cmInstall)).pipe(
            map((window) => window['codeMirrorEditors']),
            tap((cm) => (ProfilesState.CodeEditorModule = cm)),
            shareReplay({ bufferSize: 1, refCount: true }),
        )
        return ProfilesState.getFvCodeMirror$()
    }
}
