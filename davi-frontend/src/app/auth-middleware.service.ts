import { Injectable } from '@angular/core';
import { Router, UrlTree, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * AuthMiddlewareService
 * Redireciona um usuário não autenticado pra pagina de login.
 */
export class AuthMiddlewareService implements CanActivate{

  constructor(
    private auth: AuthenticationService,
    private router: Router
    ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("AuthMiddlewareService: canActivate called");
    if(this.auth.isAuthenticated()){
      console.log("AuthMiddlewareService: user authenticated...");
      return true;
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }  
}
