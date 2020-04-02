import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICategoriaAsc, CategoriaAsc } from 'app/shared/model/categoria-asc.model';
import { CategoriaAscService } from './categoria-asc.service';
import { CategoriaAscComponent } from './categoria-asc.component';
import { CategoriaAscDetailComponent } from './categoria-asc-detail.component';
import { CategoriaAscUpdateComponent } from './categoria-asc-update.component';

@Injectable({ providedIn: 'root' })
export class CategoriaAscResolve implements Resolve<ICategoriaAsc> {
  constructor(private service: CategoriaAscService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategoriaAsc> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((categoriaAsc: HttpResponse<CategoriaAsc>) => {
          if (categoriaAsc.body) {
            return of(categoriaAsc.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CategoriaAsc());
  }
}

export const categoriaAscRoute: Routes = [
  {
    path: '',
    component: CategoriaAscComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.categoriaAsc.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategoriaAscDetailComponent,
    resolve: {
      categoriaAsc: CategoriaAscResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.categoriaAsc.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategoriaAscUpdateComponent,
    resolve: {
      categoriaAsc: CategoriaAscResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.categoriaAsc.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategoriaAscUpdateComponent,
    resolve: {
      categoriaAsc: CategoriaAscResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.categoriaAsc.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
