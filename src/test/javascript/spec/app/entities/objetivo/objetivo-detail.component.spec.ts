import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { ObjetivoDetailComponent } from 'app/entities/objetivo/objetivo-detail.component';
import { Objetivo } from 'app/shared/model/objetivo.model';

describe('Component Tests', () => {
  describe('Objetivo Management Detail Component', () => {
    let comp: ObjetivoDetailComponent;
    let fixture: ComponentFixture<ObjetivoDetailComponent>;
    const route = ({ data: of({ objetivo: new Objetivo(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [ObjetivoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ObjetivoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ObjetivoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load objetivo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.objetivo).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
