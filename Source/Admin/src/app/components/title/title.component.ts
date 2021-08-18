/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-title',
  template: ''
})
export class TitleComponent implements OnInit {
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private titleService: Title,
    private authService: AuthService
  ) {
    const role = authService.userValue.role;
    if(role == Role.Admin) {
      this.titleService.setTitle('BSEI Admin');
    } else if(role == Role.Merchant) {
      this.titleService.setTitle('BSEI Merchant');
    } else {
      this.titleService.setTitle('Forbidden');
    }

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        let currentRoute = this.route.root;
        let title = '';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              title = routes.snapshot.data.breadcrumb;
              currentRoute = routes;
            }
          });
        } while (currentRoute);        
      });
  }

  ngOnInit() {
  }

}
