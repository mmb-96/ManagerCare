import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagerCareSharedModule } from 'app/shared/shared.module';
import { PuntosConseguidosComponent } from './puntos-conseguidos.component';
import { PuntosConseguidosDetailComponent } from './puntos-conseguidos-detail.component';
import { PuntosConseguidosUpdateComponent } from './puntos-conseguidos-update.component';
import { PuntosConseguidosDeleteDialogComponent } from './puntos-conseguidos-delete-dialog.component';
import { puntosConseguidosRoute } from './puntos-conseguidos.route';

@NgModule({
  imports: [ManagerCareSharedModule, RouterModule.forChild(puntosConseguidosRoute)],
  declarations: [
    PuntosConseguidosComponent,
    PuntosConseguidosDetailComponent,
    PuntosConseguidosUpdateComponent,
    PuntosConseguidosDeleteDialogComponent
  ],
  entryComponents: [PuntosConseguidosDeleteDialogComponent]
})
export class ManagerCarePuntosConseguidosModule {}
