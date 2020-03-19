import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagerCareSharedModule } from 'app/shared/shared.module';
import { TipoComponent } from './tipo.component';
import { TipoDetailComponent } from './tipo-detail.component';
import { TipoUpdateComponent } from './tipo-update.component';
import { TipoDeleteDialogComponent } from './tipo-delete-dialog.component';
import { tipoRoute } from './tipo.route';

@NgModule({
  imports: [ManagerCareSharedModule, RouterModule.forChild(tipoRoute)],
  declarations: [TipoComponent, TipoDetailComponent, TipoUpdateComponent, TipoDeleteDialogComponent],
  entryComponents: [TipoDeleteDialogComponent]
})
export class ManagerCareTipoModule {}
