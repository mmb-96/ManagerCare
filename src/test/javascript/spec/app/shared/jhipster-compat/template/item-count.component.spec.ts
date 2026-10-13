import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CompatibilitySubjectModule, JhiConfigService, JhiItemCountComponent, createConfig, TranslationDouble } from './compat-subject';

describe('Item count template compatibility', () => {
  [
    { page: 1, total: 65, size: 20, expected: { first: 1, second: 20, total: 65 } },
    { page: 2, total: 65, size: 20, expected: { first: 21, second: 40, total: 65 } },
    { page: 4, total: 65, size: 20, expected: { first: 61, second: 65, total: 65 } },
    { page: 1, total: 0, size: 10, expected: { first: 1, second: 0, total: 0 } }
  ].forEach(row => it('preserves page arithmetic for page ' + row.page + ', total ' + row.total, () => {
    const component = new JhiItemCountComponent(createConfig());
    component.page = row.page; component.total = row.total; component.itemsPerPage = row.size;
    expect(component.i18nValues()).toEqual(row.expected);
  }));

  function setup(enabled: boolean): { component: JhiItemCountComponent; element: HTMLElement; translation: TranslationDouble } {
    const translation = new TranslationDouble();
    const config = createConfig(); config.getConfig().i18nEnabled = enabled;
    TestBed.configureTestingModule({ imports: [CompatibilitySubjectModule], providers: [
      { provide: JhiConfigService, useValue: config }, { provide: TranslateService, useValue: translation }
    ] });
    const fixture = TestBed.createComponent(JhiItemCountComponent);
    fixture.componentInstance.page = 1; fixture.componentInstance.total = 0; fixture.componentInstance.itemsPerPage = 20;
    fixture.detectChanges();
    return { component: fixture.componentInstance, element: fixture.nativeElement, translation };
  }

  it('renders the translated key with the original interpolation values', () => {
    const result = setup(true);
    expect(result.translation.get).toHaveBeenCalledWith('global.item-count', { first: 1, second: 0, total: 0 });
    expect(result.element.textContent).toContain('global.item-count');
  });

  it('preserves the non-i18n fallback and captures enabled state at construction', () => {
    const result = setup(false);
    expect(result.element.textContent!.replace(/\s+/g, ' ')).toContain('Showing 1 - 0 of 0 items.');
    expect(result.translation.get).not.toHaveBeenCalled();
    expect(result.component.i18nEnabled).toBe(false);
  });
});
