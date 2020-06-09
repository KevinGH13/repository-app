import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from 'src/app/util/util';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  util: Util = new Util();
  formLogin: FormGroup;
  submitted = false;
  private formBuilder: FormBuilder = new FormBuilder();
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.CreateFormValidation();
  }

  CreateFormValidation() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get fo() { return this.formLogin.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.formLogin.valid) {
      this.loginService.login(this.formLogin.value)
        .subscribe(response => {
          if (response.status) {
            this.loginService.setToken(response.information);
            this.btnCloseModal.nativeElement.click();
          } else {
            this.util.manageResponseFalse(response);
          }
        });
    }
  }

  onCancel() {
    this.formLogin.reset();
    this.submitted = false;
  }
}
