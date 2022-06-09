import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {PivService} from '../../services/piv.service';
import {ToastController} from '@ionic/angular';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, AfterViewInit {
  signupForm: FormGroup;
  public geoCoder;
  public address = '';
  lat = 23.7805733;
  lng = 90.2792396;
  zoom = 7;
  disableForm=false;
  constructor(public router: Router,
              public pivService: PivService,
              private fb: FormBuilder,
              private ngZone: NgZone,
              private toastController: ToastController,
              private loadingService: LoadingService,
              private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      user: this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        password2: ['', Validators.required]
      }),
      address: this.fb.group({
        place: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required]
      }),
      phone_number: ['', Validators.required],
      available: [''],
      country: ['US'],
      zip_code: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  async registerFormSubmit() {
    if (this.signupForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Invalid input',
        duration: 1000
      });
      await toast.present();
    } else {
      if (this.signupForm.value.user.password!==this.signupForm.value.user.password2){
        const toast = await this.toastController.create({
          message: 'Both password should be same',
          duration: 1000
        });
        await toast.present();
      }else{
        this.disableForm=true;
        this.signupForm.disable();
        const loading=this.loadingService.showLoading();
        this.pivService.postRegister(this.signupForm.value).subscribe(async response => {
          const t = await this.toastController.create({
            message: 'Registration successfully completed',
            duration: 1000
          });
          await t.present();
          await this.router.navigateByUrl('/');
          this.disableForm=false;
          this.signupForm.enable();
          this.loadingService.dismissLoading(loading);
        }, async error => {
          let err = '';
          for (let [key, value] of Object.entries(error.error)) {
            err = value[0];
          }
          const t = await this.toastController.create({
            message: err,
            duration: 1000
          });
          await t.present();
          this.disableForm=false;
          this.signupForm.enable();
          this.loadingService.dismissLoading(loading);
        });
      }
    }
  }

  changeAvail($event: any) {
    this.signupForm.get('available').setValue($event.target.checked);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        if (this.signupForm.value.address.place === '') {
          this.setCurrentLocation();
        }
        this.geoCoder = new google.maps.Geocoder();
        const d = document.getElementById('addrss').getElementsByTagName('input')[0];
        const autocomplete = new google.maps.places.Autocomplete(d, {types: ['address']});
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.signupForm.get('address').get('place').setValue(d.value);
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.signupForm.get('address').patchValue({
              place: d.value,
              latitude: this.lat,
              longitude: this.lng
            });
            this.zoom = 8;
          });
        });
      });
    }, 2000);
  }

  // Get Current Location Coordinates
  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  reLocateAddress($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({'location': {lat: latitude, lng: longitude}}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.signupForm.get('address').patchValue({
            place: results[0].formatted_address,
            longitude,
            latitude
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
}
