import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApisService } from '../services/apis.service';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private api: ApisService,
        private auth: AuthService, 
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        //Check if erpat server is live.
        this.api.post('api/v1/erpat/init', {}).then((response: any) => {

            if (typeof response !== 'undefined' && response.success === true ) {
                //Check if user is authenticated.
                const user = this.auth.userValue;  
                if (!user) {
                    this.router.navigate(['/login']);
                } else {
                    if( this.router.url === '/login' ) {
                        this.router.navigate(['/']);
                    }  
                }
            } else {
                this.router.navigate(['/maintainance']);
            }            
        }).catch(error => {
            this.router.navigate(['/maintainance']);
        });

        return true;
    }
}
