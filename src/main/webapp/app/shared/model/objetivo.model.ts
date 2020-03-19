import { ITipo } from 'app/shared/model/tipo.model';
import { ICategoria } from 'app/shared/model/categoria.model';

export interface IObjetivo {
  id?: number;
  nombre?: string;
  descripcion?: string;
  url?: string;
  puntos?: number;
  tipo?: ITipo;
  categorias?: ICategoria[];
}

export class Objetivo implements IObjetivo {
  constructor(
    public id?: number,
    public nombre?: string,
    public descripcion?: string,
    public url?: string,
    public puntos?: number,
    public tipo?: ITipo,
    public categorias?: ICategoria[]
  ) {}
}
