import { VirtualDOM } from '@youwol/flux-view'
import { baseClassCtxMenuActions } from './context-menu.view'
import { popupModal } from '../modals'
import { ClosePopupButtonView } from '../modals/profiles'
import { setup } from '../../auto-generated'

export class IconCtxMenuView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = ''
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor() {
        this.children = [new YwWebsiteLinkActionView(), new AboutYwActionView()]
    }
}

export class YwWebsiteLinkActionView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseClassCtxMenuActions
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor() {
        this.children = [
            {
                class: 'fas fa-link pe-2',
            },
            {
                innerText: 'Web site',
            },
        ]
        this.onclick = () => window.open('https://www2.youwol.com/')
    }
}

export class AboutYwActionView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseClassCtxMenuActions
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor() {
        this.children = [
            {
                class: 'fas fa-info pe-2',
            },
            {
                innerText: 'About YouWol',
            },
        ]
        this.onclick = () => popupModal(() => new AboutYwView())
    }
}

export class AboutYwView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'rounded mx-auto my-auto p-4 yw-bg-dark  yw-box-shadow yw-animate-in'
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
            AboutYwLogoView,
            new AboutYwContentsView(),
            new ClosePopupButtonView(),
        ]
    }
}

export class AboutYwContentsView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex w-100 align-items-center'
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
    public readonly class = 'd-flex flex-column align-items-start me-3'
    /**
     * @group Immutable DOM Constants
     */
    public children: VirtualDOM[]
    public readonly onclick: () => void

    constructor() {
        this.children = [
            {
                class: 'fv-text-primary mt-4 mb-4 text-center',
                innerText: 'Copyright © 2018–2023 YouWol',
            },
            {
                class: 'fv-text-primary mt-1 mb-1 text-center',
                innerText: `Built date: 11/08/2023  `,
            },
            {
                class: 'fv-text-primary mt-1 mb-1 text-center',
                innerText: `Desktop Version:${setup.version}`,
            },
            {
                class: 'fv-text-primary mt-1 mb-4 text-center',
                innerHTML: `Powered by :  <a href="https://www2.youwol.com">YouWol</a>`,
            },
        ]
    }
}

const AboutYwLogoView = {
    class: 'w-25',
    tag: 'img',
    src: `/api/assets-gateway/raw/package/${setup.assetId}/${setup.version}/assets/logo_YouWol_name_white.svg`,
}

const aboutYwImgContentsView = {
    tag: 'img',
    src: `/api/assets-gateway/raw/package/${setup.assetId}/${setup.version}/assets/youWol_bg_img.png`,
    style: {
        height: '20rem',
    },
}
