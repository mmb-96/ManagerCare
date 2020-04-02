import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IUserExtra, UserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from './user-extra.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { ICategoria } from 'app/shared/model/categoria.model';
import { CategoriaService } from 'app/entities/categoria/categoria.service';

type SelectableEntity = IUser | ICategoria;

@Component({
  selector: 'jhi-user-extra-update',
  templateUrl: './user-extra-update.component.html'
})
export class UserExtraUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];
  categorias: ICategoria[] = [];

  editForm = this.fb.group({
    id: [],
    user: [],
    idResponsable: [],
    categoria: []
  });

  constructor(
    protected userExtraService: UserExtraService,
    protected userService: UserService,
    protected categoriaService: CategoriaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExtra }) => {
      this.updateForm(userExtra);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));

      this.categoriaService.query().subscribe((res: HttpResponse<ICategoria[]>) => (this.categorias = res.body || []));
    });
  }

  updateForm(userExtra: IUserExtra): void {
    this.editForm.patchValue({
      id: userExtra.id,
      user: userExtra.user,
      idResponsable: userExtra.idResponsable,
      categoria: userExtra.categoria
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userExtra = this.createFromForm();
    if (userExtra.id !== undefined) {
      this.subscribeToSaveResponse(this.userExtraService.update(userExtra));
    } else {
      this.subscribeToSaveResponse(this.userExtraService.create(userExtra));
    }
  }

  private createFromForm(): IUserExtra {
    return {
      ...new UserExtra(),
      id: this.editForm.get(['id'])!.value,
      user: this.editForm.get(['user'])!.value,
      idResponsable: this.editForm.get(['idResponsable'])!.value,
      categoria: this.editForm.get(['categoria'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserExtra>>): void {
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
