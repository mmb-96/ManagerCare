import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICategoriaAsc, CategoriaAsc } from 'app/shared/model/categoria-asc.model';
import { CategoriaAscService } from './categoria-asc.service';
import { ICategoria } from 'app/shared/model/categoria.model';
import { CategoriaService } from 'app/entities/categoria/categoria.service';

@Component({
  selector: 'jhi-categoria-asc-update',
  templateUrl: './categoria-asc-update.component.html'
})
export class CategoriaAscUpdateComponent implements OnInit {
  isSaving = false;
  categorias: ICategoria[] = [];

  editForm = this.fb.group({
    id: [],
    idHijo: [],
    idPadre: []
  });

  constructor(
    protected categoriaAscService: CategoriaAscService,
    protected categoriaService: CategoriaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categoriaAsc }) => {
      this.updateForm(categoriaAsc);

      this.categoriaService.query().subscribe((res: HttpResponse<ICategoria[]>) => (this.categorias = res.body || []));
    });
  }

  updateForm(categoriaAsc: ICategoriaAsc): void {
    this.editForm.patchValue({
      id: categoriaAsc.id,
      idHijo: categoriaAsc.idHijo,
      idPadre: categoriaAsc.idPadre
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const categoriaAsc = this.createFromForm();
    if (categoriaAsc.id !== undefined) {
      this.subscribeToSaveResponse(this.categoriaAscService.update(categoriaAsc));
    } else {
      this.subscribeToSaveResponse(this.categoriaAscService.create(categoriaAsc));
    }
  }

  private createFromForm(): ICategoriaAsc {
    return {
      ...new CategoriaAsc(),
      id: this.editForm.get(['id'])!.value,
      idHijo: this.editForm.get(['idHijo'])!.value,
      idPadre: this.editForm.get(['idPadre'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategoriaAsc>>): void {
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

  trackById(index: number, item: ICategoria): any {
    return item.id;
  }
}
