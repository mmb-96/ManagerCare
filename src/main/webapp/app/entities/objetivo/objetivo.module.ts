import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagerCareSharedModule } from 'app/shared/shared.module';
import { ObjetivoComponent } from './objetivo.component';
import { ObjetivoDetailComponent } from './objetivo-detail.component';
import { ObjetivoUpdateComponent } from './objetivo-update.component';
import { ObjetivoDeleteDialogComponent } from './objetivo-delete-dialog.component';
import { objetivoRoute } from './objetivo.route';

@NgModule({
  imports: [ManagerCareSharedModule, RouterModule.forChild(objetivoRoute)],
  declarations: [ObjetivoComponent, ObjetivoDetailComponent, ObjetivoUpdateComponent, ObjetivoDeleteDialogComponent],
  entryComponents: [ObjetivoDeleteDialogComponent]
})
export class ManagerCareObjetivoModule {}
