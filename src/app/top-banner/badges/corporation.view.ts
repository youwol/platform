import { VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { TooltipsView } from '../../tooltips/tooltips.view'
import { popupModal } from '../../modals'
import { ClosePopupButtonView } from '../../modals/profiles'
import { setup } from '../../../auto-generated'

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
                ? 'ms-2 d-flex rounded  top-banner-menu-view'
                : 'mx-1 align-self-center'
        this.children = [
            {
                class: ' my-auto  p-1 rounded fv-hover-bg-background-alt',
                children: [preferences.desktop.topBanner.corporation.icon],
                onclick: (el) => {
                    el.preventDefault()
                    popupModal(() => new AboutYwView())
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

export class AboutYwView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'rounded mx-auto my-auto p-3 yw-popup-about  yw-box-shadow yw-animate-in'
    /**
     * @group Immutable DOM Constants
     */
    public children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor() {
        this.children = [
            new AboutYwLogoView(),
            new AboutYwContentsView(),
            new ClosePopupButtonView(),
        ]
    }
}

export class AboutYwContentsView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex w-100 mt-4 align-items-end'
    /**
     * @group Immutable DOM Constants
     */
    public children: VirtualDOM[]
    public readonly onclick: () => void

    constructor() {
        this.children = [new AboutYwTextContentsView(), aboutYwImgContentsView]
    }
}

export class AboutYwTextContentsView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex flex-column align-items-start mb-5 me-5'
    /**
     * @group Immutable DOM Constants
     */
    public children: VirtualDOM[]
    public readonly onclick: () => void

    constructor() {
        this.children = [
            {
                class: 'h5 fv-text-primary mt-4 mb-4 text-center',
                innerText: '© 2019–2023 YouWol',
            },
            {
                tag: 'a',
                target: '_blank',
                class: 'h5 fv-text-primary mt-1 mb-4 text-center text-decoration-none ',
                href: 'https://youwol.com',
                innerHTML: `wwww.youwol.com`,
            },
        ]
    }
}

class AboutYwLogoView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex align-items-end'
    /**
     * @group Immutable DOM Constants
     */
    public children: VirtualDOM[]

    constructor() {
        this.children = [
            {
                class: 'w-50',
                tag: 'img',
                innerText: 'Platform',
                src: `/api/assets-gateway/raw/package/${setup.assetId}/${setup.version}/assets/logo_YouWol_name_white.svg`,
            },
            {
                class: 'h1 p-0 m-0 ms-4',
                style: {
                    lineHeight: '1.1',
                },
                innerText: 'Platform',
            },
        ]
    }
}

const aboutYwImgContentsView = {
    tag: 'img',
    src: `/api/assets-gateway/raw/package/${setup.assetId}/${setup.version}/assets/youWol_bg_img.png`,
    style: {
        height: '20rem',
        marginLeft: '2rem',
    },
}
