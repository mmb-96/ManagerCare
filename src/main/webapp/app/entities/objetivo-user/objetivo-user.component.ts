import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IObjetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoUserService } from './objetivo-user.service';

@Component({
  selector: 'jhi-objetivo-user',
  templateUrl: './objetivo-user.component.html'
})
export class ObjetivoUserComponent implements OnInit, OnDestroy {
  objetivos?: IObjetivo[];
  objetivosNext?: IObjetivo[];
  eventSubscriber?: Subscription;

  constructor(protected objetivoService: ObjetivoUserService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.objetivoService.query().subscribe((res: HttpResponse<IObjetivo[]>) => (this.objetivos = res.body || []));
    this.objetivoService.query2().subscribe((res: HttpResponse<IObjetivo[]>) => (this.objetivosNext = res.body || []));
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
}
