import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PivService} from "../../services/piv.service";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-validate-token',
  templateUrl: './validate-token.page.html',
  styleUrls: ['./validate-token.page.scss'],
})
export class ValidateTokenPage implements OnInit {
  validateOTPForm: FormGroup;
  disableForm=false;
  constructor(private fb: FormBuilder,
              private pivService: PivService,
              private router: Router,
              private toast: ToastController,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.validateOTPForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  submitOTPValidationForm() {
    if (this.validateOTPForm.valid){
      this.disableForm=true;
      this.validateOTPForm.disable();
      const loading=this.loadingService.showLoading();
      this.pivService.postVerifyOTP(this.validateOTPForm.value).subscribe(response=>{
        localStorage.setItem('is_opt_checked', 'true');
        this.router.navigateByUrl('/set-password');
        this.disableForm=false;
        this.validateOTPForm.enable();
        this.loadingService.dismissLoading(loading);
      }, async error => {
        localStorage.removeItem('forget_token');
        const t=await this.toast.create({
          message: error.error.detail,
          duration: 1000
        });
        await t.present();
        await this.router.navigateByUrl('/forget-password');
        this.disableForm=false;
        this.validateOTPForm.enable();
        this.loadingService.dismissLoading(loading);
      });
    }
  }
}
