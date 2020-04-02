import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagerCareTestModule } from '../../../test.module';
import { CategoriaAscDetailComponent } from 'app/entities/categoria-asc/categoria-asc-detail.component';
import { CategoriaAsc } from 'app/shared/model/categoria-asc.model';

describe('Component Tests', () => {
  describe('CategoriaAsc Management Detail Component', () => {
    let comp: CategoriaAscDetailComponent;
    let fixture: ComponentFixture<CategoriaAscDetailComponent>;
    const route = ({ data: of({ categoriaAsc: new CategoriaAsc(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagerCareTestModule],
        declarations: [CategoriaAscDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategoriaAscDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoriaAscDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load categoriaAsc on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categoriaAsc).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
