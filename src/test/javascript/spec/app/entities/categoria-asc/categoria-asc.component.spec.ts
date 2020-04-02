import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagerCareTestModule } from '../../../test.module';
import { CategoriaAscComponent } from 'app/entities/categoria-asc/categoria-asc.component';
import { CategoriaAscService } from 'app/entities/categoria-asc/categoria-asc.service';
import { CategoriaAsc } from 'app/shared/model/categoria-asc.model';

describe('Component Tests', () => {
  describe('CategoriaAsc Management Component', () => {
    let comp: CategoriaAscComponent;
    let fixture: ComponentFixture<CategoriaAscComponent>;
    let service: CategoriaAscService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [CategoriaAscComponent]
      })
        .overrideTemplate(CategoriaAscComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoriaAscComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoriaAscService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CategoriaAsc(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.categoriaAscs && comp.categoriaAscs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
