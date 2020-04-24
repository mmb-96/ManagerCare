import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUser } from 'app/core/user/user.model';

@Component({
  selector: 'jhi-user-teams-detail',
  templateUrl: './user-teams-detail.component.html'
})
export class UserTeamsDetailComponent implements OnInit {
  userTeams: IUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userTeam }) => (this.userTeams = userTeam));
  }

  previousState(): void {
    window.history.back();
  }
}
