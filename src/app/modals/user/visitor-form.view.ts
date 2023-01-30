import { attr$, child$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs'
import { filter, map, mapTo, mergeMap } from 'rxjs/operators'
import { Accounts } from '@youwol/http-clients'
import { dispatchHTTPErrors, Empty, HTTPError } from '@youwol/http-primitives'
import { BaseUserFormView, separatorView, redirectWith } from './common'
import { Modal } from '@youwol/fv-group'

type Email = string

/**
 * @category State
 */
export class VisitorFormState {
    /**
     * @group States
     */
    public readonly modalState: Modal.State

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

    constructor(params: { modalState: Modal.State }) {
        Object.assign(this, params)
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

    constructor(params: { modalState: Modal.State; class?: string }) {
        super({ class: params.class })
        const state = new VisitorFormState({ modalState: params.modalState })

        this.children = [
            headerView,
            new InviteLoginView({ visitorFormState: state }),
            separatorView,
            inviteRegisteringView0,
            separatorView,
            inviteRegisteringView1,
            new RegisterForm(state),
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

/**
 * @category View
 */
export class InviteButtonView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex align-items-center mx-auto rounded border fv-pointer fv-bg-background-alt fv-hover-xx-lighter p-2'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: 'fit-content',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor(params: { title: string; onclick: () => void }) {
        Object.assign(this, params)
        this.children = [
            {
                innerText: params.title,
            },
            {
                class: 'fas fa-sign-in-alt fv-pointer p-1 rounded fv-hover-bg-background-alt',
            },
        ]
        this.onclick = params.onclick
    }
}

/**
 * @category View
 */
export class InviteLoginView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex justify-content-center'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children = []

    constructor(params: { visitorFormState: VisitorFormState }) {
        this.children = [
            new InviteButtonView({
                title: 'I have an account',
                onclick: () => redirectWith('loginAsUserUrl'),
            }),
            new InviteButtonView({
                title: 'Continue as visitor',
                onclick: () => params.visitorFormState.modalState.ok$.next(),
            }),
        ]
    }
}

const inviteRegisteringView0 = {
    class: 'mx-auto text-justify px-4',
    tag: 'p',
    style: {
        maxWidth: '500px',
    },
    innerHTML: `
You are using YouWol as anonymous user, and you can almost do anything.<br><br>

However, your session and related data will be deleted after a period of 24 hours.<br>`,
}

const inviteRegisteringView1 = {
    class: 'mx-auto text-justify px-4',
    tag: 'p',
    style: {
        maxWidth: '500px',
    },
    innerHTML: `
You can keep your session and related data by registering.
Just provide your email address and follow the emailed instructions. It is free and minimal.<br><br>
`,
}
