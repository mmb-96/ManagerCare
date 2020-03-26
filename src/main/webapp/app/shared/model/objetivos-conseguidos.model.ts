import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IObjetivo } from 'app/shared/model/objetivo.model';

export interface IObjetivosConseguidos {
  id?: number;
  estado?: boolean;
  fechaApertura?: Moment;
  fechaCierre?: Moment;
  user?: IUser;
  objetivo?: IObjetivo;
}

export class ObjetivosConseguidos implements IObjetivosConseguidos {
  constructor(
    public id?: number,
    public estado?: boolean,
    public fechaApertura?: Moment,
    public fechaCierre?: Moment,
    public user?: IUser,
    public objetivo?: IObjetivo
  ) {
    this.estado = this.estado || false;
  }
}
