import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { ObjetivosConseguidosDetailComponent } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos-detail.component';
import { ObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';

describe('Component Tests', () => {
  describe('ObjetivosConseguidos Management Detail Component', () => {
    let comp: ObjetivosConseguidosDetailComponent;
    let fixture: ComponentFixture<ObjetivosConseguidosDetailComponent>;
    const route = ({ data: of({ objetivosConseguidos: new ObjetivosConseguidos(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [ObjetivosConseguidosDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ObjetivosConseguidosDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ObjetivosConseguidosDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load objetivosConseguidos on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.objetivosConseguidos).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
