import { popupModal } from '../../modals'
import { Accounts, CdnSessionsStorage } from '@youwol/http-clients'
import { HTTPError, raiseHTTPErrors } from '@youwol/http-primitives'
import { ProfilesState, ProfilesView } from '../../modals/profiles'
import { setup } from '../../../auto-generated'
import { child$, VirtualDOM } from '@youwol/flux-view'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { baseDropdownItemsClass } from '../../modals/user'

/**
 * @category View
 */
export class ProfilesBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = baseDropdownItemsClass
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor({
        sessionInfo,
        state,
    }: {
        sessionInfo: Accounts.SessionDetails
        state: ProfilesState
    }) {
        const getData$ = new CdnSessionsStorage.Client().getData$({
            packageName: setup.name,
            dataName: 'profilesInfo',
        }) as unknown as Observable<
            | {
                  customProfiles: { id: string; name: string }[]
                  selectedProfile: string
              }
            | HTTPError
        >
        this.children = [
            {
                class: 'd-flex justify-content-center align-items-center mr-2 ',
                style: {
                    width: '25px',
                },
                children: [
                    {
                        class: 'fas fa-cog fa-lg ',
                    },
                ],
            },
            {
                innerText: 'Edit active profile',
            },
        ]

        this.onclick = () => {
            popupModal(() =>
                child$(
                    getData$.pipe(
                        raiseHTTPErrors(),
                        map((jsonResp) =>
                            jsonResp.customProfiles
                                ? jsonResp
                                : {
                                      customProfiles: [],
                                      selectedProfile: 'default',
                                  },
                        ),
                    ),
                    () => new ProfilesView({ sessionInfo, state }),
                    {
                        untilFirst: {
                            class: 'fas fa-spinner fa-spin',
                        } as VirtualDOM,
                    },
                ),
            )
        }
    }
}
