import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IObjetivo, Objetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoUserService } from './objetivo-user.service';
import { ObjetivoUserComponent } from './objetivo-user.component';
import { ObjetivoUserDetailComponent } from './objetivo-user-detail.component';

@Injectable({ providedIn: 'root' })
export class ObjetiovUserResolve implements Resolve<IObjetivo> {
  constructor(private service: ObjetivoUserService, private router: Router) {}

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

export const objetivoUserRoute: Routes = [
  {
    path: '',
    component: ObjetivoUserComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ObjetivoUserDetailComponent,
    resolve: {
      objetivo: ObjetiovUserResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managerCareApp.objetivo.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
