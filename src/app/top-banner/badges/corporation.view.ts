import { popupModal } from '../../modals'
import { VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { CorporationView } from '../../modals/corporation'

/**
 * @category View
 */
export class CorporationBadgeView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[] = []
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor({
        state,
        preferences,
    }: {
        state: OsCore.PlatformState
        preferences: OsCore.Preferences
    }) {
        if (!OsCore.PreferencesExtractor.getCorporation(preferences)) {
            return
        }
        this.class =
            OsCore.PreferencesExtractor.getCorporationWidgets(preferences, {
                platformState: state,
            }).length > 0
                ? 'mx-1 fv-pointer rounded fv-hover-bg-background-alt'
                : 'mx-1'
        console.log('Widgets')
        this.children = [preferences.desktop.topBanner.corporation.icon]
        this.onclick = () => {
            popupModal(
                () =>
                    new CorporationView({
                        state,
                        preferences,
                    }),
            )
        }
    }
}
