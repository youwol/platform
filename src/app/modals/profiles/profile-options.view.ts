import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { ProfilesState } from './profiles.state'
import { popupModal } from '../common'

import {
    DeleteProfileConfirmation,
    DuplicatedProfileConfirmation,
    RenameProfileConfirmation,
} from './Profile-confirm-options'
import { ProfileEditOptView } from '../../top-banner/badges'
import { Accounts } from '@youwol/http-clients'

export class ProfileOptionsView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'accordion-collapse collapse   fv-text-primary'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
                tag: 'div',
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

export class ProfileDeleteOptView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
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
    public readonly children: ChildrenLike

    constructor({
        profile,
        state,
    }: {
        profile: { id: string; name: string }
        state: ProfilesState
    }) {
        this.children = [
            new FontawesomeFixBoxView({
                fasClass: 'fas fa-trash-alt pe-2 yw-hover-text-orange',
            }),
            {
                tag: 'div',
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

export class ProfileRenameOptView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseProfileOptClass
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
            new FontawesomeFixBoxView({ fasClass: 'fas fa-edit  pe-2' }),
            {
                tag: 'div',
                innerText: 'Rename',
            },
        ]
        this.onclick = () =>
            popupModal(() => new RenameProfileConfirmation({ profile, state }))
    }
}

export class ProfileDuplicateOptView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseProfileOptClass
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
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
            new FontawesomeFixBoxView({ fasClass: 'fas fa-clone  pe-2' }),
            {
                tag: 'div',
                innerText: 'Duplicate ',
            },
        ]
        this.onclick = () =>
            popupModal(
                () => new DuplicatedProfileConfirmation({ profile, state }),
            )
    }
}

export class FontawesomeFixBoxView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex flex-column align-items-start'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style: { width: string; height: string }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(params: { fasClass: string; width?: string; height?: string }) {
        Object.assign(this, params)
        this.children = [
            {
                tag: 'div',
                class: params.fasClass,
            },
        ]
        this.style = {
            width: params.width ? params.width : '24px',
            height: params.height ? params.height : '13px',
        }
    }
}
