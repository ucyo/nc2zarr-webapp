import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  constructor(private toasterService: ToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiReq = req.clone(
      {
        url: `${environment.baseUrl}/${req.url}`,
      }
    );

    return next.handle(apiReq).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse && req.method !== 'GET') {
          this.toasterService.success(req.method + ' ' + req.url, evt.status + '', {positionClass: 'toast-bottom-right'});
        }
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          this.toasterService.error(req.method + ' ' + req.url, err.status + '', {positionClass: 'toast-bottom-right'});
        }
        return of(err);
      })
    );

  }
}
