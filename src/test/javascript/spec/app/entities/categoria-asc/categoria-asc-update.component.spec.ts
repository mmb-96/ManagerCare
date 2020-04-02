import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { CategoriaAscUpdateComponent } from 'app/entities/categoria-asc/categoria-asc-update.component';
import { CategoriaAscService } from 'app/entities/categoria-asc/categoria-asc.service';
import { CategoriaAsc } from 'app/shared/model/categoria-asc.model';

describe('Component Tests', () => {
  describe('CategoriaAsc Management Update Component', () => {
    let comp: CategoriaAscUpdateComponent;
    let fixture: ComponentFixture<CategoriaAscUpdateComponent>;
    let service: CategoriaAscService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [CategoriaAscUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CategoriaAscUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoriaAscUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoriaAscService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategoriaAsc(123);
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
        const entity = new CategoriaAsc();
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
