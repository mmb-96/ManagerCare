import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { PuntosConseguidosService } from 'app/entities/puntos-conseguidos/puntos-conseguidos.service';
import { IPuntosConseguidos, PuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';

describe('Service Tests', () => {
  describe('PuntosConseguidos Service', () => {
    let injector: TestBed;
    let service: PuntosConseguidosService;
    let httpMock: HttpTestingController;
    let elemDefault: IPuntosConseguidos;
    let expectedResult: IPuntosConseguidos | IPuntosConseguidos[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(PuntosConseguidosService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new PuntosConseguidos(0, 0, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            anyos: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a PuntosConseguidos', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            anyos: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            anyos: currentDate
          },
          returnedFromService
        );

        service.create(new PuntosConseguidos()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PuntosConseguidos', () => {
        const returnedFromService = Object.assign(
          {
            puntos: 1,
            anyos: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            anyos: currentDate
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PuntosConseguidos', () => {
        const returnedFromService = Object.assign(
          {
            puntos: 1,
            anyos: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            anyos: currentDate
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a PuntosConseguidos', () => {
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
