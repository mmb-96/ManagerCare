import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagerCareSharedModule } from 'app/shared/shared.module';
import { ObjetivoUserComponent } from './objetivo-user.component';
import { ObjetivoUserDetailComponent } from './objetivo-user-detail.component';
import { objetivoUserRoute } from './objetivo-user.route';

@NgModule({
  imports: [ManagerCareSharedModule, RouterModule.forChild(objetivoUserRoute)],
  declarations: [ObjetivoUserComponent, ObjetivoUserDetailComponent]
})
export class ManagerCareObjetivoUserModule {}
