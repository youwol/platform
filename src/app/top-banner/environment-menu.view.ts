import { VirtualDOM } from '@youwol/flux-view'
import { TitleMenuView } from './utils.view'
import { EnvironmentTabsView } from './environment'

export class EnvironmentView implements VirtualDOM {
    public readonly style = {
        width: '75vw',
        height: '75vh',
    }
    public readonly children: VirtualDOM[]
    constructor() {
        this.children = [new EnvironmentSettingsView()]
    }
}

export class EnvironmentSettingsView implements VirtualDOM {
    public readonly class = 'position-relative h-100 d-flex flex-column'
    public readonly children: VirtualDOM[]

    constructor() {
        this.children = [
            new TitleMenuView({ title: 'Your environment' }),
            new EnvironmentTabsView(),
        ]
    }
}
