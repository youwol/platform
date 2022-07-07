import { attr$, child$, children$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class ApplicationsLaunchPadView implements VirtualDOM {
    public readonly class = 'd-flex flex-wrap justify-content-center'
    public readonly style = {
        width: '75vw',
        height: '75vh',
    }
    public readonly state: OsCore.PlatformState
    public readonly children

    constructor(params: { state: OsCore.PlatformState }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'h-100 w-100 d-flex',
                children: [
                    child$(this.state.runningApplications$, (apps) =>
                        apps.length > 0
                            ? new RunningAppsView({ state: this.state })
                            : {},
                    ),
                    new NewAppsView({ state: this.state }),
                ],
            },
        ]
    }
}

class NewAppsView implements VirtualDOM {
    public readonly class = 'w-100 flex-grow-1 overflow-auto'
    public readonly children: VirtualDOM[]
    public readonly state: OsCore.PlatformState

    constructor(params: { state: OsCore.PlatformState }) {
        Object.assign(this, params)
        const spinner = child$(
            OsCore.Installer.getApplicationsInfo$(),
            (): VirtualDOM => {
                return {}
            },
            {
                untilFirst: {
                    class: 'fas fa-spinner fa-spin mx-2',
                },
            },
        )

        this.children = [
            {
                class: 'justify-content-center fv-text-focus d-flex align-items-center',
                children: [
                    {
                        innerText: 'Applications',
                    },
                    spinner,
                ],
                style: {
                    fontSize: 'x-large',
                    fontWeight: 'bolder',
                },
            },
            {
                class: 'd-flex flex-wrap justify-content-center',
                children: children$(
                    OsCore.Installer.getApplicationsInfo$().pipe(
                        map((apps) => {
                            return apps.filter(
                                (app) => app.execution.standalone,
                            )
                        }),
                    ),
                    (apps) => {
                        return apps.map((app) => {
                            return new NewAppView({
                                state: this.state,
                                app,
                            })
                        })
                    },
                ),
            },
        ]
    }
}
class NewAppView implements VirtualDOM {
    public readonly class =
        'border rounded mx-3 my-2 fv-hover-xx-lighter fv-pointer fv-text-primary fv-hover-bg-background-alt'

    public readonly state: OsCore.PlatformState
    public readonly app: OsCore.ApplicationInfo
    public readonly style = {
        width: '100px',
        height: '100px',
        position: 'relative',
    }
    public readonly children: VirtualDOM[]

    public readonly onclick = () => {
        this.state
            .createInstance$({
                cdnPackage: this.app.cdnPackage,
                version: 'latest',
                focus: true,
            })
            .subscribe()
    }
    constructor(params: {
        state: OsCore.PlatformState
        app: OsCore.ApplicationInfo
    }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'd-flex w-100 h-100 justify-content-center mx-auto flex-column h-100 w-100 text-center',
                children: [
                    {
                        class: 'mx-auto d-flex flex-column justify-content-center',
                        style: {
                            width: '40px',
                            height: '40px',
                        },
                        children: [this.app.graphics.appIcon],
                    },
                    { class: 'mt-1', innerText: this.app.displayName },
                ],
            },
        ]
    }
}

class RunningAppsView implements VirtualDOM {
    public readonly class = 'w-25 overflow-auto border-right'
    public readonly children: VirtualDOM[]
    public readonly state: OsCore.PlatformState

    constructor(params: { state: OsCore.PlatformState }) {
        Object.assign(this, params)
        const expanded$ = new BehaviorSubject(false)
        this.children = [
            {
                class: 'text-center fv-text-focus',
                innerText: 'Running',
                style: {
                    fontSize: 'x-large',
                    fontWeight: 'bolder',
                },
            },
            {
                class: 'd-flex flex-column justify-content-center',
                children: children$(
                    this.state.runningApplications$,
                    (runningApps) => {
                        const executables: {
                            [key: string]: OsCore.Executable
                        } = [...runningApps].reduce(
                            (acc, e) => ({ ...acc, [e.cdnPackage]: e }),
                            {},
                        )

                        return Object.values(executables).map(
                            (executable: OsCore.Executable) =>
                                new RunningAppView({
                                    executable,
                                    instances: runningApps.filter(
                                        (app) =>
                                            app.cdnPackage ==
                                            executable.cdnPackage,
                                    ),
                                    expanded$,
                                    state: this.state,
                                }),
                        )
                    },
                ),
            },
        ]
    }
}

export class RunningAppView implements VirtualDOM {
    public readonly class = `d-flex flex-column align-items-center rounded fv-hover-bg-background-alt mx-auto p-1 fv-pointer`
    public readonly children: VirtualDOM[]
    public readonly executable: OsCore.Executable
    public readonly instances: OsCore.RunningApp[]
    public readonly state: OsCore.PlatformState
    public readonly hovered$ = new BehaviorSubject(false)
    public readonly style = {
        width: 'fit-content',
    }
    public readonly onmouseenter: (ev: MouseEvent) => void
    public readonly onmouseleave: (ev: MouseEvent) => void

    constructor(params: {
        state: OsCore.PlatformState
        executable: OsCore.Executable
        instances: OsCore.RunningApp[]
        expanded$: Observable<boolean>
    }) {
        Object.assign(this, params)
        this.children = [
            this.headerView(),
            child$(this.hovered$, (hoverer) => {
                return hoverer
                    ? new InstancesListView({
                          state: this.state,
                          instances: this.instances,
                          executable: this.executable,
                      })
                    : {}
            }),
        ]
        this.onmouseenter = () => this.hovered$.next(true)
        this.onmouseleave = () => this.hovered$.next(false)
    }

    headerView() {
        return {
            class: `fv-text-primary d-flex align-items-center position-relative`,
            children: [
                child$(this.executable.appMetadata$, (d) => ({
                    class: 'p-2',
                    children: [d.graphics.appIcon],
                })),
                child$(
                    combineLatest([
                        this.hovered$,
                        this.state.runningApplication$,
                    ]),
                    ([hovered, runningApp]) => {
                        return hovered
                            ? {
                                  tag: 'span',
                                  style: {
                                      fontWeight: 'bolder',
                                  },
                                  class: 'mx-2 fv-text-success',
                                  innerText: attr$(
                                      this.executable.appMetadata$,
                                      (d) => d.displayName,
                                  ),
                              }
                            : new RunningAppBullet({
                                  runningApp,
                                  instances: this.instances,
                              })
                    },
                ),
            ],
        }
    }
}

class RunningAppBullet implements VirtualDOM {
    public readonly class =
        'w-100 h-100 position-absolute d-flex justify-content-around'
    public readonly style = {
        top: '0px',
        left: '0px',
    }
    public readonly children: VirtualDOM[]
    public readonly runningApp
    public readonly instances

    constructor(params: { runningApp; instances }) {
        Object.assign(this, params)
        this.children = this.instances.map((app) => {
            return {
                class:
                    this.runningApp &&
                    this.runningApp.instanceId == app.instanceId
                        ? 'fv-bg-secondary rounded border'
                        : 'fv-bg-primary rounded border',
                style: {
                    width: '7px',
                    height: '7px',
                },
            }
        })
    }
}

class InstancesListView implements VirtualDOM {
    public readonly state: OsCore.PlatformState
    public readonly children: VirtualDOM[]
    public readonly executable: OsCore.Executable
    public readonly instances: OsCore.RunningApp[]
    public readonly class =
        'd-flex flex-column justify-content-center p-1 rounded'
    public readonly style = { userSelect: 'none' }

    constructor(params: {
        state: OsCore.PlatformState
        executable: OsCore.Executable
        instances: OsCore.RunningApp[]
    }) {
        Object.assign(this, params)

        this.children = [this.instancesListView()]
    }

    instancesListView() {
        return {
            class: 'w-100',
            children: this.instances.map((app) => {
                return {
                    class: attr$(
                        this.state.runningApplication$,
                        (selected: OsCore.RunningApp): string => {
                            return selected &&
                                selected.instanceId == app.instanceId
                                ? 'fv-text-focus fv-border-focus'
                                : 'fv-text-primary fv-border-primary'
                        },
                        {
                            wrapper: (d) =>
                                `${d} fv-pointer px-1 my-1 rounded fv-hover-bg-secondary fv-hover-text-primary d-flex align-items-center justify-content-between`,
                        },
                    ),
                    onclick: () => this.state.focus(app.instanceId),
                    children: [
                        {
                            class: 'px-1',
                            children: [
                                child$(app.snippet$, (snippet) => snippet),
                            ],
                        },
                        {
                            class: 'fv-text-error fv-hover-xx-lighter fas fa-times-circle',
                            onclick: (ev) => {
                                ev.stopPropagation()
                                this.state.close(app.instanceId)
                            },
                        },
                    ],
                }
            }),
        }
    }
}
