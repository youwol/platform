type AllTags = keyof HTMLElementTagNameMap
export type Configuration = {
    TypeCheck: 'strict'
    SupportedHTMLTags: 'Prod' extends 'Prod' ? AllTags : DevTags
    WithFluxView: false
}

type DevTags = 'div' | 'span' | 'i' | 'input' | 'button' | 'p' | 'a' | 'img'
