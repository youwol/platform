import { attr$, child$, VirtualDOM } from '@youwol/flux-view'
import * as OsCore from '@youwol/os-core'
import * as cdnClient from '@youwol/cdn-client'
import type * as Marked from 'marked'

import { Modal } from '@youwol/fv-group'
import { popupModal } from '../common'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import { setup } from '../../../auto-generated'
import { FavoritesFacade } from '@youwol/os-core'

export class SideAppActionsView implements VirtualDOM {
    public readonly class = 'd-flex flex-column' //: Stream$<boolean, string>
    public readonly style = {
        position: 'absolute',
        top: '5px',
        right: '-5%',
    }

    public readonly children: VirtualDOM[]
    public readonly onclick = (ev) => ev.stopPropagation()

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
        app: OsCore.ApplicationInfo
    }) {
        const assetId = window.btoa(window.btoa(params.app.cdnPackage))
        this.children = [
            new SideAppRunAction({
                state: params.state,
                modalState: params.modalState,
                app: params.app,
            }),
            child$(
                OsCore.RequestsExecutor.getAsset(
                    window.btoa(window.btoa(params.app.cdnPackage)),
                ),
                (asset) => {
                    return asset.description
                        ? new SideAppInfoAction({
                              name: params.app.displayName,
                              description: asset.description,
                          })
                        : {}
                },
            ),
            new SideAppFavoriteAction({
                assetId: assetId,
            }),
        ]
    }
}

const basedActionsClass =
    'rounded d-flex justify-content-center align-items-center'
const basedActionsStyle = {
    width: '15px',
    height: '15px',
    marginTop: '3px',
}

const iconsClasses = 'fas  fa-xs yw-hover-text-orange fv-pointer'

class SideAppRunAction implements VirtualDOM {
    public readonly class = basedActionsClass
    public readonly style = basedActionsStyle
    public readonly children: VirtualDOM[]
    public readonly onclick: (ev) => void

    constructor(params: {
        state: OsCore.PlatformState
        modalState: Modal.State
        app: OsCore.ApplicationInfo
    }) {
        this.children = [
            {
                class: `fa-play ${iconsClasses}`,
                customAttributes: {
                    dataToggle: 'tooltip',
                    title: 'Run',
                },
            },
        ]
        this.onclick = (ev) => {
            params.modalState.ok$.next(ev)
            params.state
                .createInstance$({
                    cdnPackage: params.app.cdnPackage,
                    version: 'latest',
                    focus: true,
                })
                .subscribe()
        }
    }
}

class SideAppInfoAction implements VirtualDOM {
    public readonly class = basedActionsClass
    public readonly style = basedActionsStyle
    public readonly children: VirtualDOM[]
    public readonly onclick: () => void

    constructor(params: { name: string; description: string }) {
        Object.assign(this, params)
        this.children = [
            {
                class: `fa-info ${iconsClasses}`,
                customAttributes: {
                    dataToggle: 'tooltip',
                    title: 'More information',
                },
            },
        ]
        this.onclick = () =>
            popupModal(
                () =>
                    new AppDescriptionView({
                        name: params.name,
                        description: params.description,
                    }),
            )
    }
}

class SideAppFavoriteAction implements VirtualDOM {
    public readonly class = basedActionsClass
    public readonly style = basedActionsStyle
    public readonly children: VirtualDOM[]
    public readonly onclick: () => void

    constructor(params: { assetId: string }) {
        Object.assign(this, params)
        this.children = [
            {
                class: attr$(OsCore.FavoritesFacade.getApplications$(), (app) =>
                    app.find((a) => a.assetId === params.assetId)
                        ? `fa-star  ${iconsClasses}`
                        : `fa-star text-secondary ${iconsClasses}`,
                ),
                customAttributes: {
                    dataToggle: 'tooltip',
                    title: attr$(FavoritesFacade.getApplications$(), (app) => {
                        return app.find((a) =>
                            a.assetId === params.assetId
                                ? 'un-favorite'
                                : `favorite`,
                        )
                    }),
                },
            },
        ]
        this.onclick = () => {
            FavoritesFacade.toggleFavoriteApplication(params.assetId)
        }
    }
}

function installMarked$() {
    return from(
        cdnClient.install({
            modules: [`marked#${setup.runTimeDependencies.externals.marked}`],
        }) as unknown as Promise<{ marked: typeof Marked }>,
    ).pipe(map(({ marked }) => marked))
}

class AppDescriptionView implements VirtualDOM {
    public readonly class =
        'vw-50 vh-50 rounded mx-auto my-auto p-4 yw-bg-dark  yw-box-shadow yw-animate-in '
    public readonly children: VirtualDOM[]

    constructor(params: { name: string; description: string }) {
        this.children = [
            new PopupHeaderView({
                title: params.name,
                fa: 'info',
            }),
            child$(installMarked$(), (markedModule) => ({
                class: 'fv-text-primary mt-4 mb-4 text-start overflow-auto',
                style: {
                    width: '50vh',
                    maxHeight: '50vh',
                },
                innerHTML: markedModule.parse(params.description),
            })),
            {
                class: 'd-flex  fv-text-primary yw-hover-text-dark justify-content-center',
                children: [new CanclePopupButtonView()],
            },

            new ClosePopupButtonView(),
        ]
    }
}

export class PopupHeaderView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag: string = 'i'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ title, fa }: { title: string; fa: string }) {
        this.children = [
            {
                style: {
                    fontSize: '16px',
                },
                class: 'ms-3 fv-font-family-regular',
                innerHTML: title,
            },
        ]
        this.class = `fas fa-${fa} d-flex fa-lg fv-text-primary `
    }
}

export class CanclePopupButtonView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'btn me-3 yw-text-light-orange  yw-border-orange yw-hover-bg-light-orange rounded yw-hover-text-dark yw-text-orange  fv-bg-background'

    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'span'
    /**
     * @group Immutable DOM Constants
     */
    public readonly innerText = 'Cancel'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        color: 'unset',
        width: '100px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick = () => closeWithoutAction()
}

export class ClosePopupButtonView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'fas fa-times  fv-pointer yw-text-orange'
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'span'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        position: 'absolute',
        top: '10px',
        right: '10px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick = () => closeWithoutAction()
}

const closeWithoutAction = () =>
    document.querySelector('body > div:nth-child(3)').remove()
