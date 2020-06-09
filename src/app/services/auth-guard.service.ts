import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  ro: any;

  constructor(private router: Router, private loginService: LoginService) { }

  canActivate() {
    if (this.loginService.isAuthenticate()) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
