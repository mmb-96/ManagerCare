import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JhiSortDirective } from './sort.directive';
import { JhiSortByDirective } from './sort-by.directive';
import { JhiTranslateDirective } from './translate.directive';
import { JhiItemCountComponent } from './item-count.component';
import { JhiBooleanComponent } from './boolean.component';
import { JhiJvmMemoryComponent } from './jvm-memory.component';
import { JhiJvmThreadsComponent } from './jvm-threads.component';
import { JhiMetricsHttpRequestComponent } from './metrics-request.component';
import { JhiMetricsEndpointsRequestsComponent } from './metrics-endpoints-requests.component';
import { JhiMetricsCacheComponent } from './metrics-cache.component';
import { JhiMetricsDatasourceComponent } from './metrics-datasource.component';
import { JhiMetricsSystemComponent } from './metrics-system.component';
import { JhiMetricsGarbageCollectorComponent } from './metrics-garbagecollector.component';
import { JhiThreadModalComponent } from './thread-modal.component';
import { JhiKeysPipe } from './keys.pipe';
import { JhiOrderByPipe } from './order-by.pipe';
import { JhiPureFilterPipe } from './pure-filter.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, FontAwesomeModule],
  declarations: [
    JhiSortDirective,
    JhiSortByDirective,
    JhiTranslateDirective,
    JhiItemCountComponent,
    JhiBooleanComponent,
    JhiJvmMemoryComponent,
    JhiJvmThreadsComponent,
    JhiMetricsHttpRequestComponent,
    JhiMetricsEndpointsRequestsComponent,
    JhiMetricsCacheComponent,
    JhiMetricsDatasourceComponent,
    JhiMetricsSystemComponent,
    JhiMetricsGarbageCollectorComponent,
    JhiThreadModalComponent,
    JhiKeysPipe,
    JhiOrderByPipe,
    JhiPureFilterPipe
  ],
  exports: [
    JhiSortDirective,
    JhiSortByDirective,
    JhiTranslateDirective,
    JhiItemCountComponent,
    JhiBooleanComponent,
    JhiJvmMemoryComponent,
    JhiJvmThreadsComponent,
    JhiMetricsHttpRequestComponent,
    JhiMetricsEndpointsRequestsComponent,
    JhiMetricsCacheComponent,
    JhiMetricsDatasourceComponent,
    JhiMetricsSystemComponent,
    JhiMetricsGarbageCollectorComponent,
    JhiThreadModalComponent,
    JhiKeysPipe,
    JhiOrderByPipe,
    JhiPureFilterPipe
  ]
})
export class ManagerCareJhipsterCompatModule {}
