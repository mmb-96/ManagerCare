import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { TipoDetailComponent } from 'app/entities/tipo/tipo-detail.component';
import { Tipo } from 'app/shared/model/tipo.model';

describe('Component Tests', () => {
  describe('Tipo Management Detail Component', () => {
    let comp: TipoDetailComponent;
    let fixture: ComponentFixture<TipoDetailComponent>;
    const route = ({ data: of({ tipo: new Tipo(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [TipoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(TipoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TipoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load tipo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tipo).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
