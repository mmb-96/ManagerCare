import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagerCareSharedModule } from 'app/shared/shared.module';
import { ObjetivosConseguidosComponent } from './objetivos-conseguidos.component';
import { ObjetivosConseguidosDetailComponent } from './objetivos-conseguidos-detail.component';
import { ObjetivosConseguidosUpdateComponent } from './objetivos-conseguidos-update.component';
import { ObjetivosConseguidosDeleteDialogComponent } from './objetivos-conseguidos-delete-dialog.component';
import { objetivosConseguidosRoute } from './objetivos-conseguidos.route';

@NgModule({
  imports: [ManagerCareSharedModule, RouterModule.forChild(objetivosConseguidosRoute)],
  declarations: [
    ObjetivosConseguidosComponent,
    ObjetivosConseguidosDetailComponent,
    ObjetivosConseguidosUpdateComponent,
    ObjetivosConseguidosDeleteDialogComponent
  ],
  entryComponents: [ObjetivosConseguidosDeleteDialogComponent]
})
export class ManagerCareObjetivosConseguidosModule {}
