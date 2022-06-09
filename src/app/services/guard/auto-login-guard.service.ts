import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuardService implements CanLoad {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      const localStorageData = localStorage.getItem('access');
      const refreshToken = localStorage.getItem('refresh');
      if (localStorageData) {
        this.authService.verifyLogin({token: localStorageData}).subscribe(data => {
          this.router.navigateByUrl('/dashboard');
          resolve(false);
        }, error => {
          if (refreshToken) {
            this.authService.retrieveToken({refresh: refreshToken}).subscribe(response => {
              localStorage.setItem('access', response.access);
              this.router.navigateByUrl('/dashboard');
              resolve(false);
            }, error1 => resolve(true));
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    });
  }
}
