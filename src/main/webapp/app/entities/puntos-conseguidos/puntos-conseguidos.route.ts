import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPuntosConseguidos, PuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';
import { PuntosConseguidosService } from './puntos-conseguidos.service';
import { PuntosConseguidosComponent } from './puntos-conseguidos.component';
import { PuntosConseguidosDetailComponent } from './puntos-conseguidos-detail.component';
import { PuntosConseguidosUpdateComponent } from './puntos-conseguidos-update.component';

@Injectable({ providedIn: 'root' })
export class PuntosConseguidosResolve implements Resolve<IPuntosConseguidos> {
  constructor(private service: PuntosConseguidosService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPuntosConseguidos> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((puntosConseguidos: HttpResponse<PuntosConseguidos>) => {
          if (puntosConseguidos.body) {
            return of(puntosConseguidos.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PuntosConseguidos());
  }
}

export const puntosConseguidosRoute: Routes = [
  {
    path: '',
    component: PuntosConseguidosComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.puntosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PuntosConseguidosDetailComponent,
    resolve: {
      puntosConseguidos: PuntosConseguidosResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.puntosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PuntosConseguidosUpdateComponent,
    resolve: {
      puntosConseguidos: PuntosConseguidosResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.puntosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PuntosConseguidosUpdateComponent,
    resolve: {
      puntosConseguidos: PuntosConseguidosResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.puntosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
