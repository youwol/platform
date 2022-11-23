import { VirtualDOM } from '@youwol/flux-view'
import { Accounts } from '@youwol/http-clients'

type NavigateMethod =
    | 'logoutAndForgetUserUrl'
    | 'logoutUrl'
    | 'loginAsUserUrl'
    | 'loginAsTempUserUrl'

export const separatorView = {
    class: 'flex-grow-1 fv-border-top-primary my-4',
    style: { opacity: '0.5' },
}

export class BaseUserFormView implements VirtualDOM {
    public readonly class =
        'fv-border-primary rounded p-3 fv-text-primary fv-bg-background'

    constructor(params: { class?: string } = {}) {
        params.class && Object.assign(this, params)
    }
}

export function redirectWith(method: NavigateMethod) {
    window.location.replace(new Accounts.Client()[method](window.location.href))
}
