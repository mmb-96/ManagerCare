import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagerCareTestModule } from '../../../test.module';
import { ObjetivoComponent } from 'app/entities/objetivo/objetivo.component';
import { ObjetivoService } from 'app/entities/objetivo/objetivo.service';
import { Objetivo } from 'app/shared/model/objetivo.model';

describe('Component Tests', () => {
  describe('Objetivo Management Component', () => {
    let comp: ObjetivoComponent;
    let fixture: ComponentFixture<ObjetivoComponent>;
    let service: ObjetivoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [ObjetivoComponent]
      })
        .overrideTemplate(ObjetivoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ObjetivoComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ObjetivoService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Objetivo(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.objetivos && comp.objetivos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
