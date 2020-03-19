import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ITipo, Tipo } from 'app/shared/model/tipo.model';
import { TipoService } from './tipo.service';

@Component({
  selector: 'jhi-tipo-update',
  templateUrl: './tipo-update.component.html'
})
export class TipoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombre: []
  });

  constructor(protected tipoService: TipoService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipo }) => {
      this.updateForm(tipo);
    });
  }

  updateForm(tipo: ITipo): void {
    this.editForm.patchValue({
      id: tipo.id,
      nombre: tipo.nombre
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipo = this.createFromForm();
    if (tipo.id !== undefined) {
      this.subscribeToSaveResponse(this.tipoService.update(tipo));
    } else {
      this.subscribeToSaveResponse(this.tipoService.create(tipo));
    }
  }

  private createFromForm(): ITipo {
    return {
      ...new Tipo(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipo>>): void {
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
}
