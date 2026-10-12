import Spy = jasmine.Spy;
import { JhiEventManager } from 'app/shared/jhipster-compat/event-manager.service';

import { SpyObject } from './spyobject';

export class MockEventManager extends SpyObject {
  broadcastSpy: Spy;
  subscribeSpy: Spy;
  destroySpy: Spy;

  constructor() {
    super(JhiEventManager);
    this.broadcastSpy = this.spy('broadcast').andReturn(this);
    this.subscribeSpy = this.spy('subscribe').andReturn(null);
    this.destroySpy = this.spy('destroy').andReturn(null);
  }
}
