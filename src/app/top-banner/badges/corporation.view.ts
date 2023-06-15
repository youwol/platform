import { VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'

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
        app,
    }: {
        state: OsCore.PlatformState
        preferences: OsCore.Preferences
        app?: OsCore.RunningApp
    }) {
        if (!OsCore.PreferencesExtractor.getCorporation(preferences)) {
            return
        }
        this.class =
            OsCore.PreferencesExtractor.getCorporationWidgets(preferences, {
                platformState: state,
            }).length > 0
                ? 'ml-2 d-flex my-auto yw-disable-click p-1 rounded fv-hover-bg-background-alt fv-pointer top-banner-menu-view'
                : 'mx-1'
        console.log('Widgets')
        this.children = [preferences.desktop.topBanner.corporation.icon]
        this.onclick = () => {
            state.minimize(app.instanceId)
        }
    }
}
