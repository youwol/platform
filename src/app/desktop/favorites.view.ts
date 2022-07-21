import {
    attr$,
    child$,
    Stream$,
    VirtualDOM,
    children$,
} from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { ExplorerBackend } from '@youwol/http-clients'
import { BehaviorSubject } from 'rxjs'

/**
 * @category View
 */
export class DesktopFavoritesView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: Stream$<OsCore.RunningApp, string>
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group States
     */
    public readonly state: OsCore.PlatformState

    constructor(params: { state: OsCore.PlatformState }) {
        Object.assign(this, params)
        this.class = attr$(
            this.state.runningApplication$,
            (runningApp): string => (runningApp ? 'd-none' : 'd-flex'),
            {
                wrapper: (d) => `w-100 h-100 p-2 ${d}`,
            },
        )
        this.children = [
            {
                class: `w-100 h-100 d-flex flex-wrap`,
                children: children$(
                    OsCore.FavoritesFacade.getItems$(),
                    (items) => {
                        return items.map((item) => {
                            return new DesktopFavoriteView({
                                item,
                            })
                        })
                    },
                ),
            },
        ]
    }
}

/**
 * @category View
 */
export class DesktopFavoriteView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'rounded p-2 d-flex flex-column align-items-center fv-pointer fv-hover-border-focus m-2'
    /**
     * @group Immutable Constants
     */
    public readonly baseStyle = {
        width: 'fit-content',
        height: 'fit-content',
        zIndex: 4,
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly style: Stream$<boolean, { [k: string]: string }>
    /**
     * @group Immutable Constants
     */
    public readonly item: ExplorerBackend.GetItemResponse
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Observables
     */
    public readonly defaultOpeningApp$
    /**
     * @group Observables
     */
    private readonly hovered$ = new BehaviorSubject(false)

    /**
     * @group Immutable DOM Constants
     */
    public readonly ondblclick = () => {
        OsCore.tryOpenWithDefault$(this.item).subscribe()
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly onmouseenter = () => {
        this.hovered$.next(true)
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly onmouseleave = () => {
        this.hovered$.next(false)
    }

    constructor(params: { item: ExplorerBackend.GetItemResponse }) {
        Object.assign(this, params)

        this.defaultOpeningApp$ = OsCore.defaultOpeningApp$(this.item)

        this.style = attr$(
            this.hovered$,
            (hovered) => {
                return hovered
                    ? { backgroundColor: 'rgba(0,0,0,0.6)' }
                    : { backgroundColor: 'rgba(0,0,0,0.4)' }
            },
            {
                wrapper: (d) => ({ ...this.baseStyle, ...d }),
            },
        )
        this.children = [
            child$(
                this.defaultOpeningApp$,
                (
                    defaultResp:
                        | { appInfo: OsCore.ApplicationInfo }
                        | undefined,
                ) => {
                    if (!defaultResp) {
                        return { class: 'fas fa-file fa-2x' }
                    }
                    return defaultResp.appInfo.graphics.appIcon
                },
                {
                    untilFirst: {
                        class: 'd-flex align-items-center position-relative',
                        children: [
                            { class: 'fas fa-file fa-2x' },
                            {
                                class: 'fas fa-spinner w-100 fa-spin fv-text-secondary text-center position-absolute',
                            },
                        ],
                    },
                },
            ),
            {
                innerText: this.item.name,
            },
        ]
    }
}
