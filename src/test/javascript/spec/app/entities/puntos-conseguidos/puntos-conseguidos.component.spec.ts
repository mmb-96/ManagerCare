import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagerCareTestModule } from '../../../test.module';
import { PuntosConseguidosComponent } from 'app/entities/puntos-conseguidos/puntos-conseguidos.component';
import { PuntosConseguidosService } from 'app/entities/puntos-conseguidos/puntos-conseguidos.service';
import { PuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';

describe('Component Tests', () => {
  describe('PuntosConseguidos Management Component', () => {
    let comp: PuntosConseguidosComponent;
    let fixture: ComponentFixture<PuntosConseguidosComponent>;
    let service: PuntosConseguidosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [PuntosConseguidosComponent]
      })
        .overrideTemplate(PuntosConseguidosComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PuntosConseguidosComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PuntosConseguidosService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PuntosConseguidos(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.puntosConseguidos && comp.puntosConseguidos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
