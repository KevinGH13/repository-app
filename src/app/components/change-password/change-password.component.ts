import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from 'src/app/util/util';
import { ChangePasswordService } from '../../services/change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  util: Util = new Util();
  formPassword: FormGroup;
  submitted = false;
  private formBuilder: FormBuilder = new FormBuilder();
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private changePaswordService: ChangePasswordService) { }

  ngOnInit() {
    this.CreateFormValidation();
  }

  get fo() { return this.formPassword.controls; }

  CreateFormValidation() {
    this.formPassword = this.formBuilder.group({
      actualPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8),
         Validators.maxLength(15), Validators.pattern('^[*A-Za-z0-9_-]+$')]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(15), Validators.pattern('^[*A-Za-z0-9_-]+$')]]
    }, {
        validator: this.util.MustMatch('newPassword', 'confirmPassword')
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formPassword.valid) {
      this.changePaswordService.changePassword(this.formPassword.value)
        .subscribe(response => {
          if (response.status) {
            this.util.manageResponseTrue(response);
            this.btnCloseModal.nativeElement.click();
          } else {
            this.util.manageResponseFalse(response);
          }
        });
    }
  }

  onCancel() {
    this.formPassword.reset();
    this.submitted = false;
  }

}
