import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ManagerCareTestModule } from '../../../test.module';
import { MockEventManager } from '../../../helpers/mock-event-manager.service';
import { MockActiveModal } from '../../../helpers/mock-active-modal.service';
import { ObjetivosConseguidosDeleteDialogComponent } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos-delete-dialog.component';
import { ObjetivosConseguidosService } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos.service';

describe('Component Tests', () => {
  describe('ObjetivosConseguidos Management Delete Component', () => {
    let comp: ObjetivosConseguidosDeleteDialogComponent;
    let fixture: ComponentFixture<ObjetivosConseguidosDeleteDialogComponent>;
    let service: ObjetivosConseguidosService;
    let mockEventManager: MockEventManager;
    let mockActiveModal: MockActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [ObjetivosConseguidosDeleteDialogComponent]
      })
        .overrideTemplate(ObjetivosConseguidosDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ObjetivosConseguidosDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ObjetivosConseguidosService);
      mockEventManager = TestBed.get(JhiEventManager);
      mockActiveModal = TestBed.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.closeSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
      });
    });
  });
});
