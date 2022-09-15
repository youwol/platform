import { attr$, child$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs'
import { filter, map, mapTo, mergeMap } from 'rxjs/operators'
import {
    Accounts,
    dispatchHTTPErrors,
    Empty,
    HTTPError,
} from '@youwol/http-clients'
import { BaseUserFormView, separatorView, redirectWith } from './common'

type Email = string

/**
 * @category State
 */
export class VisitorFormState {
    /**
     * @group Observables
     */
    public readonly email$ = new BehaviorSubject<Email>('')

    /**
     * @group Observables
     */
    public readonly triggerRegistration$ = new Subject<Email>()

    /**
     * @group Observables
     */
    public readonly httpError$ = new Subject<HTTPError>()

    public readonly validEmail$: Observable<string | undefined>

    public readonly done$: Observable<Empty>

    public readonly pending$: Observable<boolean>

    constructor() {
        this.email$.subscribe(() => {
            this.httpError$.next()
        })

        this.validEmail$ = this.email$.pipe(
            map((email) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? email
                    : undefined
            }),
        )

        this.done$ = this.triggerRegistration$.pipe(
            mergeMap((email) =>
                new Accounts.Client().sendRegisterMail$({
                    email,
                    target_uri: window.location.href,
                }),
            ),
            dispatchHTTPErrors<Empty>(this.httpError$),
        )
        this.pending$ = merge(
            this.triggerRegistration$.pipe(mapTo('start')),
            this.done$.pipe(mapTo('OK')),
            this.httpError$.pipe(
                filter((e) => e != undefined),
                mapTo('KO'),
            ),
        ).pipe(map((value) => value == 'start'))
    }

    triggerRegistration() {
        this.triggerRegistration$.next(this.email$.getValue())
    }

    setEmail(email: Email) {
        this.email$.next(email)
    }
}

/**
 * @category View
 */
export class VisitorFormView extends BaseUserFormView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    constructor() {
        super()
        const state = new VisitorFormState()

        this.children = [
            headerView,
            inviteSigninView,
            separatorView,
            inviteRegisteringView,
            new RegisterForm(state),
            separatorView,
            footerNoteView,
        ]
    }
}

class RegisterForm implements VirtualDOM {
    public readonly class = 'w-100'
    public readonly children: VirtualDOM[]

    constructor(state: VisitorFormState) {
        const message$ = merge(
            state.done$.pipe(
                mapTo('Registration done, please follow email instruction'),
            ),
            state.httpError$.pipe(
                map((e) => (e ? 'Error while submitting registration' : '')),
            ),
        )

        this.children = [
            {
                class: 'w-100 ',
                children: [
                    new EmailInputRow(state),
                    {
                        class: 'w-100 text-center',
                        innerText: attr$(message$, (v) => v),
                    },
                ],
            },
        ]
    }
}

class EmailInputRow implements VirtualDOM {
    public readonly class =
        'w-100 d-flex align-items-center justify-content-around'
    public readonly children: VirtualDOM[]

    constructor(state: VisitorFormState) {
        this.children = [
            {
                innerText: 'E-mail',
            },
            {
                tag: 'input',
                value: '',
                oninput: (event) => state.setEmail(event.target.value),
            },
            new RegisterButton(state),
        ]
    }
}

class RegisterButton implements VirtualDOM {
    static classButtonEnabled =
        'fv-pointer  fv-bg-secondary fv-hover-xx-lighter'
    static classButtonDisabled = 'fv-bg-disabled'

    public readonly class: Stream$<string, string>
    public readonly style = {
        width: 'fit-content',
    }
    public readonly enable
    public readonly onclick
    public readonly children: VirtualDOM[]

    constructor(state: VisitorFormState) {
        this.onclick = () => {
            state.triggerRegistration()
        }
        this.class = attr$(
            state.validEmail$,
            (v): string =>
                v
                    ? RegisterButton.classButtonEnabled
                    : RegisterButton.classButtonDisabled,
            {
                wrapper: (classes) =>
                    `${classes} p-2 border  rounded d-flex align-items-center`,
            },
        )
        this.children = [
            {
                innerText: 'Register',
                enable: attr$(state.validEmail$, (email) => email != undefined),
            },
            child$(state.pending$, (pending) =>
                pending ? { class: 'fas fa-spinner fa-spin' } : {},
            ),
        ]
    }
}

const headerView = {
    class: 'd-flex flex-column align-items-center px-4 py-2 justify-content-center',
    style: {
        fontSize: 'x-large',
    },
    children: [
        {
            class: 'd-flex align-items-center  fv-text-focus',
            children: [
                {
                    class: 'px-2',
                    innerText: 'Visitor',
                },
            ],
        },
        {
            class: 'd-flex align-items-center my-2',
            children: [
                {
                    class: 'd-flex align-items-center my-2',
                    children: [
                        {
                            class: 'fas fa-2x fa-user',
                        },
                    ],
                },
            ],
        },
    ],
}

const inviteSigninView = {
    class: 'd-flex align-items-center mx-auto rounded border fv-pointer fv-bg-background-alt fv-hover-xx-lighter p-2',
    style: {
        width: 'fit-content',
    },
    children: [
        {
            innerText: 'I have an account',
        },
        {
            class: 'fas fa-sign-in-alt fv-pointer p-1 rounded fv-hover-bg-background-alt',
        },
    ],
    onclick: () => {
        redirectWith('loginAsUserUrl')
    },
}

const inviteRegisteringView = {
    class: 'mx-auto text-justify px-4',
    tag: 'p',
    style: {
        maxWidth: '500px',
    },
    innerHTML: `
You are using YouWol as anonymous user, you can pretty much do anything...<br><br>

<b>However</b>: your session and related data will be <b>deleted</b> after a period of 24 hours.<br> 

You can register by providing your e-mail address below and follow email instructions.<br><br>
 Registering is free and minimal. <br><br>
`,
}

const footerNoteView = {
    class: 'mx-auto text-justify px-4',
    tag: 'p',
    style: {
        maxWidth: '500px',
    },
    innerHTML: `
If you like the project, even if you are not planning to use it for now, registering will help us find funds with our investors 🤫.
`,
}
