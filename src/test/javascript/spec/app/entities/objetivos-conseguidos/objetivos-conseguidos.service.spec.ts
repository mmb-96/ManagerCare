import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ObjetivosConseguidosService } from 'app/entities/objetivos-conseguidos/objetivos-conseguidos.service';
import { IObjetivosConseguidos, ObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';

describe('Service Tests', () => {
  describe('ObjetivosConseguidos Service', () => {
    let injector: TestBed;
    let service: ObjetivosConseguidosService;
    let httpMock: HttpTestingController;
    let elemDefault: IObjetivosConseguidos;
    let expectedResult: IObjetivosConseguidos | IObjetivosConseguidos[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ObjetivosConseguidosService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ObjetivosConseguidos(0, false, currentDate, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fechaApertura: currentDate.format(DATE_TIME_FORMAT),
            fechaCierre: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ObjetivosConseguidos', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fechaApertura: currentDate.format(DATE_TIME_FORMAT),
            fechaCierre: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaApertura: currentDate,
            fechaCierre: currentDate
          },
          returnedFromService
        );

        service.create(new ObjetivosConseguidos()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ObjetivosConseguidos', () => {
        const returnedFromService = Object.assign(
          {
            estado: true,
            fechaApertura: currentDate.format(DATE_TIME_FORMAT),
            fechaCierre: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaApertura: currentDate,
            fechaCierre: currentDate
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ObjetivosConseguidos', () => {
        const returnedFromService = Object.assign(
          {
            estado: true,
            fechaApertura: currentDate.format(DATE_TIME_FORMAT),
            fechaCierre: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaApertura: currentDate,
            fechaCierre: currentDate
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ObjetivosConseguidos', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
