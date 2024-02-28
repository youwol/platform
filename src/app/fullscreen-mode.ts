import { BehaviorSubject, fromEvent } from 'rxjs'
import { filter } from 'rxjs/operators'

export const isFullscreen$ = new BehaviorSubject<boolean>(
    !!document.fullscreenElement,
)
function updateFullscreenState() {
    isFullscreen$.next(!!document.fullscreenElement)
}
export function toggleFullscreenMode() {
    const doc = document
    const elem = doc.documentElement
    if (!isFullscreen$.getValue()) {
        elem.requestFullscreen()
    } else {
        doc.exitFullscreen()
    }
}

fromEvent(document, 'fullscreenchange').subscribe(() => updateFullscreenState())
fromEvent<KeyboardEvent>(document, 'keydown')
    .pipe(filter((ev) => ev.key.toLowerCase() === 'f11'))
    .subscribe((ev) => {
        ev.preventDefault()
        toggleFullscreenMode()
    })
