import { attr$, child$, children$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { map } from 'rxjs/operators'
import { LaunchpadBadgeView } from '../../top-banner/badges'
import { Modal } from '@youwol/fv-group'

/**
 * @category View
 */
export class ApplicationsLaunchPadView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex flex-column  rounded fv-bg-background-alt yw-box-shadow yw-animate-in'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: '75vw',
        height: '75vh',
    }
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group States
     */
    public readonly modalState: Modal.State
    /**
     * @group Immutable DOM Constants
     */
    public readonly children

    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick = (ev: MouseEvent) => ev.stopPropagation()

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
    }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'fv-bg-background w-100 d-flex align-items-center disabled ',
                style: {
                    pointerEvents: 'none',
                },
                children: [
                    new LaunchpadBadgeView({ state: this.state }),
                    {
                        class: 'mx-1',
                        innerText: 'Application Launcher',
                    },
                ],
            },
            {
                class: 'flex-grow-1 w-100 d-flex p-3',
                style: {
                    minHeight: '0px',
                },
                children: [
                    child$(this.state.runningApplications$, (apps) =>
                        apps.length > 0
                            ? new RunningAppsView({
                                  state: this.state,
                                  modalState: this.modalState,
                              })
                            : {},
                    ),
                    child$(this.state.runningApplications$, (apps) =>
                        apps.length > 0 ? { class: 'mx-3 border-right' } : {},
                    ),
                    new NewAppsView({
                        state: this.state,
                        modalState: this.modalState,
                    }),
                ],
            },
        ]
    }
}

/**
 * @category View
 */
class NewAppsView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'w-100 flex-grow-1 d-flex flex-column '

    public readonly style = {
        minHeight: '0px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group State
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group State
     */
    public readonly modalState: Modal.State

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
    }) {
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
                class: 'fv-text-primary d-flex align-items-center',
                children: [
                    {
                        innerText: 'Applications',
                    },
                    spinner,
                ],
            },
            {
                class: 'flex-grow-1 overflow-auto',
                style: {
                    minHeight: '0px',
                },
                children: [
                    {
                        class: 'd-flex p-2 m-2 flex-wrap justify-content-center',
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
                                        modalState: this.modalState,
                                        app,
                                    })
                                })
                            },
                        ),
                    },
                ],
            },
        ]
    }
}

/**
 * @category View
 */
class NewAppView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'm-1 fv-hover-xx-lighter fv-pointer fv-text-primary app-icon-motion fv-hover-bg-background-alt p-2 rounded'
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group States
     */
    public readonly modalState: Modal.State
    /**
     * @group Immutable Constants
     */
    public readonly app: OsCore.ApplicationInfo
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: '135px',
        height: '135px',
        position: 'relative',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick = (ev: MouseEvent) => {
        this.modalState.ok$.next(ev)
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
        modalState: Modal.State
        app: OsCore.ApplicationInfo
    }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'd-flex justify-content-center mx-auto flex-column text-center border rounded',
                style: {
                    width: '100px',
                    height: '100px',
                    position: 'relative',
                },
                children: [
                    {
                        class: 'mx-auto d-flex flex-column justify-content-center',
                        children: [this.app.graphics.appIcon],
                    },
                ],
            },
            { class: 'mt-1 text-center', innerText: this.app.displayName },
        ]
    }
}

/**
 * @category View
 */
class RunningAppsView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'w-25 overflow-auto h-100 d-flex flex-column'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group States
     */
    public readonly modalState: Modal.State

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
    }) {
        Object.assign(this, params)
        this.children = [
            {
                innerText: 'Running Applications',
            },
            {
                class: 'd-flex flex-column flex-grow-1',
                style: {
                    minHeight: '0px',
                },
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
                                    state: this.state,
                                    modalState: this.modalState,
                                }),
                        )
                    },
                ),
            },
        ]
    }
}

/**
 * @category View
 */
export class RunningAppView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `rounded d-flex flex-column align-items-center rounded w-100 p-2 my-1 fv-hover-xx-lighter fv-bg-background-alt`
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable Constants
     */
    public readonly executable: OsCore.Executable
    /**
     * @group Immutable Constants
     */
    public readonly instances: OsCore.RunningApp[]
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState
    /**
     * @group States
     */
    public readonly modalState: Modal.State

    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: 'fit-content',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly onmouseenter: (ev: MouseEvent) => void
    /**
     * @group Immutable DOM Constants
     */
    public readonly onmouseleave: (ev: MouseEvent) => void

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
        executable: OsCore.Executable
        instances: OsCore.RunningApp[]
    }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'fv-bg-background w-100 rounded px-1',
                children: [
                    this.headerView(),
                    {
                        class: 'fv-border-bottom-primary w-100',
                    },
                    new InstancesListView({
                        state: this.state,
                        modalState: this.modalState,
                        instances: this.instances,
                        executable: this.executable,
                    }),
                ],
            },
        ]
    }

    headerView() {
        return {
            class: `w-100 fv-text-primary d-flex align-items-center justify-content-between position-relative`,
            children: [
                child$(this.executable.appMetadata$, (d) => ({
                    class: 'p-2',
                    children: [d.graphics.appIcon],
                })),
                {
                    tag: 'span',
                    style: {
                        fontWeight: 'bolder',
                    },
                    class: 'mx-2',
                    innerText: attr$(
                        this.executable.appMetadata$,
                        (d) => d.displayName,
                    ),
                },
            ],
        }
    }
}

/**
 * @category View
 */
class InstancesListView implements VirtualDOM {
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState

    /**
     * @group States
     */
    public readonly modalState: Modal.State

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable Constants
     */
    public readonly executable: OsCore.Executable
    /**
     * @group Immutable Constants
     */
    public readonly instances: OsCore.RunningApp[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex flex-column justify-content-center p-1 rounded'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = { userSelect: 'none' }

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
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
                                ? 'fv-text-focus '
                                : 'fv-text-primary '
                        },
                        {
                            wrapper: (d) =>
                                `${d} fv-pointer px-1 my-2 rounded fv-hover-bg-background-alt d-flex align-items-center justify-content-between`,
                        },
                    ),
                    onclick: (ev) => {
                        this.modalState.ok$.next(ev)
                        this.state.focus(app.instanceId)
                    },
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
