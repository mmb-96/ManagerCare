import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagerCareSharedModule } from 'app/shared/shared.module';
import { UserTeamsComponent } from './user-teams.component';
import { UserTeamsDetailComponent } from './user-teams-detail.component';
import { userTeamsRoute } from './user-teams.route';

@NgModule({
  imports: [ManagerCareSharedModule, RouterModule.forChild(userTeamsRoute)],
  declarations: [UserTeamsComponent, UserTeamsDetailComponent]
})
export class ManagerCareUserTeamsModule {}
