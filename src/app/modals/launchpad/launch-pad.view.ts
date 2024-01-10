import {
    RxChild,
    AnyVirtualDOM,
    ChildrenLike,
    VirtualDOM,
} from '@youwol/rx-vdom'
import * as OsCore from '@youwol/os-core'
import { map } from 'rxjs/operators'
import { LaunchpadBadgeView } from '../../top-banner/badges'
import { Modal } from '@youwol/rx-group-views'
import { ClosePopupButtonView } from '../profiles'
import { BehaviorSubject } from 'rxjs'
import { SideAppActionsView } from './actions.view'

/**
 * @category View
 */
export class ApplicationsLaunchPadView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
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
    public readonly children: ChildrenLike

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
                tag: 'div',
                class: 'fv-bg-background w-100 d-flex align-items-center disabled ',
                style: {
                    background: '#070707',
                    pointerEvents: 'none',
                },
                children: [
                    new LaunchpadBadgeView({
                        state: this.state,
                        isTooltip: false,
                    }),
                    {
                        tag: 'div',
                        class: 'mx-1',
                        innerText: 'Application Launcher',
                    },
                ],
            },
            {
                tag: 'div',
                class: 'flex-grow-1 w-100 d-flex p-3',
                style: {
                    minHeight: '0px',
                },
                children: [
                    {
                        source$: this.state.runningApplications$,
                        vdomMap: (apps: OsCore.RunningApp[]) =>
                            apps.length > 0
                                ? new RunningAppsView({
                                      state: this.state,
                                      modalState: this.modalState,
                                  })
                                : { tag: 'div' },
                    },
                    {
                        source$: this.state.runningApplications$,
                        vdomMap: (apps: OsCore.RunningApp[]) =>
                            apps.length > 0
                                ? { tag: 'div', class: 'mx-3 border-end' }
                                : { tag: 'div' },
                    },
                    new NewAppsView({
                        state: this.state,
                        modalState: this.modalState,
                    }),
                ],
            },
            new ClosePopupButtonView(),
        ]
    }
}

/**
 * @category View
 */
class NewAppsView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'w-100 flex-grow-1 d-flex flex-column '
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        minHeight: '0px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
        const spinner: RxChild = {
            source$: OsCore.Installer.getApplicationsInfo$(),
            vdomMap: () => {
                return { tag: 'div' }
            },
            untilFirst: {
                tag: 'div',
                class: 'fas fa-spinner fa-spin mx-2',
            },
        }

        this.children = [
            {
                tag: 'div',
                class: 'fv-text-primary d-flex align-items-center',
                children: [
                    {
                        tag: 'div',
                        innerText: 'Applications',
                    },
                    spinner,
                ],
            },
            {
                tag: 'div',
                class: 'flex-grow-1 overflow-auto',
                style: {
                    minHeight: '0px',
                },
                children: [
                    {
                        tag: 'div',
                        class: 'd-flex p-2 m-2 flex-wrap justify-content-start align-items-center',
                        children: {
                            policy: 'replace',
                            source$:
                                OsCore.Installer.getApplicationsInfo$().pipe(
                                    map((apps) => {
                                        return apps.filter(
                                            (app) => app.execution.standalone,
                                        )
                                    }),
                                ),
                            vdomMap: (apps: OsCore.ApplicationInfo[]) => {
                                return apps.map((app) => {
                                    return new NewAppView({
                                        state: this.state,
                                        modalState: this.modalState,
                                        app,
                                    })
                                })
                            },
                        },
                    },
                ],
            },
        ]
    }
}

/**
 * @category View
 */
class NewAppView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'p-1 d-flex flex-column align-items-center yw-hover-app m-1'
    public readonly style = {
        position: 'relative' as const,
        width: '116px',
        height: '125px',
        overflowWrap: 'anywhere' as const,
        textAlign: 'center' as const,
        justifyContent: 'center' as const,
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
     * @group Immutable Constants
     */
    public readonly app: OsCore.ApplicationInfo
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    public readonly hovered$ = new BehaviorSubject(false)

    public readonly onmouseenter = () => {
        this.hovered$.next(true)
    }
    public readonly onmouseleave = () => {
        this.hovered$.next(false)
    }

    /**
     * @group Immutable DOM Constants
     */
    public readonly ondblclick: (ev: MouseEvent) => void

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
        app: OsCore.ApplicationInfo
    }) {
        Object.assign(this, params)
        this.children = [
            {
                tag: 'div',
                class: 'd-flex justify-content-center align-items-center',
                style: {
                    width: '70px',
                    height: '70px',
                },
                children: [this.app.graphics.appIcon],
            },
            {
                tag: 'div',
                class: 'd-flex justify-content-center align-items-center mt-1',
                children: [
                    {
                        tag: 'div',
                        style: {
                            height: '43px',
                        },
                        innerText: this.app.displayName,
                    },
                ],
            },
            {
                source$: this.hovered$,
                vdomMap: (isHovered) =>
                    isHovered
                        ? new SideAppActionsView({
                              state: params.state,
                              modalState: params.modalState,
                              app: params.app,
                          })
                        : { tag: 'div' },
            },
        ]
        this.ondblclick = (ev: MouseEvent) => {
            this.modalState.ok$.next(ev)
            this.state
                .createInstance$({
                    cdnPackage: this.app.cdnPackage,
                    version: 'latest',
                    focus: true,
                })
                .subscribe()
        }
    }
}

/**
 * @category View
 */
class RunningAppsView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'w-25 overflow-auto h-100 d-flex testsScroll flex-column yw-scrollbar'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        position: 'relative' as const,
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
                tag: 'div',
                style: {
                    position: 'sticky',
                    top: '0px',
                    textAlignLast: 'left',
                    width: '100%',
                    backgroundColor: '#444444',
                    paddingBottom: '5px',
                    zIndex: 1,
                },
                innerText: 'Running Applications',
            },
            {
                tag: 'div',
                class: 'd-flex flex-column flex-grow-1',
                style: {
                    minHeight: '0px',
                },
                children: {
                    policy: 'replace',
                    source$: this.state.runningApplications$,
                    vdomMap: (runningApps: OsCore.RunningApp[]) => {
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
                },
            },
        ]
    }
}

/**
 * @category View
 */
export class RunningAppView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = `rounded text-break d-flex flex-column align-items-center rounded w-100  my-1  fv-bg-background-alt`
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
                tag: 'div',
                class: 'fv-bg-background w-100 rounded px-1',
                children: [
                    this.headerView(),
                    {
                        tag: 'div',
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

    headerView(): VirtualDOM<'div'> {
        return {
            tag: 'div',
            class: `w-100 fv-text-primary d-flex align-items-center justify-content-between position-relative yw-minimized-app`,
            children: [
                {
                    source$: this.executable.appMetadata$,
                    vdomMap: (d: OsCore.ApplicationInfo) => ({
                        tag: 'div',
                        class: 'p-1',
                        style: {
                            height: '40px',
                            width: '40px',
                        },
                        children: [d.graphics.appIcon],
                    }),
                },
                {
                    tag: 'span',
                    style: {
                        fontWeight: 'bolder',
                    },
                    class: 'mx-2',
                    innerText: {
                        source$: this.executable.appMetadata$,
                        vdomMap: (d: OsCore.ApplicationInfo) => d.displayName,
                    },
                },
            ],
        }
    }
}

/**
 * @category View
 */
class InstancesListView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
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
    public readonly children: ChildrenLike
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
    public readonly style = { userSelect: 'none' as const }

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
        executable: OsCore.Executable
        instances: OsCore.RunningApp[]
    }) {
        Object.assign(this, params)

        this.children = [this.instancesListView()]
    }

    instancesListView(): VirtualDOM<'div'> {
        return {
            tag: 'div',
            class: 'w-100',
            style: {
                width: 'fit-content',
            },
            children: this.instances.map((app): VirtualDOM<'div'> => {
                return {
                    tag: 'div',
                    class: {
                        source$: this.state.runningApplication$,
                        vdomMap: (selected: OsCore.RunningApp): string => {
                            return selected &&
                                selected.instanceId == app.instanceId
                                ? 'fv-text-focus '
                                : 'fv-text-primary '
                        },
                        wrapper: (d) =>
                            `${d} fv-pointer px-1 my-2 rounded fv-hover-bg-background-alt d-flex align-items-center justify-content-between`,
                    },
                    onclick: (ev) => {
                        this.modalState.ok$.next(ev)
                        this.state.focus(app.instanceId)
                    },
                    children: [
                        {
                            tag: 'div',
                            class: 'px-1',
                            children: [
                                {
                                    source$: app.snippet$,
                                    vdomMap: (snippet: AnyVirtualDOM) =>
                                        snippet,
                                },
                            ],
                        },
                        {
                            tag: 'div',
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
