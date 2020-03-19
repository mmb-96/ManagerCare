import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IObjetivo } from 'app/shared/model/objetivo.model';

@Component({
  selector: 'jhi-objetivo-detail',
  templateUrl: './objetivo-detail.component.html'
})
export class ObjetivoDetailComponent implements OnInit {
  objetivo: IObjetivo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ objetivo }) => (this.objetivo = objetivo));
  }

  previousState(): void {
    window.history.back();
  }
}
