import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Inbox} from '../../models/inbox';
import {PivService} from '../../services/piv.service';
import {Profile} from '../../models/profile';
import {LoadingService} from '../../services/loading.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  public inbox: Inbox[];
  currentUser: Profile;

  constructor(public router: Router,
              private loadingService: LoadingService,
              private toast: ToastController,
              private pivService: PivService) {
  }

  ngOnInit() {
    const loading = this.loadingService.showLoading();
    this.pivService.getProfile().subscribe(res => {
      this.currentUser = res;
      this.pivService.getInboxList().subscribe((response) => {
        this.inbox = response;
        this.loadingService.dismissLoading(loading);
      }, async error => {
        this.loadingService.dismissLoading(loading);
        if (error.status === 401) {
          localStorage.clear();
          this.router.navigateByUrl('/login');
        } else {
          const t = await this.toast.create({
            message: 'Something went wrong.',
            duration: 1000
          });
          await t.present();
        }
      });
    }, async error2 => {
      this.loadingService.dismissLoading(loading);
      if (error2.status === 401) {
        localStorage.clear();
        this.router.navigateByUrl('/login');
      } else {
        const t = await this.toast.create({
          message: 'Something went wrong.',
          duration: 1000
        });
        await t.present();
      }
    });
  }

  openChat(item: any) {
    const uname = item.sender.username === this.currentUser.user.username ? item.receiver.username : item.sender.username;
    this.router.navigateByUrl('dashboard/inbox/' + uname);
  }
  ionViewWillEnter() {
    this.ngOnInit();
  }
  doRefresh($event: any) {
    this.ngOnInit();
    $event.target.complete();
  }
}
