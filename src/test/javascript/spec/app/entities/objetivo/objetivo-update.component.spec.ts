import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { ObjetivoUpdateComponent } from 'app/entities/objetivo/objetivo-update.component';
import { ObjetivoService } from 'app/entities/objetivo/objetivo.service';
import { Objetivo } from 'app/shared/model/objetivo.model';

describe('Component Tests', () => {
  describe('Objetivo Management Update Component', () => {
    let comp: ObjetivoUpdateComponent;
    let fixture: ComponentFixture<ObjetivoUpdateComponent>;
    let service: ObjetivoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [ObjetivoUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ObjetivoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ObjetivoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ObjetivoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Objetivo(123);
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
        const entity = new Objetivo();
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
