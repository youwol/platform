import * as OsCore from '@youwol/os-core'
import { children$, VirtualDOM } from '@youwol/flux-view'
import { map } from 'rxjs/operators'
import { popupModal } from '../../modals'
import { ApplicationsLaunchPadView } from '../../modals/launchpad'

/**
 *
 * @category View.TopBanner
 */
export class LaunchpadBadgeView implements VirtualDOM {
    public readonly class =
        'd-flex my-auto  p-1 rounded fv-hover-bg-background-alt fv-pointer top-banner-menu-view'

    public readonly children: VirtualDOM[]

    public readonly onclick: (ev: MouseEvent) => void

    constructor({ state }: { state: OsCore.PlatformState }) {
        this.children = [
            {
                class: 'd-flex flex-wrap',
                style: {
                    width: '25px',
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
                                            ? 'fv-bg-success fv-border-success'
                                            : 'fv-bg-primary fv-border-primary'),
                                    style: {
                                        width: '6px',
                                        height: '6px',
                                        margin: '1px',
                                    },
                                }
                            }),
                ),
            },
        ]
        this.onclick = () =>
            popupModal(() => new ApplicationsLaunchPadView({ state }))
    }
}
