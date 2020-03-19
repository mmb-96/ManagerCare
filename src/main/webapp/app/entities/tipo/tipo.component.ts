import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITipo } from 'app/shared/model/tipo.model';
import { TipoService } from './tipo.service';
import { TipoDeleteDialogComponent } from './tipo-delete-dialog.component';

@Component({
  selector: 'jhi-tipo',
  templateUrl: './tipo.component.html'
})
export class TipoComponent implements OnInit, OnDestroy {
  tipos?: ITipo[];
  eventSubscriber?: Subscription;

  constructor(protected tipoService: TipoService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.tipoService.query().subscribe((res: HttpResponse<ITipo[]>) => (this.tipos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInTipos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ITipo): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInTipos(): void {
    this.eventSubscriber = this.eventManager.subscribe('tipoListModification', () => this.loadAll());
  }

  delete(tipo: ITipo): void {
    const modalRef = this.modalService.open(TipoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tipo = tipo;
  }
}
