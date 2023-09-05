import { VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { TooltipsView } from '../../tooltips/tooltips.view'

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
    public readonly style = {
        position: 'relative',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[] = []
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: (el) => void
    // need to improve
    // public readonly connectedCallback = (elem) => {
    //     return installContextMenu({
    //         div: elem,
    //         children: [new ContextMenuYwIconView()],
    //     })
    // }

    constructor({
        state,
        preferences,
        app,
    }: {
        state: OsCore.PlatformState
        preferences: OsCore.Preferences
        app?: OsCore.RunningApp
    }) {
        // const ctxState = new ContextMenuState1()

        if (!OsCore.PreferencesExtractor.getCorporation(preferences)) {
            return
        }
        this.class =
            OsCore.PreferencesExtractor.getCorporationWidgets(preferences, {
                platformState: state,
            }).length > 0
                ? 'ms-2 d-flex rounded  top-banner-menu-view'
                : 'mx-1'
        this.children = [
            {
                class: ' my-auto  p-1 rounded fv-hover-bg-background-alt',
                children: [preferences.desktop.topBanner.corporation.icon],
                onclick: (el) => {
                    el.preventDefault()
                    app?.instanceId ? state.minimize(app.instanceId) : ''
                },
            },
            new TooltipsView({
                tooltipPlace: { top: 9, right: -8 },
                tooltipArrow: {
                    arrowLength: 230,
                    leftRightMove: 38,
                    arrowWidth: 15,
                },
                divId: 'yw-icon',
                tooltipText:
                    "Click on company's logo to return to dashboard or to have more information.",
            }),
        ]
    }
}
