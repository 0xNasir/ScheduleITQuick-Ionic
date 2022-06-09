import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PivService} from "../../services/piv.service";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.page.html',
  styleUrls: ['./set-password.page.scss'],
})
export class SetPasswordPage implements OnInit {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder,
              private pivService: PivService,
              private toast: ToastController,
              private router: Router) {
  }

  ngOnInit() {
    const isChecked = localStorage.getItem('is_opt_checked');
    console.log(isChecked);
    if (isChecked !== 'true') {
      localStorage.removeItem('is_otp_checked');
      localStorage.removeItem('forget_token');
      this.router.navigateByUrl('/forget-password');
    }
    this.passwordForm = this.fb.group({
      new_password: ['', Validators.required],
      re_new_password: ['', Validators.required]
    });
  }

  submitSetPasswordForm() {
    if (this.passwordForm.valid) {
      this.pivService.setPassword(this.passwordForm.value).subscribe(async response => {
        const t = await this.toast.create({
          message: 'New password is set successfully!',
          duration: 1000
        });
        await t.present();
        localStorage.clear();
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
    }
  }
}
