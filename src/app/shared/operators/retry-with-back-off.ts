import { Observable, of, throwError } from 'rxjs';
import { retryWhen, mergeMap, delay } from 'rxjs/operators';

const getErrorMessage = (maxRetry: number) =>
    `Tried to load Resource over XHR for ${maxRetry} times without success. Giving up.`;

const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_BACKOFF = 1000;

export function retryWithBackoff<T>(delayMs: number, maxRetry = DEFAULT_MAX_RETRIES, backoffMs = DEFAULT_BACKOFF) {
    let retries = maxRetry;

    return (src: Observable<T>) =>
        src.pipe(
            retryWhen((errors: Observable<any>) => errors.pipe(
                mergeMap(error => {
                    if (error.status === 0) {
                        if (retries-- > 0) {
                            const backoffTime = delayMs + (maxRetry - retries) * backoffMs;
                            return of(error).pipe(delay(backoffTime));
                        }
                    } else if (error.status === 401) {
                        return throwError(error);
                    }
                    else if (error.status === 404) {
                        return throwError(error);
                    }
                    return throwError(error);
                })
            ))
        );
}