import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      const localStorageData = localStorage.getItem('access');
      const refreshToken = localStorage.getItem('refresh');
      if (localStorageData) {
        this.authService.verifyLogin({token: localStorageData}).subscribe(data => {
          resolve(true);
        }, error => {
          if (refreshToken) {
            this.authService.retrieveToken({refresh: refreshToken}).subscribe(response => {
              localStorage.setItem('access', response.access);
              resolve(true);
            }, error1 => {
              this.router.navigateByUrl('/login');
              resolve(false);
            });
          } else {
            this.router.navigateByUrl('/login');
            resolve(false);
          }
        });
      } else {
        this.router.navigateByUrl('/login');
        resolve(false);
      }
    });
  }
}
