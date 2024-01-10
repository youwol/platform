import { AttributeLike, ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs'
import { filter, map, mapTo, mergeMap, tap } from 'rxjs/operators'
import { Accounts } from '@youwol/http-clients'
import { dispatchHTTPErrors, Empty, HTTPError } from '@youwol/http-primitives'
import { separatorView, redirectWith } from './common'
import { Modal } from '@youwol/rx-group-views'

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
    /**
     * @group Observables
     */
    private readonly pendingHandler$ = new BehaviorSubject<string>('')

    constructor(params: { modalState: Modal.State }) {
        Object.assign(this, params)
        this._email$.subscribe(() => {
            this._httpError$.next(undefined)
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
            tap(() => this.pendingHandler$.next('OK')),
        )
        this.pending$ = merge(
            this._triggerRegistration$.pipe(mapTo('start')),
            this.pendingHandler$.pipe(mapTo('end')),
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
export class VisitorFormView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'dropdown-item yw-bg-dark fv-hover-bg-background-alt  w-100 fv-hover-text-primary p-3 fv-text-primary  bg-transparent fv-hover-bg-background '
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(params: { modalState: Modal.State; class?: string }) {
        const state = new VisitorFormState({ modalState: params.modalState })

        this.children = [
            headerView,
            inviteRegisteringView0,
            separatorView,
            inviteRegisteringView1,
            new RegisterForm(state),
            separatorView,
            new InviteLoginView(),
        ]
    }
}

/**
 * @category View
 */
class RegisterForm implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(state: VisitorFormState) {
        const message$ = merge(
            state.done$.pipe(
                map((registerStatus) =>
                    registerStatus.status === 409
                        ? registerStatus.body['errorMessage']
                        : 'Registration done, please follow email instruction',
                ),
            ),
            state.httpError$.pipe(
                map((e) => {
                    e ? 'Error while submitting registration' : ''
                }),
            ),
        )

        this.children = [
            new EmailInputRow(state),
            {
                tag: 'div',
                class: 'w-100 text-center',
                innerText: {
                    source$: message$,
                    vdomMap: (v: string | void) => (v ? v : ''),
                },
            },
        ]
    }
}

/**
 * @category View
 */
class EmailInputRow implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'w-100 d-flex flex-column align-items-center justify-content-around'
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(state: VisitorFormState) {
        this.children = [
            {
                tag: 'div',
                class: 'd-flex w-100',
                children: [
                    {
                        tag: 'div',
                        innerText: 'E-mail',
                    },
                    {
                        class: 'w-100 mx-3',
                        tag: 'input',
                        value: '',
                        placeholder: 'ex: example@domain.com',
                        oninput: (event) =>
                            state.setEmail(event.target['value']),
                    },
                ],
            },

            new RegisterButton(state),
        ]
    }
}

/**
 * @category View
 */
class RegisterButton implements VirtualDOM<'span'> {
    /**
     * @group Immutable DOM Constants
     */
    static classButtonEnabled =
        'fv-pointer fv-text-primary yw-bg-btn-yellow  yw-hover-bg-btn-orange'
    /**
     * @group Immutable DOM Constants
     */
    static classButtonDisabled = 'yw-border-orange yw-text-orange'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: AttributeLike<string>
    /**
     * @group Immutable DOM Constants
     */
    public readonly style
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'span'

    /**
     * @group Immutable DOM Constants
     */
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick
    /**
     * @group Immutable DOM Constants
     */
    public readonly customAttributes
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor(state: VisitorFormState) {
        this.onclick = () => {
            state.triggerRegistration()
        }
        this.class = {
            source$: state.validEmail$,
            vdomMap: (v): string =>
                v
                    ? RegisterButton.classButtonEnabled
                    : RegisterButton.classButtonDisabled,

            wrapper: (classes) =>
                `${classes} p-2 w-100 justify-content-center mt-2  rounded d-flex align-items-center `,
        }
        this.children = [
            {
                tag: 'div',
                innerText: 'Register',
            },
            {
                source$: state.pending$,
                vdomMap: (pending) =>
                    pending
                        ? { tag: 'div', class: 'fas fa-spinner fa-spin' }
                        : { tag: 'div' },
            },
        ]
        this.style = {
            source$: state.validEmail$,
            vdomMap: (email) =>
                email != undefined
                    ? { pointerEvents: 'auto' }
                    : {
                          pointerEvents: 'none',
                      },
        }

        this.customAttributes = {
            dataBSToggle: 'tooltip',
            dataBSPlacement: 'right',
            title: 'Click to process your registration.',
        }
    }
}

const headerView: VirtualDOM<'div'> = {
    tag: 'div',
    class: 'd-flex  align-items-center  ',
    style: {
        width: '30vh',
    },
    children: [
        {
            tag: 'div',
            class: 'fas fa-user-circle fa-lg ',
        },
        {
            tag: 'div',
            class: 'ms-2',
            innerText: 'Visitor',
        },
    ],
}

/**
 * @category View
 */
export class InviteButtonView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'd-flex align-items-center justify-content-center w-100 fv-pointer yw-border-none fv-text-primary yw-bg-btn-yellow yw-hover-bg-btn-orange rounded  p-2 m-1'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        width: 'fit-content',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike
    /**
     * @group Immutable DOM Constants
     */
    public readonly onclick: () => void

    constructor(params: { title: string; onclick: () => void }) {
        Object.assign(this, params)
        this.children = [
            {
                tag: 'div',
                class: 'fas fa-sign-in-alt fa-lg fv-pointer  rounded  me-2',
            },
            {
                tag: 'div',
                innerText: params.title,
            },
        ]
        this.onclick = params.onclick
    }
}

/**
 * @category View
 */
export class InviteLoginView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    /**
     * @group Immutable DOM Constants
     */
    public readonly class = 'd-flex flex-column '
    /**
     * @group Immutable DOM Constants
     */
    public readonly children: ChildrenLike

    constructor() {
        this.children = [
            {
                tag: 'div',
                class: 'font-weight-bold mt-3',
                innerText: 'You already have an account !',
            },
            new InviteButtonView({
                title: 'Login',
                onclick: () => redirectWith('loginAsUserUrl'),
            }),
        ]
    }
}

const inviteRegisteringView0: VirtualDOM<'p'> = {
    class: 'mx-auto text-justify px-2 text-wrap',
    tag: 'p',
    innerHTML: `
<br>You are using YouWol Platform as an anonymous user and you can almost do anything.<br><br>

However, your session and related data will be deleted after a period of 24 hours.<br>`,
}

const inviteRegisteringView1: VirtualDOM<'p'> = {
    class: 'mx-auto text-justify px-2 text-wrap',
    tag: 'p',
    children: [
        {
            tag: 'div',
            class: 'font-weight-bold',
            innerHTML: `<br>You need an account ?`,
        },
        {
            tag: 'div',
            innerHTML: `

<br>You can keep your session and related data by registering. 
Just provide your email address and follow the emailed instructions. It is free but limited.<br><br>
`,
        },
    ],
}
