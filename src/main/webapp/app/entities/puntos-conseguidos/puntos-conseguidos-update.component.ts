import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IPuntosConseguidos, PuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';
import { PuntosConseguidosService } from './puntos-conseguidos.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-puntos-conseguidos-update',
  templateUrl: './puntos-conseguidos-update.component.html'
})
export class PuntosConseguidosUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    puntos: [],
    anyos: [],
    user: []
  });

  constructor(
    protected puntosConseguidosService: PuntosConseguidosService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ puntosConseguidos }) => {
      if (!puntosConseguidos.id) {
        const today = moment().startOf('day');
        puntosConseguidos.anyos = today;
      }

      this.updateForm(puntosConseguidos);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(puntosConseguidos: IPuntosConseguidos): void {
    this.editForm.patchValue({
      id: puntosConseguidos.id,
      puntos: puntosConseguidos.puntos,
      anyos: puntosConseguidos.anyos ? puntosConseguidos.anyos.format(DATE_TIME_FORMAT) : null,
      user: puntosConseguidos.user
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const puntosConseguidos = this.createFromForm();
    if (puntosConseguidos.id !== undefined) {
      this.subscribeToSaveResponse(this.puntosConseguidosService.update(puntosConseguidos));
    } else {
      this.subscribeToSaveResponse(this.puntosConseguidosService.create(puntosConseguidos));
    }
  }

  private createFromForm(): IPuntosConseguidos {
    return {
      ...new PuntosConseguidos(),
      id: this.editForm.get(['id'])!.value,
      puntos: this.editForm.get(['puntos'])!.value,
      anyos: this.editForm.get(['anyos'])!.value ? moment(this.editForm.get(['anyos'])!.value, DATE_TIME_FORMAT) : undefined,
      user: this.editForm.get(['user'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPuntosConseguidos>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}
