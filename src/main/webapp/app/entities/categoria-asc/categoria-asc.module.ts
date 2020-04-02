import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagerCareSharedModule } from 'app/shared/shared.module';
import { CategoriaAscComponent } from './categoria-asc.component';
import { CategoriaAscDetailComponent } from './categoria-asc-detail.component';
import { CategoriaAscUpdateComponent } from './categoria-asc-update.component';
import { CategoriaAscDeleteDialogComponent } from './categoria-asc-delete-dialog.component';
import { categoriaAscRoute } from './categoria-asc.route';

@NgModule({
  imports: [ManagerCareSharedModule, RouterModule.forChild(categoriaAscRoute)],
  declarations: [CategoriaAscComponent, CategoriaAscDetailComponent, CategoriaAscUpdateComponent, CategoriaAscDeleteDialogComponent],
  entryComponents: [CategoriaAscDeleteDialogComponent]
})
export class ManagerCareCategoriaAscModule {}
