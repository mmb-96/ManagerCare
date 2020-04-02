import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategoriaAsc } from 'app/shared/model/categoria-asc.model';
import { CategoriaAscService } from './categoria-asc.service';
import { CategoriaAscDeleteDialogComponent } from './categoria-asc-delete-dialog.component';

@Component({
  selector: 'jhi-categoria-asc',
  templateUrl: './categoria-asc.component.html'
})
export class CategoriaAscComponent implements OnInit, OnDestroy {
  categoriaAscs?: ICategoriaAsc[];
  eventSubscriber?: Subscription;

  constructor(
    protected categoriaAscService: CategoriaAscService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.categoriaAscService.query().subscribe((res: HttpResponse<ICategoriaAsc[]>) => (this.categoriaAscs = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCategoriaAscs();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICategoriaAsc): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCategoriaAscs(): void {
    this.eventSubscriber = this.eventManager.subscribe('categoriaAscListModification', () => this.loadAll());
  }

  delete(categoriaAsc: ICategoriaAsc): void {
    const modalRef = this.modalService.open(CategoriaAscDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.categoriaAsc = categoriaAsc;
  }
}
