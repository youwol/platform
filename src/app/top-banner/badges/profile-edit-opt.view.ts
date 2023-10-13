import { popupModal } from '../../modals'
import { Accounts } from '@youwol/http-clients'
import { ProfilesState, ProfilesView } from '../../modals/profiles'
import { VirtualDOM } from '@youwol/flux-view'
import { classEditProfileCtxMenu } from '../../context-menu/desktop-ctx-menu.view'
import { baseClassCtxMenuActions } from '../../context-menu/context-menu.view'
import { FontawesomeFixBoxView } from '../../modals/profiles/profile-options.view'

/**
 * @category View
 */
export class ProfileEditOptView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'fv-text-primary yw-hover-text-primary text-center  w-100 fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center mb-1 px-3'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void
    /**
     * @group Immutable DOM Constants
     */
    public readonly connectedCallback: (elem: HTMLElement) => void

    constructor({
        profile,
        sessionInfo,
        state,
    }: {
        profile: { id: string; name: string }

        sessionInfo: Accounts.SessionDetails
        state: ProfilesState
    }) {
        this.children = [
            new FontawesomeFixBoxView({ fasClass: 'fas fa-cog pe-2 ' }),
            {
                innerText: 'Edit profile',
            },
        ]
        this.onclick = () => {
            state.editProfile(profile.id)
            popupModal(() => new ProfilesView({ sessionInfo, state }))
        }
        this.connectedCallback = (elem: HTMLElement) => {
            const parentElement = elem.parentElement.className
            parentElement === classEditProfileCtxMenu
                ? (elem.className = baseClassCtxMenuActions)
                : {}
        }
    }
}
