import {
  HttpHeaders,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApisService {
  baseServer = '';
  httpOptions = {
    //
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    }),
  };

  private async handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      //
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    return error.error;
  }
  constructor(private http: HttpClient) {}
  async get(url: string, params?: any, name = ''): Promise<any> {
    let pas = '';
    if (params) {
      const entries = Object.entries(params);
      entries.forEach((x: any) => {
        pas += `${x[0]}=${x[1]}&`;
      });
    }

    const pathUrl = `${this.baseServer}/${url}?${pas}`;
    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data: any) => {
          if (Array.isArray(data)) {
            // console.log(data)
            //let dt = !BaseApiUrl.Orders ? Array.from(data) : Array.from(data);
            return res(data);
          } else {
            res(data);
          }
        });
    });
  }
  async getId(url: string, id = '') {
    const pathUrl = `${this.baseServer}/${url}/${id}`;

    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }
  async update(url: string, data: any) {
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http
        .put(pathUrl, data, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }

  async create(url: string = '', data: any) {
    let req = !Array.isArray(data) ? [data] : data;
    req = Array.from(req).map((x: any) => {
      if (!x.id || x.id == '') x['id'] = null;
      return x;
    });
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http
        .post(pathUrl, req, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          res(e);
        });
    });
  }
  async destroy(url: string, id: any, showDialog = true) {
    const pathUrl = `${this.baseServer}/${url}/${id}`;
    return new Promise((res, rej) => {
      this.http
        .delete(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          res(e);
        });
    });
  }

  async translate(text: any) {
    return new Promise((res, rej) => {
      this.http
        .get(
          ` https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${text}`
        )
        .subscribe((e) => {
          const arr = e as any;
          res(arr[0][0][0]);
        });
    });
  }
}
