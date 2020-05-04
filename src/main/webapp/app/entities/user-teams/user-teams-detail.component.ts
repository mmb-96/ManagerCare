import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { IUser } from 'app/core/user/user.model';
import { IObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';
import { HttpResponse } from '@angular/common/http';
import { UserTeamsService } from './user-teams.service';

@Component({
  selector: 'jhi-user-teams-detail',
  templateUrl: './user-teams-detail.component.html'
})
export class UserTeamsDetailComponent implements OnInit {
  userTeams: IUser | null = null;
  objetivosConseguidos?: IObjetivosConseguidos[];

  constructor(protected activatedRoute: ActivatedRoute, private service: UserTeamsService) {}

  loadAll(login: string): void {
    this.service
      .findObject(login)
      .subscribe((res: HttpResponse<IObjetivosConseguidos[]>) => (this.objetivosConseguidos = res.body || []));
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userTeam }) => (this.userTeams = userTeam));
    this.activatedRoute.params.forEach((params: Params) => {
      const id = params['id'];
      this.loadAll(id);
    });
  }

  previousState(): void {
    window.history.back();
  }
}
