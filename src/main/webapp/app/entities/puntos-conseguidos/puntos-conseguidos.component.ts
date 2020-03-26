import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';
import { PuntosConseguidosService } from './puntos-conseguidos.service';
import { PuntosConseguidosDeleteDialogComponent } from './puntos-conseguidos-delete-dialog.component';

@Component({
  selector: 'jhi-puntos-conseguidos',
  templateUrl: './puntos-conseguidos.component.html'
})
export class PuntosConseguidosComponent implements OnInit, OnDestroy {
  puntosConseguidos?: IPuntosConseguidos[];
  eventSubscriber?: Subscription;

  constructor(
    protected puntosConseguidosService: PuntosConseguidosService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.puntosConseguidosService.query().subscribe((res: HttpResponse<IPuntosConseguidos[]>) => (this.puntosConseguidos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPuntosConseguidos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPuntosConseguidos): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPuntosConseguidos(): void {
    this.eventSubscriber = this.eventManager.subscribe('puntosConseguidosListModification', () => this.loadAll());
  }

  delete(puntosConseguidos: IPuntosConseguidos): void {
    const modalRef = this.modalService.open(PuntosConseguidosDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.puntosConseguidos = puntosConseguidos;
  }
}
