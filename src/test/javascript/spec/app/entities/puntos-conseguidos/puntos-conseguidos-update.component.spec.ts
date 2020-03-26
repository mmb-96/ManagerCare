import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { PuntosConseguidosUpdateComponent } from 'app/entities/puntos-conseguidos/puntos-conseguidos-update.component';
import { PuntosConseguidosService } from 'app/entities/puntos-conseguidos/puntos-conseguidos.service';
import { PuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';

describe('Component Tests', () => {
  describe('PuntosConseguidos Management Update Component', () => {
    let comp: PuntosConseguidosUpdateComponent;
    let fixture: ComponentFixture<PuntosConseguidosUpdateComponent>;
    let service: PuntosConseguidosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [PuntosConseguidosUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PuntosConseguidosUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PuntosConseguidosUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PuntosConseguidosService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PuntosConseguidos(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new PuntosConseguidos();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
