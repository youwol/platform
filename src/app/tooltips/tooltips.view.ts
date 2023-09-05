import { VirtualDOM } from '@youwol/flux-view'
import { TooltipsState } from './tooltips.state'

export class TooltipsView {
    public readonly class
    public readonly id
    public readonly style
    public readonly children: VirtualDOM[]

    constructor({
        tooltipPlace: { top, right },
        tooltipArrow: { arrowLength, leftRightMove, arrowWidth = 0 },
        divId,
        tooltipText,
    }: {
        tooltipPlace: { top: number; right: number }
        tooltipArrow: {
            arrowLength: number
            leftRightMove: number
            arrowWidth: number
        }
        divId: string
        tooltipText: string
    }) {
        const _tooltipState = new TooltipsState()
        _tooltipState.isTooltip$.value
            ? _tooltipState.appendTooltipElements(divId)
            : ''

        this.children = [
            {
                class: ' d-flex justify-content-center align-items-center ',
                style: {
                    position: 'relative',
                    width: '150px',
                    height: '80px',
                },
                children: [
                    new ToolTipLinkView({
                        arrowLength: arrowLength,
                        leftRightMove: leftRightMove,
                        arrowWidth: arrowWidth,
                    }),

                    {
                        class: ' yw-bg-yellowish rounded p-2 pt-4 yw-bottom-box-shadow yw-animate-in',
                        style: {
                            position: 'absolute',
                            // top: '0rem',
                            // left: '0rem',
                            textAlignLast: 'center',
                            textAlign: 'center',
                            minWidth: '10rem',
                            // width: 'fit-content',
                        },
                        innerText: tooltipText,
                        children: [new CloseTooltipView(divId)],
                    },
                ],
            },
        ]
        this.class = _tooltipState.isTooltip$.value
            ? 'text-dark fv-hover-bg-background-trans'
            : 'd-none'
        this.id = divId
        this.style = {
            cursor: 'default',
            position: 'absolute',
            top: `${top ? top : 3}rem`,
            right: `${right ? right : 2}rem`,
        }
    }
}

export class ToolTipLinkView implements VirtualDOM {
    public readonly class = 'yw-bg-yellowish'
    public readonly style

    constructor({
        arrowLength,
        leftRightMove,
        arrowWidth = 0,
    }: {
        arrowLength: number
        leftRightMove: number
        arrowWidth: number
    }) {
        this.style = {
            position: 'absolute',
            width: `${arrowLength ? arrowLength + 100 : 130}%`,
            height: `${arrowLength ? arrowLength + 100 : 130}%`,
            clipPath: `polygon(${leftRightMove ? leftRightMove : 70}% 0, ${
                30 + arrowWidth
            }% 50%, ${70 - arrowWidth}% 50%)`,
        }
    }
}

export class CloseTooltipView implements VirtualDOM {
    public readonly tag = 'span'
    public readonly class = 'fas fa-times yw-text-orange'
    public readonly style = {
        height: '15px',
        width: '15px',
        zIndex: '1',
        position: 'absolute',
        top: '5%',
        right: '5%',
        cursor: 'pointer',
    }
    public readonly children: VirtualDOM[]
    public readonly onclick

    constructor(divId: string) {
        this.onclick = () => {
            const tooltipState = new TooltipsState()
            tooltipState.removeTooltipElements(divId)
            document.getElementById(divId).remove()
        }
    }
}