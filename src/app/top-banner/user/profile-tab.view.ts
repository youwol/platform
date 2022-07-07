import { EnvironmentTab, UserSettingsTabsState } from './settings-tabs'
import { VirtualDOM } from '@youwol/flux-view'

export class ProfileTab extends EnvironmentTab {
    constructor() {
        super({
            id: 'Profile',
            title: 'Profile',
            icon: 'fas fa-user',
            content: ({ tabsState }: { tabsState: UserSettingsTabsState }) => {
                return new ProfileView({
                    tabsState: tabsState,
                })
            },
        })
        Object.assign(this)
    }
}

export class ProfileView implements VirtualDOM {
    public readonly class = 'd-flex flex-column'
    public readonly style = {
        height: '100%',
    }
    public readonly children: VirtualDOM[]
    public readonly tabsState: UserSettingsTabsState

    constructor(params: { tabsState: UserSettingsTabsState }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'd-flex flex-column align-items-center px-4 py-2 my-3 justify-content-center fv-text-focus',
                style: {
                    fontSize: 'xx-large',
                },
                children: [
                    {
                        class: 'd-flex align-items-center',
                        children: [
                            {
                                class: 'px-2',
                                innerText:
                                    this.tabsState.sessionInfo.userInfo.name,
                            },
                            {
                                style: {
                                    fontSize: 'large',
                                },
                                class: 'fas fa-pen fv-pointer fv-hover-bg-background-alt p-1 rounded  fv-text-primary',
                            },
                        ],
                    },
                    {
                        class: 'd-flex align-items-center my-2',
                        children: [
                            {
                                class: 'fas fa-2x fa-user',
                            },
                            {
                                class: 'd-flex flex-column align-items-center fv-text-primary',
                                style: {
                                    fontSize: 'large',
                                },
                                children: [
                                    {
                                        class: 'fas fa-camera fv-pointer fv-hover-bg-background-alt p-1 rounded',
                                    },
                                    {
                                        class: 'fas fa-file-download fv-pointer fv-hover-bg-background-alt p-1 rounded',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                class: 'container w-50 mt-4',
                children: [
                    new TextFieldView({ label: 'Company', value: '' }),
                    new TextFieldView({ label: 'Fields', value: '' }),
                ],
            },
            {
                class: 'flex-grow-1',
            },
            {
                class: 'p-2 border rounded fv-pointer fv-bg-secondary fv-hover-xx-lighter mx-auto my-4',
                style: {
                    width: 'fit-content',
                },
                innerText: 'Edit information',
            },
        ]
    }
}

export class TextFieldView implements VirtualDOM {
    public readonly class = 'row my-1'
    public readonly children: VirtualDOM[]
    constructor({ label, value }) {
        this.children = [
            {
                class: 'col-sm',
                innerText: label,
            },
            {
                tag: 'input',
                type: 'text',
                class: 'col-sm',
                value,
            },
        ]
    }
}
