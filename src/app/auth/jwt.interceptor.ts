import { Injectable, Component } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  providers:[SessionService],
  template: '<html><title></title></html>'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private session: SessionService,private sessionService: SessionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let authReq = request;
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let token = sessionStorage.getItem('accessToken');
    if (currentUser && token) {      
      this.sessionService.validateExpiration();
      authReq = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
    }

    return next.handle(authReq);
  }
}
