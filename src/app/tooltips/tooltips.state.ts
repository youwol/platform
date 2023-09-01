import { BehaviorSubject } from 'rxjs'

interface TooltipInterface {
    'show-tooltip': boolean
    'tooltip-elements': string[]
}

export class TooltipsState {
    /**
     * @group Observables
     */
    public readonly isTooltip$ = new BehaviorSubject<boolean>(
        this.getYouwolTooltipConfig()
            ? this.getYouwolTooltipConfig()['show-tooltip']
            : true,
    )
    /**
     * @group Observables
     */
    public readonly dataSteps$ = new BehaviorSubject<string[]>([])

    constructor() {
        this.initTooltip()
    }

    private initTooltip() {
        const config = this.getYouwolTooltipConfig() || {
            'show-tooltip': this.isTooltip$.value,
            'tooltip-elements': [],
        }
        const showTooltip = this.getShowTooltip(config)
        if (showTooltip !== this.isTooltip$.value) {
            this.isTooltip$.next(showTooltip)
        }
        this.dataSteps$.next(config['tooltip-elements'])
    }

    private getYouwolTooltipConfig(): TooltipInterface | null {
        const configJson = localStorage.getItem('tooltip-config')
        return configJson ? JSON.parse(configJson) : null
    }

    private setYouwolTooltipConfig(config: TooltipInterface): void {
        localStorage.setItem('tooltip-config', JSON.stringify(config))
    }

    private getShowTooltip(config: TooltipInterface): boolean {
        return config['show-tooltip'] ?? this.isTooltip$.value
    }

    public appendTooltipElements(element: string) {
        if (!this.dataSteps$.value.includes(element)) {
            const elements = [...this.dataSteps$.value, element]
            this.dataSteps$.next(elements)
            this.updateTooltipConfig(elements)
        }
    }

    public removeTooltipElements(element: string) {
        const elements = this.dataSteps$.value.filter((el) => el !== element)
        this.dataSteps$.next(elements)
        this.updateTooltipConfig(elements)
    }

    private updateTooltipConfig(elements: string[]) {
        const config: TooltipInterface = {
            'show-tooltip': elements.length > 0,
            'tooltip-elements': elements,
        }
        this.setYouwolTooltipConfig(config)
        this.isTooltip$.next(elements.length > 0)
    }
}
