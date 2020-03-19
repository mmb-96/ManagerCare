import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IObjetivo, Objetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoService } from './objetivo.service';
import { ITipo } from 'app/shared/model/tipo.model';
import { TipoService } from 'app/entities/tipo/tipo.service';

@Component({
  selector: 'jhi-objetivo-update',
  templateUrl: './objetivo-update.component.html'
})
export class ObjetivoUpdateComponent implements OnInit {
  isSaving = false;
  tipos: ITipo[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [],
    descripcion: [],
    url: [],
    puntos: [],
    tipo: []
  });

  constructor(
    protected objetivoService: ObjetivoService,
    protected tipoService: TipoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ objetivo }) => {
      this.updateForm(objetivo);

      this.tipoService.query().subscribe((res: HttpResponse<ITipo[]>) => (this.tipos = res.body || []));
    });
  }

  updateForm(objetivo: IObjetivo): void {
    this.editForm.patchValue({
      id: objetivo.id,
      nombre: objetivo.nombre,
      descripcion: objetivo.descripcion,
      url: objetivo.url,
      puntos: objetivo.puntos,
      tipo: objetivo.tipo
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const objetivo = this.createFromForm();
    if (objetivo.id !== undefined) {
      this.subscribeToSaveResponse(this.objetivoService.update(objetivo));
    } else {
      this.subscribeToSaveResponse(this.objetivoService.create(objetivo));
    }
  }

  private createFromForm(): IObjetivo {
    return {
      ...new Objetivo(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      url: this.editForm.get(['url'])!.value,
      puntos: this.editForm.get(['puntos'])!.value,
      tipo: this.editForm.get(['tipo'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IObjetivo>>): void {
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

  trackById(index: number, item: ITipo): any {
    return item.id;
  }
}
