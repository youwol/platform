import { Accounts } from '@youwol/http-clients'

type NavigateMethod =
    | 'logoutAndForgetUserUrl'
    | 'logoutUrl'
    | 'loginAsUserUrl'
    | 'loginAsTempUserUrl'

export const separatorView = {
    class: 'flex-grow-1 fv-border-top-primary mt-1 mb-1',
    style: { opacity: '0.5' },
}

export function redirectWith(method: NavigateMethod) {
    window.location.replace(new Accounts.Client()[method](window.location.href))
}
