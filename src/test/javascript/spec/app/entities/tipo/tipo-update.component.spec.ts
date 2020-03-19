import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { TipoUpdateComponent } from 'app/entities/tipo/tipo-update.component';
import { TipoService } from 'app/entities/tipo/tipo.service';
import { Tipo } from 'app/shared/model/tipo.model';

describe('Component Tests', () => {
  describe('Tipo Management Update Component', () => {
    let comp: TipoUpdateComponent;
    let fixture: ComponentFixture<TipoUpdateComponent>;
    let service: TipoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [TipoUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TipoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TipoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TipoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Tipo(123);
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
        const entity = new Tipo();
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
