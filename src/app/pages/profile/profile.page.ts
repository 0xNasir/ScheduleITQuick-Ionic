import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PivService} from '../../services/piv.service';
import {Profile} from '../../models/profile';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  openModal = false;
  changePasswordForm: FormGroup;

  constructor(public router: Router,
              public pivService: PivService,
              public toast: ToastController,
              private loadingService: LoadingService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.profile = null;
    const loading = this.loadingService.showLoading();
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      re_new_password: ['', Validators.required]
    });
    this.pivService.getProfile().subscribe((response) => {
      this.profile = response;
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

  goToEditProfile() {
    this.router.navigateByUrl('dashboard/profile/edit');
  }

  logMeOut() {
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  closeModal() {
    this.changePasswordForm.reset();
    this.openModal = false;
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  async submitChangePasswordForm() {
    if (this.changePasswordForm.valid) {
      this.pivService.postChangePassword(this.changePasswordForm.value).subscribe(async response => {
        const t = await this.toast.create({
          message: response.detail,
          duration: 1000
        });
        await t.present();
        localStorage.clear();
        this.openModal = false;
        await this.router.navigateByUrl('/');
      }, async error => {
        let er = '';
        for (let [key, value] of Object.entries(error.error)) {
          er = value[0];
        }
        const t = await this.toast.create({
          message: er,
          duration: 1000
        });
        await t.present();
      });
    } else {
      const t = await this.toast.create({
        message: 'Invalid input',
        duration: 1000
      });
      await t.present();
    }
  }
}
