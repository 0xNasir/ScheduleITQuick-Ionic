import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;

  constructor(public router: Router,
              private fb: FormBuilder,
              private loadingService: LoadingService,
              private toast: ToastController,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async loginFormSubmit() {
    if (this.loginForm.valid) {
      const loading = this.loadingService.showLoading();
      this.authService.postLogin(this.loginForm.value).subscribe(response => {
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        this.loginForm.reset();
        this.loadingService.dismissLoading(loading);
        this.router.navigateByUrl('/dashboard');
      }, async error => {
        this.loadingService.dismissLoading(loading);
        const t = await this.toast.create({
          message: error.error.detail,
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
