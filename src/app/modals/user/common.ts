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

export function redirectWith(
    method: NavigateMethod,
    params?: Record<string, string>,
) {
    let url = window.location.href
    if (params) {
        const paramsString = Object.entries(params).map(
            ([key, value]) => `${key}=${value}`,
        )
        url += '?' + paramsString
    }
    if (!params) {
        url = url.split('?')[0]
    }
    window.location.replace(new Accounts.Client()[method](url))
}
