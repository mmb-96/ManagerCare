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
      },
      {
        path: 'puntos-conseguidos',
        loadChildren: () => import('./puntos-conseguidos/puntos-conseguidos.module').then(m => m.ManagerCarePuntosConseguidosModule)
      },
      {
        path: 'objetivos-conseguidos',
        loadChildren: () =>
          import('./objetivos-conseguidos/objetivos-conseguidos.module').then(m => m.ManagerCareObjetivosConseguidosModule)
      },
      {
        path: 'user-extra',
        loadChildren: () => import('./user-extra/user-extra.module').then(m => m.ManagerCareUserExtraModule)
      },
      {
        path: 'categoria-asc',
        loadChildren: () => import('./categoria-asc/categoria-asc.module').then(m => m.ManagerCareCategoriaAscModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class ManagerCareEntityModule {}
