import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

import { JhiEventWithContent } from './event-with-content.model';

@Injectable({
  providedIn: 'root'
})
export class JhiEventManager {
  observable: Observable<JhiEventWithContent<any> | string>;
  observer!: Observer<JhiEventWithContent<any> | string>;

  constructor() {
    this.observable = Observable.create((observer: Observer<JhiEventWithContent<any> | string>) => {
      this.observer = observer;
    }).pipe(share());
  }

  broadcast(event: JhiEventWithContent<any> | string): void {
    if (this.observer) {
      this.observer.next(event);
    }
  }

  subscribe(eventName: string, callback: any): Subscription {
    return this.observable
      .pipe(
        filter((event: JhiEventWithContent<any> | string) => {
          if (typeof event === 'string') {
            return event === eventName;
          }
          return event.name === eventName;
        }),
        map((event: JhiEventWithContent<any> | string) => {
          if (typeof event !== 'string') {
            return event;
          }
          return undefined;
        })
      )
      .subscribe(callback);
  }

  destroy(subscriber: Subscription): void {
    subscriber.unsubscribe();
  }
}
