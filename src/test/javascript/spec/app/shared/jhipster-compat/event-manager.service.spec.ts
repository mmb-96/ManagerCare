import { JhiEventManager } from 'app/shared/jhipster-compat/event-manager.service';
import { JhiEventWithContent } from 'app/shared/jhipster-compat/event-with-content.model';

describe('JhiEventManager local compatibility', () => {
  let eventManager: JhiEventManager;

  beforeEach(() => {
    eventManager = new JhiEventManager();
  });

  it('routes a matching string event synchronously and preserves its undefined callback value', () => {
    let callbackValue: string | undefined = 'not-called';
    const subscription = eventManager.subscribe('entityListModification', (value: undefined) => (callbackValue = value));

    eventManager.broadcast('entityListModification');

    expect(callbackValue).toBeUndefined();
    eventManager.destroy(subscription);
  });

  it('routes a matching event-with-content without unwrapping the payload', () => {
    const event = new JhiEventWithContent('managerCareApp.httpError', { status: 500 });
    let received: JhiEventWithContent<{ status: number }> | undefined;
    const subscription = eventManager.subscribe(
      'managerCareApp.httpError',
      (value: JhiEventWithContent<{ status: number }>) => (received = value)
    );

    eventManager.broadcast(event);

    expect(received).toBe(event);
    expect(received!.content).toEqual({ status: 500 });
    eventManager.destroy(subscription);
  });

  it('does not route an event to a different event name', () => {
    const callback = jasmine.createSpy('callback');
    const subscription = eventManager.subscribe('categoriaListModification', callback);

    eventManager.broadcast('tipoListModification');

    expect(callback).not.toHaveBeenCalled();
    eventManager.destroy(subscription);
  });

  it('notifies every active subscriber for the same event name', () => {
    const firstCallback = jasmine.createSpy('firstCallback');
    const secondCallback = jasmine.createSpy('secondCallback');
    const firstSubscription = eventManager.subscribe('userListModification', firstCallback);
    const secondSubscription = eventManager.subscribe('userListModification', secondCallback);

    eventManager.broadcast('userListModification');

    expect(firstCallback).toHaveBeenCalledTimes(1);
    expect(secondCallback).toHaveBeenCalledTimes(1);
    eventManager.destroy(firstSubscription);
    eventManager.destroy(secondSubscription);
  });

  it('stops routing after destroy', () => {
    const callback = jasmine.createSpy('callback');
    const subscription = eventManager.subscribe('objetivoListModification', callback);

    eventManager.destroy(subscription);
    eventManager.broadcast('objetivoListModification');

    expect(callback).not.toHaveBeenCalled();
  });
});
