export class TitleMenuView {
    public readonly class =
        'justify-content-center fv-text-focus fv-border-bottom-focus d-flex align-items-center w-100'
    public readonly style = {
        fontSize: 'x-large',
        fontWeight: 'bolder',
    }
    public readonly innerText: string

    constructor({ title }: { title: string }) {
        this.innerText = title
    }
}
