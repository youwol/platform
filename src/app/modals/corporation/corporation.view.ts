import * as OsCore from '@youwol/os-core'
import { VirtualDOM } from '@youwol/flux-view'

/**
 * @category View
 */
export class CorporationView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex flex-column w-75 h-75'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({
        state,
        preferences,
    }: {
        state: OsCore.PlatformState
        preferences: OsCore.Preferences
    }) {
        this.children = OsCore.PreferencesExtractor.getCorporationWidgets(
            preferences,
            { platformState: state },
        )
    }
}
