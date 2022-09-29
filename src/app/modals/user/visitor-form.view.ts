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
    private readonly _email$ = new BehaviorSubject<Email>('')

    /**
     * @group Observables
     */
    private readonly _triggerRegistration$ = new Subject<Email>()

    /**
     * @group Observables
     */
    private readonly _httpError$ = new Subject<HTTPError>()

    /**
     * @group Observables
     */
    public readonly httpError$ = this._httpError$.asObservable()

    /**
     * @group Observables
     */
    public readonly validEmail$: Observable<string | undefined>

    /**
     * @group Observables
     */
    public readonly done$: Observable<Empty>

    /**
     * @group Observables
     */
    public readonly pending$: Observable<boolean>

    constructor() {
        this._email$.subscribe(() => {
            this._httpError$.next()
        })

        this.validEmail$ = this._email$.pipe(
            map((email) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? email
                    : undefined
            }),
        )

        this.done$ = this._triggerRegistration$.pipe(
            mergeMap((email) =>
                new Accounts.Client().sendRegisterMail$({
                    email,
                    target_uri: window.location.href,
                }),
            ),
            dispatchHTTPErrors<Empty>(this._httpError$),
        )
        this.pending$ = merge(
            this._triggerRegistration$.pipe(mapTo('start')),
            this.done$.pipe(mapTo('OK')),
            this._httpError$.pipe(
                filter((e) => e != undefined),
                mapTo('KO'),
            ),
        ).pipe(map((value) => value == 'start'))
    }

    triggerRegistration() {
        this._triggerRegistration$.next(this._email$.getValue())
    }

    setEmail(email: Email) {
        this._email$.next(email)
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

    constructor(params: { class?: string } = {}) {
        super({ class: params.class })
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

/**
 * @category View
 */
class RegisterForm implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'w-100'
    /**
     * @group Immutable DOM Constants
     */
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

/**
 * @category View
 */
class EmailInputRow implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'w-100 d-flex align-items-center justify-content-around'
    /**
     * @group Immutable DOM Constants
     */
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

/**
 * @category View
 */
class RegisterButton implements VirtualDOM {
    static classButtonEnabled =
        'fv-pointer  fv-bg-secondary fv-hover-xx-lighter'
    static classButtonDisabled = 'fv-bg-disabled'

    /**
     * @group Immutable DOM Constants
     */
    public readonly class: Stream$<string, string>
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: 'fit-content',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly enable
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick
    /**
     * @group Immutable DOM Constants
     */
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
