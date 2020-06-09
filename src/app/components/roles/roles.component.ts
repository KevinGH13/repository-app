import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Util } from '../../util/util';
import { RolesService } from '../../services/roles-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  listRoles: any[] = [];
  util: Util = new Util();

  constructor(private rolService: RolesService, private router: Router) { }

  ngOnInit() { this.getFaculties(); }

  getFaculties() {
    this.rolService.getRoles()
      .subscribe(response => {
        if (response.status) {
          this.listRoles = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); });
  }

}
