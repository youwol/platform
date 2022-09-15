import { SettingsView } from '../../modals/settings'
import { popupModal } from '../../modals'
import { Accounts } from '@youwol/http-clients'

export class SettingsBadgeView {
    public readonly class =
        'fas fa-cogs rounded fv-pointer py-2 px-1 fv-hover-bg-background-alt h-100'
    public readonly onclick: () => void

    constructor(sessionInfo: Accounts.SessionDetails) {
        this.onclick = () => {
            popupModal(
                () =>
                    new SettingsView({
                        sessionInfo,
                    }),
            )
        }
    }
}
