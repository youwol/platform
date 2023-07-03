import { child$, VirtualDOM } from '@youwol/flux-view'
import { Accounts, CdnSessionsStorage } from '@youwol/http-clients'
import { Modal } from '@youwol/fv-group'
import { RegisteredBadgeView, VisitorBadgeView } from '../badges'
import { ProfilesState } from '../../modals/profiles'
import { RegisteredFormView, VisitorFormView } from '../../modals/user'
import { HTTPError, raiseHTTPErrors } from '@youwol/http-primitives'
import { map } from 'rxjs/operators'
import { setup } from '../../../auto-generated'
import { Observable } from 'rxjs'

/**
 * @category View
 */
export class UserBadgeDropdownView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'dropdown '
    public readonly style = {
        height: '25px',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    /**
     * @group Immutable Constants
     */
    public readonly sessionInfo: Accounts.SessionDetails

    constructor(sessionInfo: Accounts.SessionDetails) {
        Object.assign(this, { sessionInfo })

        const modalState = new Modal.State()
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
        ProfilesState.getBootstrap$()

        this.children = [
            {
                tag: 'button',
                class: 'btn p-0  fv-font-size-regular fv-font-family-regular d-flex align-items-center  fv-text-primary yw-hover-text-primary dropdown-toggle yw-btn-no-focus-shadow',
                type: 'button',
                id: 'dropdownMenuButton',
                customAttributes: {
                    dataToggle: 'dropdown',
                    ariaHaspopup: 'true',
                },
                ariaExpanded: false,

                children: [
                    sessionInfo.userInfo.temp
                        ? new VisitorBadgeView()
                        : new RegisteredBadgeView(this.sessionInfo),
                ],
            },
            {
                class: 'dropdown-menu fv-bg-background yw-animate-in  yw-box-shadow  fv-font-size-regular fv-font-family-regular',
                style: {
                    background: '#070707',
                },
                onclick: (ev) => {
                    ev.stopPropagation()

                    console.log(ev.target)
                },
                customAttributes: {
                    ariaLabelledby: 'dropdownMenuButton',
                },
                children: [
                    this.sessionInfo.userInfo.temp
                        ? new VisitorFormView({ modalState })
                        : // : new RegisteredFormView(sessionInfo),
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
                              (profilesInfo) => {
                                  console.log('profile : ', profilesInfo)
                                  return new RegisteredFormView({
                                      sessionInfo,
                                      profilesInfo,
                                  })
                              },
                          ),
                ],
            },
        ]
    }
}
