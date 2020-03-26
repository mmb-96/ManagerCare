import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';
import { ObjetivosConseguidosService } from './objetivos-conseguidos.service';
import { ObjetivosConseguidosDeleteDialogComponent } from './objetivos-conseguidos-delete-dialog.component';

@Component({
  selector: 'jhi-objetivos-conseguidos',
  templateUrl: './objetivos-conseguidos.component.html'
})
export class ObjetivosConseguidosComponent implements OnInit, OnDestroy {
  objetivosConseguidos?: IObjetivosConseguidos[];
  eventSubscriber?: Subscription;

  constructor(
    protected objetivosConseguidosService: ObjetivosConseguidosService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.objetivosConseguidosService
      .query()
      .subscribe((res: HttpResponse<IObjetivosConseguidos[]>) => (this.objetivosConseguidos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInObjetivosConseguidos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IObjetivosConseguidos): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInObjetivosConseguidos(): void {
    this.eventSubscriber = this.eventManager.subscribe('objetivosConseguidosListModification', () => this.loadAll());
  }

  delete(objetivosConseguidos: IObjetivosConseguidos): void {
    const modalRef = this.modalService.open(ObjetivosConseguidosDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.objetivosConseguidos = objetivosConseguidos;
  }
}
