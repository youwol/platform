import { attr$, child$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject } from 'rxjs'
import { baseClassCtxMenuActions } from './context-menu.view'
import { ProfileEditOptView } from '../top-banner/badges'
import { Accounts } from '@youwol/http-clients'
import { ProfilesState } from '../modals/profiles'

export class DesktopCtxMenuView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = { maxWidth: 'fit-content' }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({ profileState }) {
        this.children = [
            new FullscreenView(),
            new EditProfileCtxView({ profileState }),
        ]
    }
}

export class FullscreenView implements VirtualDOM {
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
        const isFullscreen$ = new BehaviorSubject<boolean>(
            !document.fullscreenElement,
        )
        this.children = [
            {
                class: attr$(isFullscreen$, (isFullscreen) =>
                    !isFullscreen
                        ? 'fas fa-compress pe-2'
                        : 'fas fa-expand pe-2',
                ),
            },
            {
                innerText: attr$(isFullscreen$, (isFullscreen) =>
                    !isFullscreen ? 'Reduce screen' : 'Full screen',
                ),
            },
        ]
        this.onclick = () => {
            const doc = document
            const elem = doc.documentElement
            !doc.fullscreenElement
                ? elem.requestFullscreen()
                : doc.exitFullscreen()
        }
    }
}

export const classEditProfileCtxMenu = 'editProfileCtxMenu'

export class EditProfileCtxView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = classEditProfileCtxMenu
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({
        sessionInfo,
        profileState,
    }: {
        sessionInfo?: Accounts.SessionDetails
        profileState: ProfilesState
    }) {
        this.children = [
            child$(profileState.selectedProfile$, (profile) => {
                return new ProfileEditOptView({
                    profile: profile,
                    sessionInfo: sessionInfo,
                    state: profileState,
                })
            }),
        ]
    }
}
