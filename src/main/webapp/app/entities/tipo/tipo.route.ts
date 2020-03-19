import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITipo, Tipo } from 'app/shared/model/tipo.model';
import { TipoService } from './tipo.service';
import { TipoComponent } from './tipo.component';
import { TipoDetailComponent } from './tipo-detail.component';
import { TipoUpdateComponent } from './tipo-update.component';

@Injectable({ providedIn: 'root' })
export class TipoResolve implements Resolve<ITipo> {
  constructor(private service: TipoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITipo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((tipo: HttpResponse<Tipo>) => {
          if (tipo.body) {
            return of(tipo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tipo());
  }
}

export const tipoRoute: Routes = [
  {
    path: '',
    component: TipoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.tipo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TipoDetailComponent,
    resolve: {
      tipo: TipoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.tipo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TipoUpdateComponent,
    resolve: {
      tipo: TipoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.tipo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TipoUpdateComponent,
    resolve: {
      tipo: TipoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.tipo.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
