import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';
import { PuntosConseguidosService } from './puntos-conseguidos.service';

@Component({
  templateUrl: './puntos-conseguidos-delete-dialog.component.html'
})
export class PuntosConseguidosDeleteDialogComponent {
  puntosConseguidos?: IPuntosConseguidos;

  constructor(
    protected puntosConseguidosService: PuntosConseguidosService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.puntosConseguidosService.delete(id).subscribe(() => {
      this.eventManager.broadcast('puntosConseguidosListModification');
      this.activeModal.close();
    });
  }
}
