import { attr$, VirtualDOM } from '@youwol/flux-view'
import { Accounts, onHTTPErrors } from '@youwol/http-clients'
import { BehaviorSubject, Subject } from 'rxjs'
import { redirectWith, UserSettingsTabBase } from './common'
import { UserSettingsTabsState } from './settings-tabs'


export class ProfileTab extends UserSettingsTabBase {
    constructor() {
        super({
            id: 'Profile',
            title: 'Profile',
            icon: 'fas fa-user',
            content: ({ tabsState }: { tabsState: UserSettingsTabsState }) => {
                return tabsState.sessionInfo.userInfo.temp
                    ? new VisitorProfileView({ tabsState: tabsState })
                    : new RegisteredProfileView({ tabsState: tabsState })
            },
        })
        Object.assign(this)
    }
}

export class BaseProfileView implements VirtualDOM {
    public readonly class = 'd-flex flex-column'
    public readonly style = {
        height: '100%',
    }
    public readonly tabsState: UserSettingsTabsState

    constructor(params: { tabsState: UserSettingsTabsState }) {
        Object.assign(this, params)
    }
}

export class RegisteredProfileView extends BaseProfileView {
    public readonly children: VirtualDOM[]

    constructor(params: { tabsState: UserSettingsTabsState }) {
        super(params)
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

type SendingRegistrationEmail = 'done' | 'enable' | 'disable' | 'processing'

export class VisitorProfileView extends BaseProfileView {
    public readonly children: VirtualDOM[]

    constructor(params: { tabsState: UserSettingsTabsState }) {
        super(params)
        const validationsMessage$ = new Subject<string>()
        const emailTextFieldView = new TextFieldView({
            label: 'E-mail:',
            value: '',
        })
        const sendingRegistrationEmail$ = new Subject<SendingRegistrationEmail>()
        emailTextFieldView.value$.subscribe((email) => {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                sendingRegistrationEmail$.next('enable')
                validationsMessage$.next(`send registration email to ${email}`)
            } else {
                sendingRegistrationEmail$.next('disable')
                validationsMessage$.next('email address invalid')
            }
        })
        const classButtonEnabled = 'p-2 border  rounded  fv-pointer  fv-bg-secondary fv-hover-xx-lighter mx-auto my-4'
        const classButtonDisabled = 'p-2 border  rounded  fv-bg-disabled mx-auto my-4'
        this.children = [
            {
                class: 'd-flex flex-column align-items-center px-4 py-2 my-3 justify-content-center fv-text-focus',
                style: {
                    fontSize: 'xx-large',
                },
                children: [
                    {
                        class: 'd-flex align-items-center my-2',
                        children: [
                            {
                                class: 'fas fa-2x fa-user-secret',
                            },
                        ],
                    },
                ],
            },
            {
                class: 'mx-auto w-50 text-justify',
                tag: 'p',
                innerHTML: `
You are using YouWol as anonymous user, you can pretty much do anything...<br><br>

<b>However</b>: your session and related data will be <b>deleted</b> after a period of 24 hours.<br> 

You can register by providing your e-mail address below and follow email instructions.
 Registering is free and minimal. <br><br>

If you like the project, even if you are not planning to use it for now, registering will help us find funds with our investors 🤫.
`,
            },
            {
                class: 'container w-50 mt-4',
                children: [emailTextFieldView],
            },
            {
                class: 'mx-auto w-50 text-center',
                innerText: attr$(validationsMessage$, (v) => v)
            },
            {
                class: attr$(sendingRegistrationEmail$,
                    (v) =>
                        v === 'enable'
                            ? classButtonEnabled
                            : classButtonDisabled,
                    { untilFirst: classButtonDisabled }),
                style: {
                    width: 'fit-content',
                },
                innerText: 'Register',
                enable: attr$(sendingRegistrationEmail$, (v) => v === 'enable'),
                onclick: () => {
                    sendingRegistrationEmail$.next('processing')
                    validationsMessage$.next('validating registration')
                    new Accounts.Client().sendRegisterMail$({
                        email: emailTextFieldView.value$.value,
                        target_uri: window.location.href,
                    }).pipe(onHTTPErrors((error) => {
                        return error.body['message']
                    })).subscribe((value) => {
                        if (typeof value !== 'string') {
                            sendingRegistrationEmail$.next('done')
                            validationsMessage$.next('follow email instruction to finalize registration')
                        } else {
                            sendingRegistrationEmail$.next('disable')
                            validationsMessage$.next(`failed to register : ${value}`)
                        }
                    })
                },
            },
            {
                class: 'mx-auto w-50 text-center',
                tag: 'p',
                innerHTML: `If somehow you ended up here, but you already have an account:`,
            },
            {
                class: 'p-2 border rounded fv-pointer fv-bg-secondary fv-hover-xx-lighter mx-auto my-4',
                style: {
                    width: 'fit-content',
                },
                innerText: 'Sign-in',
                onclick: () => redirectWith('loginAsUserUrl'),
            },
        ]
    }
}


export class TextFieldView implements VirtualDOM {
    public readonly class = 'row my-1'
    public readonly children: VirtualDOM[]
    public readonly value$: BehaviorSubject<string>

    constructor({ label, value }) {
        this.value$ = new BehaviorSubject<string>(value)
        this.children = [
            {
                class: 'col-2',
                innerText: label,
            },
            {
                tag: 'input',
                type: 'text',
                class: 'col-6',
                value: value,
                oninput: (event) => this.value$.next(event.target.value),
            },
        ]
    }
}
