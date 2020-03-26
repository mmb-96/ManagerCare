import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { PuntosConseguidosDetailComponent } from 'app/entities/puntos-conseguidos/puntos-conseguidos-detail.component';
import { PuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';

describe('Component Tests', () => {
  describe('PuntosConseguidos Management Detail Component', () => {
    let comp: PuntosConseguidosDetailComponent;
    let fixture: ComponentFixture<PuntosConseguidosDetailComponent>;
    const route = ({ data: of({ puntosConseguidos: new PuntosConseguidos(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [PuntosConseguidosDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PuntosConseguidosDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PuntosConseguidosDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load puntosConseguidos on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.puntosConseguidos).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
