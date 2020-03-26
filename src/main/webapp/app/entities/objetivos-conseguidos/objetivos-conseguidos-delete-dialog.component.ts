import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';
import { ObjetivosConseguidosService } from './objetivos-conseguidos.service';

@Component({
  templateUrl: './objetivos-conseguidos-delete-dialog.component.html'
})
export class ObjetivosConseguidosDeleteDialogComponent {
  objetivosConseguidos?: IObjetivosConseguidos;

  constructor(
    protected objetivosConseguidosService: ObjetivosConseguidosService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.objetivosConseguidosService.delete(id).subscribe(() => {
      this.eventManager.broadcast('objetivosConseguidosListModification');
      this.activeModal.close();
    });
  }
}
