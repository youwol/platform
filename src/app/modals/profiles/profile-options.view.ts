import { VirtualDOM } from '@youwol/flux-view'
import { ProfilesState } from './profiles.state'
import { popupModal } from '../common'

import {
    DeleteProfileConfirmation,
    DuplicatedProfileConfirmation,
    RenameProfileConfirmation,
} from './Profile-confirm-options'
import { ProfileEditOptView } from '../../top-banner/badges'
import { Accounts } from '@youwol/http-clients'

export class ProfileOptionsView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'accordion-collapse collapse   fv-text-primary'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly id
    /**
     * @group Immutable DOM Constants
     */
    public readonly customAttributes = {
        dataBsParent: '#accordionFlushExample',
        ariaLabelledby: 'flush-headingOne',
    }
    public readonly onclick: () => void

    constructor({
        sessionInfo,
        profile,
        state,
        divId,
    }: {
        sessionInfo: Accounts.SessionDetails
        profile: { id: string; name: string }
        state: ProfilesState
        divId: string
    }) {
        this.children = [
            {
                class: 'd-flex flex-column align-items-start float-end ',
                style: { width: '85.8%', fontSize: '13px' },
                children:
                    profile.id != 'default'
                        ? [
                              new ProfileRenameOptView({ profile, state }),
                              new ProfileEditOptView({
                                  profile,
                                  sessionInfo,
                                  state,
                              }),
                              new ProfileDuplicateOptView({
                                  profile,
                                  state,
                              }),
                              new ProfileDeleteOptView({
                                  profile,
                                  state,
                              }),
                          ]
                        : [
                              new ProfileDuplicateOptView({
                                  profile,
                                  state,
                              }),
                          ],
            },
        ]
        this.id = 'profilesOpt' + divId
    }
}

const baseProfileOptClass =
    'fv-text-primary yw-hover-text-primary text-center  w-100 fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center mb-1 px-3'

export class ProfileDeleteOptView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseProfileOptClass
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        this.children = [
            {
                class: 'fas fa-trash-alt pe-2 yw-hover-text-orange',
            },
            {
                innerText: 'Delete',
            },
        ]
        this.onclick = () =>
            popupModal(
                () =>
                    new DeleteProfileConfirmation({
                        profile,
                        state,
                    }),
            )
    }
}

export class ProfileRenameOptView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseProfileOptClass
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        this.children = [
            {
                class: 'fas fa-edit  pe-2',
            },
            {
                innerText: 'Rename',
            },
        ]
        this.onclick = () =>
            popupModal(() => new RenameProfileConfirmation({ profile, state }))
    }
}

export class ProfileDuplicateOptView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseProfileOptClass
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        this.children = [
            {
                class: 'fas fa-clone  pe-2',
            },
            {
                innerText: 'Duplicate ',
            },
        ]
        this.onclick = () =>
            popupModal(
                () => new DuplicatedProfileConfirmation({ profile, state }),
            )
    }
}
