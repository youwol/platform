/**
 * @category View
 */
export class TitleMenuView {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class =
        'justify-content-center fv-text-focus fv-border-bottom-focus d-flex align-items-center w-100'
    /**
     * @group Immutable DOM Constants
     */
    public readonly style = {
        fontSize: 'x-large',
        fontWeight: 'bolder',
    }
    /**
     * @group Immutable DOM Constants
     */
    public readonly innerText: string

    constructor({ title }: { title: string }) {
        this.innerText = title
    }
}
