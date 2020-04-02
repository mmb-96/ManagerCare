import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICategoriaAsc } from 'app/shared/model/categoria-asc.model';
import { CategoriaAscService } from './categoria-asc.service';

@Component({
  templateUrl: './categoria-asc-delete-dialog.component.html'
})
export class CategoriaAscDeleteDialogComponent {
  categoriaAsc?: ICategoriaAsc;

  constructor(
    protected categoriaAscService: CategoriaAscService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.categoriaAscService.delete(id).subscribe(() => {
      this.eventManager.broadcast('categoriaAscListModification');
      this.activeModal.close();
    });
  }
}
