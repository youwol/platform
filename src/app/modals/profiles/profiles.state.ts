import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs'
import { CdnEvent, install } from '@youwol/cdn-client'
import { mergeMap, shareReplay, tap } from 'rxjs/operators'
import { setup } from '../../../auto-generated'
import { PreferencesFacade } from '@youwol/os-core'
import { CdnSessionsStorage, raiseHTTPErrors } from '@youwol/http-clients'
import { v4 } from 'uuid'
import * as OsCore from '@youwol/os-core'
import { TsCodeEditorModule } from '@youwol/fv-code-mirror-editors'

const cmInstall = {
    modules: [
        `@youwol/fv-code-mirror-editors#${setup.runTimeDependencies.externals['@youwol/fv-code-mirror-editors']}`,
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

export type SettingsFamilies = 'preferences' | 'installers'

export type SettingsContent = Record<
    SettingsFamilies,
    { tsSrc: string; jsSrc: string }
>

export type toto = TsCodeEditorModule
export type Profile = { id: string; name: string } & SettingsContent

/**
 * @category State
 */
export class ProfilesState {
    /**
     * @group Observables
     */
    public readonly profiles$: BehaviorSubject<{ id: string; name: string }[]>

    /**
     * @group Observables
     */
    public readonly selectedProfile$ = new ReplaySubject<Profile>(1)

    /**
     * @group Observables
     */
    public readonly editionMode$ = new BehaviorSubject<boolean>(false)

    /**
     * @group Observables
     */
    static bootstrap$: Observable<Window>

    /**
     * @group Observables
     */
    static cdnEvents$ = new ReplaySubject<CdnEvent>()

    /**
     * @group Observables
     */
    static fvCodeMirror$: Observable<TsCodeEditorModule>

    /**
     *
     * @group HTTP
     * @private
     */
    private cdnSessionStorage = new CdnSessionsStorage.Client()

    /**
     *
     * @group Lazy Dependencies
     * @private
     */
    static CodeEditorModule: TsCodeEditorModule

    constructor(params: {
        profilesInfo: {
            customProfiles: { id: string; name: string }[]
            selectedProfile: string
        }
    }) {
        this.profiles$ = new BehaviorSubject<{ id: string; name: string }[]>([
            { id: 'default', name: 'Default' },
            ...params.profilesInfo.customProfiles,
        ])

        this.getProfileData$(params.profilesInfo.selectedProfile).subscribe(
            (resp) => {
                this.selectedProfile$.next(resp)
            },
        )
    }

    edit() {
        this.editionMode$.next(true)
    }

    newProfile(name: string) {
        const profileId = v4()
        this.profiles$.next([...this.profiles$.value, { name, id: profileId }])

        this.syncProfileInfo(profileId)

        this.cdnSessionStorage
            .postData$({
                packageName: setup.name,
                dataName: `customProfile_${profileId}`,
                body: {
                    name,
                    id: profileId,
                    preferences: PreferencesFacade.getDefaultPreferences(),
                    installers: OsCore.Installer.getDefaultInstaller(),
                },
            })
            .subscribe(() => {
                this.selectProfile(profileId)
                this.edit()
            })
    }

    selectProfile(profileId: string) {
        this.getProfileData$(profileId)
            .pipe(
                tap((resp) => {
                    OsCore.PreferencesFacade.setPreferencesScript(
                        resp.preferences,
                    )
                    OsCore.Installer.setInstallerScript(resp.installers)
                    this.syncProfileInfo(profileId)
                }),
            )
            .subscribe((resp: Profile) => {
                this.selectedProfile$.next(resp)
            })
    }

    deleteProfile(profileId: string) {
        this.selectProfile('default')
        this.profiles$.next(
            [...this.profiles$.value].filter(({ id }) => id != profileId),
        )
        this.syncProfileInfo(profileId)
        this.cdnSessionStorage
            .deleteData$({
                packageName: setup.name,
                dataName: `customProfile_${profileId}`,
            })
            .subscribe()
    }

    updateProfile(profileId: string, settingsContent: SettingsContent) {
        if (profileId == 'default') {
            return
        }
        const profile = this.profiles$.value.find(({ id }) => id == profileId)

        return Promise.all([
            OsCore.PreferencesFacade.setPreferencesScript(
                settingsContent.preferences,
            ),
            OsCore.Installer.setInstallerScript(settingsContent.installers),
        ]).then(() => {
            this.cdnSessionStorage
                .postData$({
                    packageName: setup.name,
                    dataName: `customProfile_${profileId}`,
                    body: {
                        id: profile.id,
                        name: profile.name,
                        preferences: settingsContent.preferences,
                        installers: settingsContent.installers,
                    },
                })
                .subscribe()
        })
    }

    private getProfileData$(profileId: string): Observable<Profile> {
        return profileId == 'default'
            ? of({
                  id: 'default',
                  name: 'Default',
                  preferences: PreferencesFacade.getDefaultPreferences(),
                  installers: OsCore.Installer.getDefaultInstaller(),
              } as Profile)
            : (this.cdnSessionStorage
                  .getData$({
                      packageName: setup.name,
                      dataName: `customProfile_${profileId}`,
                  })
                  .pipe(raiseHTTPErrors()) as unknown as Observable<Profile>)
    }

    private syncProfileInfo(profileId: string) {
        return this.cdnSessionStorage
            .postData$({
                packageName: setup.name,
                dataName: 'profilesInfo',
                body: {
                    selectedProfile: profileId,
                    customProfiles: this.profiles$.value.filter(
                        ({ id }) => id != 'default',
                    ),
                },
            })
            .subscribe()
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

    static getFvCodeMirror$() {
        if (ProfilesState.fvCodeMirror$) {
            return ProfilesState.fvCodeMirror$
        }
        ProfilesState.fvCodeMirror$ = from(install(cmInstall)).pipe(
            mergeMap((window) =>
                from(window['codeMirrorEditors'].TypescriptModule()),
            ),
            tap(
                (cm: TsCodeEditorModule) =>
                    (ProfilesState.CodeEditorModule = cm),
            ),
            shareReplay({ bufferSize: 1, refCount: true }),
        )
        return ProfilesState.getFvCodeMirror$()
    }
}
