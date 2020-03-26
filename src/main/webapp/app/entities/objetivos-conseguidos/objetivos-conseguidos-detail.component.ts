import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';

@Component({
  selector: 'jhi-objetivos-conseguidos-detail',
  templateUrl: './objetivos-conseguidos-detail.component.html'
})
export class ObjetivosConseguidosDetailComponent implements OnInit {
  objetivosConseguidos: IObjetivosConseguidos | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ objetivosConseguidos }) => (this.objetivosConseguidos = objetivosConseguidos));
  }

  previousState(): void {
    window.history.back();
  }
}
