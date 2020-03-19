import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagerCareTestModule } from '../../../test.module';
import { TipoComponent } from 'app/entities/tipo/tipo.component';
import { TipoService } from 'app/entities/tipo/tipo.service';
import { Tipo } from 'app/shared/model/tipo.model';

describe('Component Tests', () => {
  describe('Tipo Management Component', () => {
    let comp: TipoComponent;
    let fixture: ComponentFixture<TipoComponent>;
    let service: TipoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [TipoComponent]
      })
        .overrideTemplate(TipoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TipoComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TipoService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Tipo(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.tipos && comp.tipos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
