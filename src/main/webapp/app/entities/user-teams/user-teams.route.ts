import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { User, IUser } from 'app/core/user/user.model';
import { UserTeamsService } from './user-teams.service';
import { UserTeamsComponent } from './user-teams.component';
import { UserTeamsDetailComponent } from './user-teams-detail.component';

@Injectable({ providedIn: 'root' })
export class UserTeamsResolve implements Resolve<IUser> {
  constructor(private service: UserTeamsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((userTeam: HttpResponse<IUser>) => {
          if (userTeam.body) {
            return of(userTeam.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new User());
  }
}

export const userTeamsRoute: Routes = [
  {
    path: '',
    component: UserTeamsComponent,
    data: {
      authorities: [Authority.USER]
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: UserTeamsDetailComponent,
    resolve: {
      userTeam: UserTeamsResolve
    },
    data: {
      authorities: [Authority.USER]
    },
    canActivate: [UserRouteAccessService]
  }
];
