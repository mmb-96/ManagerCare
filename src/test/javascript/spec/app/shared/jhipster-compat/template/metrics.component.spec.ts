import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  CompatibilitySubjectModule, TranslationDouble, JhiJvmMemoryComponent, JhiMetricsHttpRequestComponent,
  JhiMetricsEndpointsRequestsComponent, JhiMetricsCacheComponent, JhiMetricsDatasourceComponent,
  JhiMetricsSystemComponent, JhiMetricsGarbageCollectorComponent
} from './compat-subject';

describe('Metrics template compatibility', () => {
  const timer = { count: 2, mean: 1.25, max: 3, '0.0': 0, '0.5': 1, '0.75': 2, '0.95': 2, '0.99': 3 };
  const cases: { name: string; component: Type<object>; inputs: object; text: string }[] = [
    { name: 'memory', component: JhiJvmMemoryComponent, inputs: { jvmMemoryMetrics: { heap: { used: 52428800, max: 104857600, committed: 104857600 } } }, text: '50%' },
    { name: 'http', component: JhiMetricsHttpRequestComponent, inputs: { requestMetrics: { all: { count: 10 }, percode: { '200': { count: 8, mean: 1, max: 2 } } } }, text: '200' },
    { name: 'endpoints', component: JhiMetricsEndpointsRequestsComponent, inputs: { endpointsRequestsMetrics: { '/api/synthetic': { GET: timer } } }, text: '/api/synthetic' },
    { name: 'cache', component: JhiMetricsCacheComponent, inputs: { cacheMetrics: { synthetic: { 'cache.gets.hit': 8, 'cache.gets.miss': 2, 'cache.puts': 1, 'cache.removals': 0, 'cache.evictions': 0 } } }, text: '80' },
    { name: 'datasource', component: JhiMetricsDatasourceComponent, inputs: { datasourceMetrics: { active: { value: 1 }, min: { value: 0 }, max: { value: 10 }, idle: { value: 9 }, acquire: timer, creation: timer, usage: timer } }, text: 'Acquire' },
    { name: 'system', component: JhiMetricsSystemComponent, inputs: { systemMetrics: { 'process.uptime': 61000, 'process.start.time': 0, 'process.cpu.usage': 0.25, 'system.cpu.usage': 0.5, 'system.cpu.count': 4, 'system.load.average.1m': 0, 'process.files.max': 100, 'process.files.open': 2 } }, text: '1 minute 1 second' },
    { name: 'gc', component: JhiMetricsGarbageCollectorComponent, inputs: { garbageCollectorMetrics: { 'jvm.gc.live.data.size': 1048576, 'jvm.gc.max.data.size': 2097152, 'jvm.gc.memory.promoted': 1, 'jvm.gc.memory.allocated': 2, classesLoaded: 3, classesUnloaded: 0, 'jvm.gc.pause': timer } }, text: 'jvm.gc.pause' }
  ];

  cases.forEach(row => it('renders real ' + row.name + ' template with synthetic values', () => {
    TestBed.configureTestingModule({ imports: [CompatibilitySubjectModule], providers: [{ provide: TranslateService, useValue: new TranslationDouble() }] });
    const fixture = TestBed.createComponent(row.component);
    Object.assign(fixture.componentInstance, row.inputs, { updating: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(row.text);
    fixture.destroy();
  }));

  [JhiMetricsCacheComponent, JhiMetricsHttpRequestComponent, JhiMetricsDatasourceComponent].forEach(component => it('preserves NaN handling in ' + component.name, () => {
    const value = new component();
    expect(value.filterNaN(NaN)).toBe(0); expect(value.filterNaN(2.5)).toBe(2.5);
  }));

  it('preserves exact system duration units and formatting', () => {
    const component = new JhiMetricsSystemComponent();
    expect(component.convertMillisecondsToDuration(0)).toBe('');
    expect(component.convertMillisecondsToDuration(61000)).toBe('1 minute 1 second ');
    expect(component.convertMillisecondsToDuration(120000)).toBe('2 minutes ');
    expect(component.convertMillisecondsToDuration(31557600000)).toBe('1 year ');
  });

  it('retains the updating guard without dereferencing absent memory data', () => {
    TestBed.configureTestingModule({ imports: [CompatibilitySubjectModule], providers: [{ provide: TranslateService, useValue: new TranslationDouble() }] });
    const fixture = TestBed.createComponent(JhiJvmMemoryComponent);
    fixture.componentInstance.updating = true; fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ngb-progressbar')).toBeNull();
  });
});
