import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IObjetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoService } from './objetivo.service';
import { ObjetivoDeleteDialogComponent } from './objetivo-delete-dialog.component';

@Component({
  selector: 'jhi-objetivo',
  templateUrl: './objetivo.component.html'
})
export class ObjetivoComponent implements OnInit, OnDestroy {
  objetivos?: IObjetivo[];
  eventSubscriber?: Subscription;

  constructor(protected objetivoService: ObjetivoService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.objetivoService.query().subscribe((res: HttpResponse<IObjetivo[]>) => (this.objetivos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInObjetivos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IObjetivo): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInObjetivos(): void {
    this.eventSubscriber = this.eventManager.subscribe('objetivoListModification', () => this.loadAll());
  }

  delete(objetivo: IObjetivo): void {
    const modalRef = this.modalService.open(ObjetivoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.objetivo = objetivo;
  }
}
