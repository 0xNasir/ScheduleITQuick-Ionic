import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BlockDays} from '../models/block-days';
import {environment} from '../../environments/environment';
import {Profile} from '../models/profile';
import {Inbox} from '../models/inbox';
import {Notification} from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class PivService {

  constructor(private http: HttpClient) {
  }

  getBlockDays(): Observable<BlockDays[]> {
    return this.http.get<BlockDays[]>(environment.baseURL + 'v1/api/block_days/');
  }

  postBlockDays(value: BlockDays): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/block_days/', value);
  }

  putBlockDays(value: BlockDays): Observable<any> {
    return this.http.put(environment.baseURL + 'v1/api/block_days/' + value.id + '/', value);
  }

  deleteBlockDays(id): Observable<any> {
    return this.http.delete(environment.baseURL + 'v1/api/block_days/' + id + '/');
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(environment.baseURL + 'v1/api/profile/');
  }

  putProfile(profile: Profile): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/profile/update/', profile);
  }

  getInboxList(): Observable<Inbox[]> {
    return this.http.get<Inbox[]>(environment.baseURL + 'v1/api/inbox/');
  }

  retrieveMessage(username: string): Observable<Inbox[]> {
    return this.http.get<Inbox[]>(environment.baseURL + 'v1/api/inbox/' + username + '/');
  }

  postMessage(data: any, chatUser: string): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/inbox/' + chatUser + '/', data);
  }

  getNotification(): Observable<Notification[]> {
    return this.http.get<Notification[]>(environment.baseURL + 'v1/api/notification/');
  }

  postForgetPassword(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/forget_password/', data);
  }

  postVerifyOTP(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/otp/verify/', data);
  }

  setPassword(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/set_new_password/', data);
  }

  postChangePassword(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/change_password/', data);
  }

  postRegister(data: any): Observable<any> {
    return this.http.post(environment.baseURL + 'v1/api/register/', data);
  }

  putNotification(id: any): Observable<any> {
    return this.http.put(environment.baseURL + 'v1/api/notification/' + id + '/', {});
  }
}
