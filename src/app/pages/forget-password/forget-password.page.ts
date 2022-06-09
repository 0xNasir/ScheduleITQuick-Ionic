import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {PivService} from '../../services/piv.service';
import {Router} from '@angular/router';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  forgetPasswordForm: FormGroup;
  disableForm = false;

  constructor(private fb: FormBuilder,
              private pivService: PivService,
              private router: Router,
              private loadingService: LoadingService,
              private toast: ToastController) {
  }

  ngOnInit() {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async submitRequestForForgetPassword() {
    if (this.forgetPasswordForm.invalid) {
      const t = await this.toast.create({
        message: 'Invalid input',
        duration: 1000
      });
      await t.present();
      this.disableForm = false;
    } else {
      this.disableForm = true;
      this.forgetPasswordForm.disable();
      const loading = this.loadingService.showLoading();
      this.pivService.postForgetPassword(this.forgetPasswordForm.value).subscribe(response => {
        localStorage.setItem('forget_token', response.token);
        this.router.navigateByUrl('/validate-token');
        this.disableForm = false;
        this.loadingService.dismissLoading(loading);
      }, async error => {
        const t = await this.toast.create({
          message: error.error.detail,
          duration: 1000
        });
        await t.present();
        this.disableForm = false;
        this.forgetPasswordForm.enable();
        this.loadingService.dismissLoading(loading);
      });
    }
  }
}
