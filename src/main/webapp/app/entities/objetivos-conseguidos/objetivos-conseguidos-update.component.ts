import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IObjetivosConseguidos, ObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';
import { ObjetivosConseguidosService } from './objetivos-conseguidos.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IObjetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoService } from 'app/entities/objetivo/objetivo.service';

type SelectableEntity = IUser | IObjetivo;

@Component({
  selector: 'jhi-objetivos-conseguidos-update',
  templateUrl: './objetivos-conseguidos-update.component.html'
})
export class ObjetivosConseguidosUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];
  objetivos: IObjetivo[] = [];

  editForm = this.fb.group({
    id: [],
    estado: [],
    fechaApertura: [],
    fechaCierre: [],
    user: [],
    objetivo: []
  });

  constructor(
    protected objetivosConseguidosService: ObjetivosConseguidosService,
    protected userService: UserService,
    protected objetivoService: ObjetivoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ objetivosConseguidos }) => {
      if (!objetivosConseguidos.id) {
        const today = moment().startOf('day');
        objetivosConseguidos.fechaApertura = today;
        objetivosConseguidos.fechaCierre = today;
      }

      this.updateForm(objetivosConseguidos);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));

      this.objetivoService.query().subscribe((res: HttpResponse<IObjetivo[]>) => (this.objetivos = res.body || []));
    });
  }

  updateForm(objetivosConseguidos: IObjetivosConseguidos): void {
    this.editForm.patchValue({
      id: objetivosConseguidos.id,
      estado: objetivosConseguidos.estado,
      fechaApertura: objetivosConseguidos.fechaApertura ? objetivosConseguidos.fechaApertura.format(DATE_TIME_FORMAT) : null,
      fechaCierre: objetivosConseguidos.fechaCierre ? objetivosConseguidos.fechaCierre.format(DATE_TIME_FORMAT) : null,
      user: objetivosConseguidos.user,
      objetivo: objetivosConseguidos.objetivo
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const objetivosConseguidos = this.createFromForm();
    if (objetivosConseguidos.id !== undefined) {
      this.subscribeToSaveResponse(this.objetivosConseguidosService.update(objetivosConseguidos));
    } else {
      this.subscribeToSaveResponse(this.objetivosConseguidosService.create(objetivosConseguidos));
    }
  }

  private createFromForm(): IObjetivosConseguidos {
    return {
      ...new ObjetivosConseguidos(),
      id: this.editForm.get(['id'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      fechaApertura: this.editForm.get(['fechaApertura'])!.value
        ? moment(this.editForm.get(['fechaApertura'])!.value, DATE_TIME_FORMAT)
        : undefined,
      fechaCierre: this.editForm.get(['fechaCierre'])!.value
        ? moment(this.editForm.get(['fechaCierre'])!.value, DATE_TIME_FORMAT)
        : undefined,
      user: this.editForm.get(['user'])!.value,
      objetivo: this.editForm.get(['objetivo'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IObjetivosConseguidos>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
