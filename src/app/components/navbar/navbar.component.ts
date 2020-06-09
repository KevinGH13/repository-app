import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {
  }

  onLogout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }

}
