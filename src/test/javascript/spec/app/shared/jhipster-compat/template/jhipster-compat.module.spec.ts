import '@angular/localize/init';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ManagerCareSharedLibsModule } from 'app/shared/shared-libs.module';
import { JHI_COMPAT_CONFIG } from 'app/shared/jhipster-compat/config.service';
import { MANAGERCARE_CONFIG } from 'app/shared/jhipster-compat/config.model';
import { TranslationDouble } from './compat-subject';

@Component({
  template: `
    <p jhiTranslate="host.translation"></p>
    <table><tr jhiSort [(predicate)]="predicate" [(ascending)]="ascending" [callback]="sorted">
      <th jhiSortBy="name"><fa-icon [icon]="icon"></fa-icon></th>
    </tr></table>
    <jhi-item-count [page]="1" [total]="2" [itemsPerPage]="20"></jhi-item-count>
    <jhi-boolean [value]="true" textTrue="active"></jhi-boolean>
    <ul><li *ngFor="let entry of (dictionary | keys)">{{ entry.key }}={{ entry.value }}</li></ul>
    <ol><li *ngFor="let item of (items | pureFilter: 'alpha':'name' | orderBy: 'name')">{{ item.name }}</li></ol>
    <jhi-jvm-memory [jvmMemoryMetrics]="memory" [updating]="false"></jhi-jvm-memory>
  `
})
class LocalCompatibilityHost {
  predicate = 'name';
  ascending = true;
  icon = faSort;
  sorted = jest.fn();
  dictionary = { local: 'export' };
  items = [{ name: 'beta' }, { name: 'alpha' }];
  memory = { heap: { used: 52428800, max: 104857600, committed: 104857600 } };
}

describe('ManagerCareSharedLibsModule public compatibility exports', () => {
  it('compiles SharedLibs and renders a representative host without legacy providers', async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerCareSharedLibsModule],
      declarations: [LocalCompatibilityHost],
      providers: [
        { provide: JHI_COMPAT_CONFIG, useValue: MANAGERCARE_CONFIG },
        { provide: TranslateService, useValue: new TranslationDouble() }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(LocalCompatibilityHost);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('p')!.textContent).toBe('host.translation');
    expect(element.querySelector('jhi-item-count')!.textContent).toContain('global.item-count');
    expect(element.querySelector('jhi-boolean span')!.classList.contains('badge-success')).toBe(true);
    expect(element.querySelector('jhi-boolean')!.textContent).toBe('active');
    expect(element.querySelector('ul li')!.textContent).toBe('local=export');
    expect(element.querySelectorAll('ol li').length).toBe(1);
    expect(element.querySelector('ol li')!.textContent).toBe('alpha');
    expect(element.querySelector('jhi-jvm-memory')!.textContent).toContain('50%');
    element.querySelector('th')!.click();
    expect(fixture.componentInstance.sorted).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.ascending).toBe(false);
    expect(element.querySelector('svg')!.getAttribute('data-icon')).toBe('sort');
    fixture.destroy();
  });
});
