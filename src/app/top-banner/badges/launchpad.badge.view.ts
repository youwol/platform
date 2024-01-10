import * as OsCore from '@youwol/os-core'
import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { map } from 'rxjs/operators'
import { popupModal } from '../../modals'
import { ApplicationsLaunchPadView } from '../../modals/launchpad'
import { TooltipsView } from '../../tooltips/tooltips.view'

/**
 *
 * @category View
 */
export class LaunchpadBadgeView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex top-banner-menu-view'
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
     * @group Immutable DOM Constants
     */
    public readonly onclick: (ev: MouseEvent) => void

    constructor({
        state,
        isTooltip = true,
    }: {
        state: OsCore.PlatformState
        isTooltip?: boolean
    }) {
        this.children = [
            {
                tag: 'div',
                class: 'd-flex flex-wrap  my-auto  p-1 rounded fv-hover-bg-background-alt fv-pointer ',
                style: {
                    width: '33px',
                    height: '33px',
                },
                customAttributes: {
                    dataBsToggle: 'tooltip',
                    dataBsPlacement: 'right',
                    title: 'Application Launcher',
                },
                children: {
                    policy: 'replace',
                    source$: state.runningApplications$.pipe(
                        map(
                            (apps) =>
                                new Set(apps.map((app) => app.cdnPackage)),
                        ),
                    ),
                    vdomMap: (distinctApps: Set<string>) =>
                        Array(9)
                            .fill(null)
                            .map((_, i) => {
                                return {
                                    tag: 'div',
                                    class:
                                        'rounded ' +
                                        (i < distinctApps.size
                                            ? 'yw-bg-orange  fv-border-orange'
                                            : 'fv-bg-primary fv-border-primary'),
                                    style: {
                                        width: '6px',
                                        height: '6px',
                                        margin: '1px',
                                    },
                                }
                            }),
                },
                onclick: () =>
                    popupModal(
                        (modalState) =>
                            new ApplicationsLaunchPadView({
                                state,
                                modalState,
                            }),
                        (elem, modalState) =>
                            (elem.onclick = (ev) =>
                                modalState.cancel$.next(ev)),
                    ),
            },
            isTooltip
                ? new TooltipsView({
                      tooltipPlace: { top: 2, right: -10 },
                      tooltipArrow: {
                          arrowLength: 30,
                          leftRightMove: 1,
                          arrowWidth: 10,
                      },
                      divId: 'desktop-launchpad',
                      tooltipText:
                          'Click here to start the Application Launcher',
                  })
                : { tag: 'div' },
        ]
    }
}
