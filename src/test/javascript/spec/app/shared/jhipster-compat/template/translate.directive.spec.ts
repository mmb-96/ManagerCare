import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Subject, throwError } from 'rxjs';
import { CompatibilitySubjectModule, JhiTranslateDirective, createConfig, TranslationDouble } from './compat-subject';

@Component({ template: `<span jhiTranslate="{{ 'health.status.' + status }}"></span><span jhiTranslate="global.ribbon.{{ environment }}"></span>` })
class DynamicTranslationHost {
  status = 'UP';
  environment = 'dev';
}

describe('Template translation compatibility', () => {
  let translation: TranslationDouble;
  let element: HTMLElement;
  let directive: JhiTranslateDirective;
  let config: ReturnType<typeof createConfig>;

  beforeEach(() => {
    translation = new TranslationDouble();
    config = createConfig();
    element = document.createElement('span');
    directive = new JhiTranslateDirective(config, new ElementRef(element), translation as unknown as TranslateService);
    directive.jhiTranslate = 'static.key';
  });

  afterEach(() => directive.ngOnDestroy());

  it('resolves a static key on changes', () => {
    directive.ngOnChanges();
    expect(translation.get).toHaveBeenCalledWith('static.key', undefined);
    expect(element.innerHTML).toBe('static.key');
  });

  it('passes interpolation values', () => {
    directive.translateValues = { name: 'Synthetic' };
    directive.ngOnChanges();
    expect(translation.get).toHaveBeenCalledWith('static.key', { name: 'Synthetic' });
  });

  it('replaces existing child markup with translated innerHTML', () => {
    element.innerHTML = '<a>old</a>';
    translation.render = () => '<strong>translated</strong>';
    directive.ngOnChanges();
    expect(element.innerHTML).toBe('<strong>translated</strong>');
  });

  it('refreshes on language changes after initialization', () => {
    directive.ngOnInit();
    translation.onLangChange.next();
    expect(translation.get).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes from language changes on destroy', () => {
    directive.ngOnInit();
    directive.ngOnDestroy();
    translation.onLangChange.next();
    expect(translation.get).not.toHaveBeenCalled();
  });

  it('unsubscribes from an outstanding translation on destroy', () => {
    const pending = new Subject<string>();
    jest.spyOn(translation, 'get').mockImplementation(() => pending);
    directive.ngOnChanges();
    directive.ngOnDestroy();
    pending.next('late');
    expect(element.innerHTML).toBe('');
  });

  it('does not subscribe or translate when i18n is disabled', () => {
    config.getConfig().i18nEnabled = false;
    element.innerHTML = 'fallback';
    directive.ngOnInit();
    directive.ngOnChanges();
    translation.onLangChange.next();
    expect(translation.get).not.toHaveBeenCalled();
    expect(element.innerHTML).toBe('fallback');
  });

  it('preserves DOM on the legacy error path instead of assigning the returned marker', () => {
    translation.get.mockReturnValue(throwError(new Error('synthetic translation error')));
    element.innerHTML = 'existing';
    directive.ngOnChanges();
    expect(element.innerHTML).toBe('existing');
  });

  it('resolves both Health and Ribbon interpolation forms and updates them', () => {
    TestBed.configureTestingModule({
      imports: [CompatibilitySubjectModule], declarations: [DynamicTranslationHost],
      providers: [{ provide: TranslateService, useValue: translation }]
    });
    const fixture = TestBed.createComponent(DynamicTranslationHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('health.status.UPglobal.ribbon.dev');
    fixture.componentInstance.status = 'DOWN';
    fixture.componentInstance.environment = 'prod';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('health.status.DOWNglobal.ribbon.prod');
    fixture.destroy();
  });
});
