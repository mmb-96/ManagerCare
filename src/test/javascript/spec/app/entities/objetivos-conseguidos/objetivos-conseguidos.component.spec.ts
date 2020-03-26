import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagerCareTestModule } from '../../../test.module';
import { ObjetivosConseguidosComponent } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos.component';
import { ObjetivosConseguidosService } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos.service';
import { ObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';

describe('Component Tests', () => {
  describe('ObjetivosConseguidos Management Component', () => {
    let comp: ObjetivosConseguidosComponent;
    let fixture: ComponentFixture<ObjetivosConseguidosComponent>;
    let service: ObjetivosConseguidosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [ObjetivosConseguidosComponent]
      })
        .overrideTemplate(ObjetivosConseguidosComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ObjetivosConseguidosComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ObjetivosConseguidosService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ObjetivosConseguidos(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.objetivosConseguidos && comp.objetivosConseguidos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
