import * as OsCore from '@youwol/os-core'
import { VirtualDOM } from '@youwol/flux-view'

export class CorporationView {
    public readonly class = 'd-flex flex-column w-75 h-75'

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
