import { CSSAttribute, ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { TooltipsState } from './tooltips.state'

export class TooltipsView implements VirtualDOM<'div'> {
    /**
     * @group Immutable DOM Constants
     */
    public readonly tag = 'div'
    public readonly class: string
    public readonly id: string
    public readonly style: CSSAttribute
    public readonly children: ChildrenLike

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
        const tooltipState = new TooltipsState()
        this.children = [
            {
                tag: 'div',
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
                        tag: 'div',
                        class: ' yw-bg-yellowish rounded p-2 pt-4 yw-bottom-box-shadow yw-animate-in',
                        style: {
                            position: 'absolute',
                            textAlignLast: 'center',
                            textAlign: 'center',
                            minWidth: '10rem',
                        },
                        innerText: tooltipText,
                        children: [new CloseTooltipView(divId, tooltipState)],
                    },
                ],
            },
        ]
        this.class = tooltipState.isTooltip$.value
            ? 'text-dark fv-hover-bg-background-trans'
            : 'd-none'
        this.id = divId
        this.style = {
            cursor: 'default',
            zIndex: 1,
            position: 'absolute',
            top: `${top ?? 3}rem`,
            right: `${right ?? 2}rem`,
        }
    }
}

export class ToolTipLinkView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly class = 'yw-bg-yellowish'
    public readonly style: CSSAttribute

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
            clipPath: `polygon(${leftRightMove ?? 70}% 0, ${
                30 + arrowWidth
            }% 50%, ${70 - arrowWidth}% 50%)`,
        }
    }
}

export class CloseTooltipView implements VirtualDOM<'span'> {
    public readonly tag = 'span'
    public readonly class = 'fas fa-times yw-text-orange'
    public readonly style = {
        height: '15px',
        width: '15px',
        zIndex: 1,
        position: 'absolute' as const,
        top: '5%',
        right: '5%',
        cursor: 'pointer',
    }
    public readonly children: ChildrenLike
    public readonly onclick: () => void

    constructor(divId: string, state: TooltipsState) {
        this.onclick = () => {
            // Hot fix
            state.dataSteps$.next([])
            state.removeTooltipElements(divId)
            document.getElementById(divId).remove()
        }
    }
}
