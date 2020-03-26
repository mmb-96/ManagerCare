import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IObjetivosConseguidos, ObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';
import { ObjetivosConseguidosService } from './objetivos-conseguidos.service';
import { ObjetivosConseguidosComponent } from './objetivos-conseguidos.component';
import { ObjetivosConseguidosDetailComponent } from './objetivos-conseguidos-detail.component';
import { ObjetivosConseguidosUpdateComponent } from './objetivos-conseguidos-update.component';

@Injectable({ providedIn: 'root' })
export class ObjetivosConseguidosResolve implements Resolve<IObjetivosConseguidos> {
  constructor(private service: ObjetivosConseguidosService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IObjetivosConseguidos> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((objetivosConseguidos: HttpResponse<ObjetivosConseguidos>) => {
          if (objetivosConseguidos.body) {
            return of(objetivosConseguidos.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ObjetivosConseguidos());
  }
}

export const objetivosConseguidosRoute: Routes = [
  {
    path: '',
    component: ObjetivosConseguidosComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ObjetivosConseguidosDetailComponent,
    resolve: {
      objetivosConseguidos: ObjetivosConseguidosResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ObjetivosConseguidosUpdateComponent,
    resolve: {
      objetivosConseguidos: ObjetivosConseguidosResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ObjetivosConseguidosUpdateComponent,
    resolve: {
      objetivosConseguidos: ObjetivosConseguidosResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivosConseguidos.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
