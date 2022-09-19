import { popupModal } from '../../modals'
import {
    Accounts,
    CdnSessionsStorage,
    HTTPError,
    raiseHTTPErrors,
} from '@youwol/http-clients'
import { ProfilePickerView } from '../../modals/settings/profile-picker.view'
import { setup } from '../../../auto-generated'
import { child$, VirtualDOM } from '@youwol/flux-view'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class SettingsBadgeView {
    public readonly class =
        'fas fa-cogs rounded fv-pointer py-2 px-1 fv-hover-bg-background-alt h-100'
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
                        new ProfilePickerView({ sessionInfo, profilesInfo }),
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
