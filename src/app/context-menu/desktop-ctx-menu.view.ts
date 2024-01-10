import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { BehaviorSubject } from 'rxjs'
import { baseClassCtxMenuActions } from './context-menu.view'
import { ProfileEditOptView } from '../top-banner/badges'
import { Accounts } from '@youwol/http-clients'
import { Profile, ProfilesState } from '../modals/profiles'

export class DesktopCtxMenuView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'

    /**
     * @group Immutable DOM Constants
     */
    public readonly style = { maxWidth: 'fit-content' }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor({ profileState }) {
        this.children = [
            new FullscreenView(),
            new EditProfileCtxView({ profileState }),
        ]
    }
}

export class FullscreenView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'

    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseClassCtxMenuActions
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
                tag: 'div',
                class: {
                    source$: isFullscreen$,
                    vdomMap: (isFullscreen) =>
                        !isFullscreen
                            ? 'fas fa-compress pe-2'
                            : 'fas fa-expand pe-2',
                },
            },
            {
                tag: 'div',
                innerText: {
                    source$: isFullscreen$,
                    vdomMap: (isFullscreen) =>
                        !isFullscreen ? 'Reduce screen' : 'Full screen',
                },
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

export class EditProfileCtxView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'

    /**
     * @group Immutable DOM Constants
     */
    public readonly class = classEditProfileCtxMenu
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor({
        sessionInfo,
        profileState,
    }: {
        sessionInfo?: Accounts.SessionDetails
        profileState: ProfilesState
    }) {
        this.children = [
            {
                source$: profileState.selectedProfile$,
                vdomMap: (profile: Profile) => {
                    return new ProfileEditOptView({
                        profile: profile,
                        sessionInfo: sessionInfo,
                        state: profileState,
                    })
                },
            },
        ]
    }
}
