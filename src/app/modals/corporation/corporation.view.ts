import * as OsCore from '@youwol/os-core'
import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'

/**
 * @category View
 */
export class CorporationView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex flex-column w-75 h-75'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

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
