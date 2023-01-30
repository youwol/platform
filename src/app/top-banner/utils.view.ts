import { AssetsGateway } from '@youwol/http-clients'
import { raiseHTTPErrors } from '@youwol/http-primitives'
import { shareReplay } from 'rxjs/operators'

export const sessionDetails$ = new AssetsGateway.Client().accounts
    .getSessionDetails$()
    .pipe(raiseHTTPErrors(), shareReplay({ bufferSize: 1, refCount: true }))
