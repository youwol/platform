import {
    attr$,
    child$,
    Stream$,
    VirtualDOM,
    children$,
} from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import { TreedbBackend } from '@youwol/http-clients'
import { BehaviorSubject } from 'rxjs'

export class DesktopFavoritesView implements VirtualDOM {
    public readonly class: Stream$<OsCore.RunningApp, string>
    public readonly children: VirtualDOM[]
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
                                entityResponse: item,
                            })
                        })
                    },
                ),
            },
        ]
    }
}

export class DesktopFavoriteView implements VirtualDOM {
    public readonly class =
        'rounded p-2 d-flex flex-column align-items-center fv-pointer fv-hover-border-focus m-2'
    public readonly baseStyle = {
        width: 'fit-content',
        height: 'fit-content',
        zIndex: 4,
    }
    public readonly style: Stream$<boolean, { [k: string]: string }>
    public readonly itemNode: OsCore.ItemNode
    public readonly entityResponse: TreedbBackend.GetEntityResponse
    public readonly children: VirtualDOM[]
    public readonly defaultOpeningApp$
    public readonly hovered$ = new BehaviorSubject(false)
    public readonly ondblclick = () => {
        OsCore.tryOpenWithDefault$(this.itemNode).subscribe()
    }

    public readonly onmouseenter = () => {
        this.hovered$.next(true)
    }
    public readonly onmouseleave = () => {
        this.hovered$.next(false)
    }

    constructor(params: { entityResponse: TreedbBackend.GetEntityResponse }) {
        Object.assign(this, params)

        this.defaultOpeningApp$ = OsCore.defaultOpeningApp$(this.itemNode)
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
                innerText: this.entityResponse.entity.name,
            },
        ]
    }
}
