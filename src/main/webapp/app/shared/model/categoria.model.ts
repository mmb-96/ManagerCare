import { IObjetivo } from 'app/shared/model/objetivo.model';
import { IUser } from 'app/core/user/user.model';

export interface ICategoria {
  id?: number;
  nombre?: string;
  descripcion?: string;
  objetivos?: IObjetivo[];
  users?: IUser[];
}

export class Categoria implements ICategoria {
  constructor(
    public id?: number,
    public nombre?: string,
    public descripcion?: string,
    public objetivos?: IObjetivo[],
    public users?: IUser[]
  ) {}
}
