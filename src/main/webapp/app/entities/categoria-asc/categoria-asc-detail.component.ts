import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategoriaAsc } from 'app/shared/model/categoria-asc.model';

@Component({
  selector: 'jhi-categoria-asc-detail',
  templateUrl: './categoria-asc-detail.component.html'
})
export class CategoriaAscDetailComponent implements OnInit {
  categoriaAsc: ICategoriaAsc | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categoriaAsc }) => (this.categoriaAsc = categoriaAsc));
  }

  previousState(): void {
    window.history.back();
  }
}
