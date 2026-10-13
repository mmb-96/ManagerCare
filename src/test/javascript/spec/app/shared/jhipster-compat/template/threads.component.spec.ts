import { TestBed } from '@angular/core/testing';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CompatibilitySubjectModule, TranslationDouble, JhiJvmThreadsComponent, JhiThreadModalComponent } from './compat-subject';

describe('Threads template compatibility', () => {
  const threads = ['RUNNABLE', 'WAITING', 'TIMED_WAITING', 'BLOCKED', 'NEW'].map((threadState, index) => ({
    threadState, threadId: index + 1, threadName: 'synthetic-' + threadState,
    lockName: 'lock-' + index, blockedTime: 0, blockedCount: 0, waitedTime: 0, waitedCount: 0,
    stackTrace: [{ className: 'SyntheticClass', methodName: 'syntheticMethod', fileName: 'Synthetic.java', lineNumber: 10 }]
  }));

  it('counts the four historical states and opens the exact thread modal with the same array', () => {
    const reference = { componentInstance: { threadDump: undefined as object[] | undefined } };
    const modal = { open: jest.fn(() => reference) };
    const component = new JhiJvmThreadsComponent(modal as unknown as NgbModal);
    component.threadData = threads; component.ngOnInit();
    expect(component.threadStats).toEqual({ threadDumpRunnable: 1, threadDumpWaiting: 1, threadDumpTimedWaiting: 1, threadDumpBlocked: 1, threadDumpAll: 4 });
    component.open();
    expect(modal.open).toHaveBeenCalledWith(JhiThreadModalComponent);
    expect(reference.componentInstance.threadDump).toBe(threads);
  });

  it('renders the threads component and delegates its button to NgbModal', () => {
    const modal = { open: jest.fn(() => ({ componentInstance: {} })) };
    TestBed.configureTestingModule({ imports: [CompatibilitySubjectModule], providers: [
      { provide: TranslateService, useValue: new TranslationDouble() }, { provide: NgbModal, useValue: modal }
    ] });
    const fixture = TestBed.createComponent(JhiJvmThreadsComponent);
    fixture.componentInstance.threadData = threads; fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Total: 4');
    fixture.nativeElement.querySelector('button').click();
    expect(modal.open).toHaveBeenCalledWith(JhiThreadModalComponent);
  });

  it('renders stack traces, integrates pureFilter quirks, and dismisses through the original action', () => {
    const activeModal = { dismiss: jest.fn() };
    TestBed.configureTestingModule({ imports: [CompatibilitySubjectModule], providers: [
      { provide: TranslateService, useValue: new TranslationDouble() }, { provide: NgbActiveModal, useValue: activeModal }
    ] });
    const fixture = TestBed.createComponent(JhiThreadModalComponent);
    fixture.componentInstance.threadDump = threads; fixture.detectChanges();
    expect(fixture.componentInstance.threadDumpAll).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.pad').length).toBe(5);
    expect(fixture.nativeElement.textContent).toContain('SyntheticClass.syntheticMethod');
    fixture.componentInstance.threadDumpFilter = { threadState: 'RUNNABLE' }; fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.pad').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('synthetic-RUNNABLE');
    fixture.componentInstance.threadDumpFilter = {}; fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.pad').length).toBe(0);
    fixture.nativeElement.querySelector('.modal-footer button').click();
    expect(activeModal.dismiss).toHaveBeenCalledWith('closed');
  });
});
