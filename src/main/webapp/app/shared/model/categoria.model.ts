import { IObjetivo } from 'app/shared/model/objetivo.model';

export interface ICategoria {
  id?: number;
  nombre?: string;
  descripcion?: string;
  objetivos?: IObjetivo[];
}

export class Categoria implements ICategoria {
  constructor(public id?: number, public nombre?: string, public descripcion?: string, public objetivos?: IObjetivo[]) {}
}
