import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BootstrappingService {
  constructor(private router: Router,
              private authService: AuthService) {
  }

  async initApp() {
    const access = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');
    if (access) {
      this.authService.verifyLogin({token: access}).subscribe(res => {
      }, error => {
        this.authService.retrieveToken({refresh: refreshToken}).subscribe(response => {
          localStorage.setItem('access', response.access);
        }, error1 => {
          localStorage.clear();
          this.router.navigateByUrl('/login');
        });
      });
    } else if (refreshToken) {
      this.authService.retrieveToken({refresh: refreshToken}).subscribe(response => {
        localStorage.setItem('access', response.access);
      }, error1 => {
        localStorage.clear();
        this.router.navigateByUrl('/login');
      });
    } else {
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
  }
}
