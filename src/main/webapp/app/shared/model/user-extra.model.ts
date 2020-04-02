import { IUser } from 'app/core/user/user.model';
import { ICategoria } from 'app/shared/model/categoria.model';

export interface IUserExtra {
  id?: number;
  user?: IUser;
  idResponsable?: IUser;
  categoria?: ICategoria;
}

export class UserExtra implements IUserExtra {
  constructor(public id?: number, public user?: IUser, public idResponsable?: IUser, public categoria?: ICategoria) {}
}
