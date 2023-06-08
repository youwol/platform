import { popupModal } from '../../modals'
import { Accounts, CdnSessionsStorage } from '@youwol/http-clients'
import { HTTPError, raiseHTTPErrors } from '@youwol/http-primitives'
import { ProfilesView } from '../../modals/profiles'
import { setup } from '../../../auto-generated'
import { child$, VirtualDOM } from '@youwol/flux-view'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @category View
 */
export class ProfilesBadgeView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'mt-2 p-1 fv-text-primary yw-text-primary  text-center fv-hover-bg-background-alt fv-pointer rounded d-flex align-items-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor(sessionInfo: Accounts.SessionDetails) {
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
                class: 'fas fa-cog  mx-3',
            },
            {
                innerText: 'Preference',
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
                    (profilesInfo) =>
                        new ProfilesView({ sessionInfo, profilesInfo }),
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
