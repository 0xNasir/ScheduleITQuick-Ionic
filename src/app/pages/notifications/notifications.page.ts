import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PivService} from '../../services/piv.service';
import {Notification} from '../../models/notification';
import {LoadingService} from '../../services/loading.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: Notification[];

  constructor(public router: Router,
              private loadingService: LoadingService,
              private toast: ToastController,
              private pivService: PivService) {
  }

  ngOnInit() {
    const loading = this.loadingService.showLoading();
    this.pivService.getNotification().subscribe((response) => {
      this.notifications = response;
      this.loadingService.dismissLoading(loading);
    }, async error => {
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
      this.loadingService.dismissLoading(loading);
    });
  }

  handleSeen(item: Notification) {
    this.pivService.putNotification(item.id).subscribe(response => {
      this.ngOnInit();
    }, async error => {
      const t = await this.toast.create({
        message: 'Something went wrong. Try again',
        duration: 1000
      });
      await t.present();
    });
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  doRefresh($event: any) {
    this.ngOnInit();
    $event.target.complete();
  }
}
