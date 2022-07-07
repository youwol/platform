import { VirtualDOM } from '@youwol/flux-view'
import { EnvironmentTabsView } from './environment-tabs'
import { Accounts } from '@youwol/http-clients'

export class EnvironmentView implements VirtualDOM {
    public readonly style = {
        width: '75vw',
        height: '75vh',
    }
    public readonly children: VirtualDOM[]
    constructor({ sessionInfo }: { sessionInfo: Accounts.SessionDetails }) {
        this.children = [
            {
                class: 'position-relative h-100 d-flex flex-column',
                children: [new EnvironmentTabsView({ sessionInfo })],
            },
        ]
    }
}
