import '@angular/localize/init';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, of } from 'rxjs';
import { JhiConfigService, JHI_COMPAT_CONFIG } from 'app/shared/jhipster-compat/config.service';
import { ManagerCareJhipsterCompatModule } from 'app/shared/jhipster-compat/template/jhipster-compat.module';
import { MANAGERCARE_CONFIG } from 'app/shared/jhipster-compat/config.model';

export { JhiConfigService } from 'app/shared/jhipster-compat/config.service';
export { JhiSortDirective } from 'app/shared/jhipster-compat/template/sort.directive';
export { JhiSortByDirective } from 'app/shared/jhipster-compat/template/sort-by.directive';
export { JhiTranslateDirective } from 'app/shared/jhipster-compat/template/translate.directive';
export { JhiItemCountComponent } from 'app/shared/jhipster-compat/template/item-count.component';
export { JhiBooleanComponent } from 'app/shared/jhipster-compat/template/boolean.component';
export { JhiJvmMemoryComponent } from 'app/shared/jhipster-compat/template/jvm-memory.component';
export { JhiJvmThreadsComponent } from 'app/shared/jhipster-compat/template/jvm-threads.component';
export { JhiMetricsHttpRequestComponent } from 'app/shared/jhipster-compat/template/metrics-request.component';
export { JhiMetricsEndpointsRequestsComponent } from 'app/shared/jhipster-compat/template/metrics-endpoints-requests.component';
export { JhiMetricsCacheComponent } from 'app/shared/jhipster-compat/template/metrics-cache.component';
export { JhiMetricsDatasourceComponent } from 'app/shared/jhipster-compat/template/metrics-datasource.component';
export { JhiMetricsSystemComponent } from 'app/shared/jhipster-compat/template/metrics-system.component';
export { JhiMetricsGarbageCollectorComponent } from 'app/shared/jhipster-compat/template/metrics-garbagecollector.component';
export { JhiThreadModalComponent } from 'app/shared/jhipster-compat/template/thread-modal.component';
export { JhiKeysPipe } from 'app/shared/jhipster-compat/template/keys.pipe';
export { JhiOrderByPipe } from 'app/shared/jhipster-compat/template/order-by.pipe';
export { JhiPureFilterPipe } from 'app/shared/jhipster-compat/template/pure-filter.pipe';

export function createConfig(): JhiConfigService {
  return new JhiConfigService(MANAGERCARE_CONFIG);
}

export class TranslationDouble {
  onLangChange = new Subject<void>();
  render = (key: string, values?: object): string => key + (values ? ':' + JSON.stringify(values) : '');
  get = jest.fn((key: string, values?: object) => of(this.render(key, values)));
}

@NgModule({
  imports: [ManagerCareJhipsterCompatModule, CommonModule, FormsModule, NgbModule, FontAwesomeModule],
  exports: [ManagerCareJhipsterCompatModule, CommonModule, FormsModule, NgbModule, FontAwesomeModule],
  providers: [{ provide: JHI_COMPAT_CONFIG, useValue: MANAGERCARE_CONFIG }]
})
export class CompatibilitySubjectModule {}
