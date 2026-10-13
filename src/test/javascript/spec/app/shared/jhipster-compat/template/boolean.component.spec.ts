import { TestBed } from '@angular/core/testing';
import { CompatibilitySubjectModule, JhiBooleanComponent, createConfig } from './compat-subject';

describe('Boolean template compatibility', () => {
  it('retains exact icon defaults when texts are undefined', () => {
    const component = new JhiBooleanComponent(createConfig()); component.ngOnInit();
    expect(component.classTrue).toBe('fa fa-lg fa-check text-success');
    expect(component.classFalse).toBe('fa fa-lg fa-times text-danger');
  });

  it('retains badge defaults when texts are present, including empty text', () => {
    const component = new JhiBooleanComponent(createConfig());
    component.textTrue = ''; component.textFalse = 'inactive'; component.ngOnInit();
    expect(component.classTrue).toBe('badge badge-success');
    expect(component.classFalse).toBe('badge badge-danger');
  });

  it('retains explicit class overrides, including empty class', () => {
    const component = new JhiBooleanComponent(createConfig());
    component.classTrue = 'custom'; component.classFalse = ''; component.ngOnInit();
    expect(component.classTrue).toBe('custom'); expect(component.classFalse).toBe('');
  });

  [true, false, 1, 0, '', 'yes', null, undefined].forEach(value => it('uses legacy truthiness for ' + String(value), () => {
    TestBed.configureTestingModule({ imports: [CompatibilitySubjectModule] });
    const fixture = TestBed.createComponent(JhiBooleanComponent);
    fixture.componentInstance.value = value as boolean;
    fixture.componentInstance.textTrue = '<b>active</b>'; fixture.componentInstance.textFalse = '<i>inactive</i>';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.innerHTML).toBe(value ? '<b>active</b>' : '<i>inactive</i>');
    expect(span.classList.contains(value ? 'badge-success' : 'badge-danger')).toBe(true);
  }));
});
