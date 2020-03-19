import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'objetivo',
        loadChildren: () => import('./objetivo/objetivo.module').then(m => m.ManagerCareObjetivoModule)
      },
      {
        path: 'categoria',
        loadChildren: () => import('./categoria/categoria.module').then(m => m.ManagerCareCategoriaModule)
      },
      {
        path: 'tipo',
        loadChildren: () => import('./tipo/tipo.module').then(m => m.ManagerCareTipoModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class ManagerCareEntityModule {}
