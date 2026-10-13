import Spy = jasmine.Spy;
import { JhiLanguageService } from 'app/shared/jhipster-compat/language.service';

import { SpyObject } from './spyobject';

export class MockLanguageService extends SpyObject {
  getCurrentLanguageSpy: Spy;
  changeLanguageSpy: Spy;

  constructor() {
    super(JhiLanguageService);

    this.getCurrentLanguageSpy = this.spy('getCurrentLanguage').andReturn('es');
    this.changeLanguageSpy = this.spy('changeLanguage');
  }
}
