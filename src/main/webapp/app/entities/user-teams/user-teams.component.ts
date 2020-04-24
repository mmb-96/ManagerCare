import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUser } from 'app/core/user/user.model';
import { UserTeamsService } from './user-teams.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';

@Component({
  selector: 'jhi-user-teams',
  templateUrl: './user-teams.component.html'
})
export class UserTeamsComponent implements OnInit, OnDestroy {
  userTeams?: IUser[] | null = null;
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  constructor(protected userTeamsService: UserTeamsService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInUserExtras();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IUser): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInUserExtras(): void {
    this.eventSubscriber = this.eventManager.subscribe('userExtraListModification', () => this.loadAll());
  }

  private loadAll(): void {
    this.userTeamsService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage
      })
      .subscribe((res: HttpResponse<IUser[]>) => this.onSuccess(res.body, res.headers));
  }

  private onSuccess(users: IUser[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.userTeams = users;
  }
}
