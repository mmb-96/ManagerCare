import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { ObjetivosConseguidosUpdateComponent } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos-update.component';
import { ObjetivosConseguidosService } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos.service';
import { ObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';

describe('Component Tests', () => {
  describe('ObjetivosConseguidos Management Update Component', () => {
    let comp: ObjetivosConseguidosUpdateComponent;
    let fixture: ComponentFixture<ObjetivosConseguidosUpdateComponent>;
    let service: ObjetivosConseguidosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [ObjetivosConseguidosUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ObjetivosConseguidosUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ObjetivosConseguidosUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ObjetivosConseguidosService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ObjetivosConseguidos(123);
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
        const entity = new ObjetivosConseguidos();
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
