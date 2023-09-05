import * as OsCore from '@youwol/os-core'
import { children$, VirtualDOM } from '@youwol/flux-view'
import { map } from 'rxjs/operators'
import { popupModal } from '../../modals'
import { ApplicationsLaunchPadView } from '../../modals/launchpad'
import { TooltipsView } from '../../tooltips/tooltips.view'

/**
 *
 * @category View
 */
export class LaunchpadBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex top-banner-menu-view'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        position: 'relative',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: (ev: MouseEvent) => void

    constructor({ state }: { state: OsCore.PlatformState }) {
        this.children = [
            {
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
                children: children$(
                    state.runningApplications$.pipe(
                        map(
                            (apps) =>
                                new Set(apps.map((app) => app.cdnPackage)),
                        ),
                    ),
                    (distinctApps) =>
                        Array(9)
                            .fill(null)
                            .map((_, i) => {
                                return {
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
                ),
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
            new TooltipsView({
                tooltipPlace: { top: 2, right: -10 },
                tooltipArrow: {
                    arrowLength: 30,
                    leftRightMove: 1,
                    arrowWidth: 10,
                },
                divId: 'desktop-launchpad',
                tooltipText: 'Click here to start the Application Launcher',
            }),
        ]
    }
}
