import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthenticationService){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const reqWithAuthorization = req.clone({
            setHeaders: {
                Authorization: `Token ${this.authService.token}`
            }
        });
        if (this.authService.isAuthenticated())
            return next.handle(reqWithAuthorization);
        else
            return next.handle(req)
    }

}