import { ICategoria } from 'app/shared/model/categoria.model';

export interface ICategoriaAsc {
  id?: number;
  idHijo?: ICategoria;
  idPadre?: ICategoria;
}

export class CategoriaAsc implements ICategoriaAsc {
  constructor(public id?: number, public idHijo?: ICategoria, public idPadre?: ICategoria) {}
}
