import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICategoria, Categoria } from 'app/shared/model/categoria.model';
import { CategoriaService } from './categoria.service';
import { IObjetivo } from 'app/shared/model/objetivo.model';
import { ObjetivoService } from 'app/entities/objetivo/objetivo.service';

@Component({
  selector: 'jhi-categoria-update',
  templateUrl: './categoria-update.component.html'
})
export class CategoriaUpdateComponent implements OnInit {
  isSaving = false;
  objetivos: IObjetivo[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [],
    descripcion: [],
    objetivos: []
  });

  constructor(
    protected categoriaService: CategoriaService,
    protected objetivoService: ObjetivoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categoria }) => {
      this.updateForm(categoria);

      this.objetivoService.query().subscribe((res: HttpResponse<IObjetivo[]>) => (this.objetivos = res.body || []));
    });
  }

  updateForm(categoria: ICategoria): void {
    this.editForm.patchValue({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      objetivos: categoria.objetivos
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const categoria = this.createFromForm();
    if (categoria.id !== undefined) {
      this.subscribeToSaveResponse(this.categoriaService.update(categoria));
    } else {
      this.subscribeToSaveResponse(this.categoriaService.create(categoria));
    }
  }

  private createFromForm(): ICategoria {
    return {
      ...new Categoria(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      objetivos: this.editForm.get(['objetivos'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategoria>>): void {
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

  trackById(index: number, item: IObjetivo): any {
    return item.id;
  }

  getSelected(selectedVals: IObjetivo[], option: IObjetivo): IObjetivo {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
