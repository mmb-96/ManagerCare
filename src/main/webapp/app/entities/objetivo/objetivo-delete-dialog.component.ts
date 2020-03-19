import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IObjetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoService } from './objetivo.service';

@Component({
  templateUrl: './objetivo-delete-dialog.component.html'
})
export class ObjetivoDeleteDialogComponent {
  objetivo?: IObjetivo;

  constructor(protected objetivoService: ObjetivoService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.objetivoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('objetivoListModification');
      this.activeModal.close();
    });
  }
}
