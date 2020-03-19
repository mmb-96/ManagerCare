import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IObjetivo, Objetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoService } from './objetivo.service';
import { ObjetivoComponent } from './objetivo.component';
import { ObjetivoDetailComponent } from './objetivo-detail.component';
import { ObjetivoUpdateComponent } from './objetivo-update.component';

@Injectable({ providedIn: 'root' })
export class ObjetivoResolve implements Resolve<IObjetivo> {
  constructor(private service: ObjetivoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IObjetivo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((objetivo: HttpResponse<Objetivo>) => {
          if (objetivo.body) {
            return of(objetivo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Objetivo());
  }
}

export const objetivoRoute: Routes = [
  {
    path: '',
    component: ObjetivoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ObjetivoDetailComponent,
    resolve: {
      objetivo: ObjetivoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ObjetivoUpdateComponent,
    resolve: {
      objetivo: ObjetivoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ObjetivoUpdateComponent,
    resolve: {
      objetivo: ObjetivoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivo.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
