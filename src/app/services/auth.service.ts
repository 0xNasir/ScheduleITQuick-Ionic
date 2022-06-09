import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../models/login';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  postLogin(data: Login): Observable<any> {
    return this.http.post(environment.baseURL + 'auth/token/', data);
  }

  verifyLogin(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'auth/token/verify/', data);
  }

  retrieveToken(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'auth/token/refresh/', data);
  }
}
