import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITipo } from 'app/shared/model/tipo.model';
import { TipoService } from './tipo.service';

@Component({
  templateUrl: './tipo-delete-dialog.component.html'
})
export class TipoDeleteDialogComponent {
  tipo?: ITipo;

  constructor(protected tipoService: TipoService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tipoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('tipoListModification');
      this.activeModal.close();
    });
  }
}
