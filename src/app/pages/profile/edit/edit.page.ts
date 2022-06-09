import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {PivService} from '../../../services/piv.service';
import {Profile} from '../../../models/profile';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {MapsAPILoader} from '@agm/core';
import {LoadingService} from "../../../services/loading.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, AfterViewInit {
  public geoCoder;
  public address = '';
  profile: Profile;
  form: FormGroup;
  lat = 23.7805733;
  lng = 90.2792396;
  zoom = 7;
  loaded = false;

  constructor(public pivService: PivService,
              private fb: FormBuilder,
              private router: Router,
              private mapsAPILoader: MapsAPILoader,
              private loadingService: LoadingService,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    const loading = this.loadingService.showLoading();
    this.loaded = false;
    this.pivService.getProfile().subscribe((response) => {
      this.form = this.fb.group({
        user: this.fb.group({
          first_name: [response.user.first_name],
          last_name: [response.user.last_name],
          email: [response.user.email]
        }),
        address: this.fb.group({
          place: [response.address.place],
          latitude: [response.address.latitude],
          longitude: [response.address.longitude]
        }),
        phone_number: [response.phone_number],
        available: [response.available],
        country: [response.country],
        zip_code: [response.zip_code],
        city: [response.city],
        state: [response.state]
      });
      this.loaded = true;
      this.lat=Number(response.address.latitude);
      this.lng=Number(response.address.longitude);
      this.loadingService.dismissLoading(loading);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        if (this.form.value.address.place === '') {
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
            this.form.get('address').get('place').setValue(d.value);
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.form.get('address').patchValue({
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

  changeAvail($event: any) {
    this.form.value.available = $event.target.checked;
  }

  saveForm() {
    if (this.form.valid) {
      this.pivService.putProfile(this.form.value).subscribe(response => {
        this.form.reset();
        this.router.navigateByUrl('/dashboard/profile');
      });
    }
  }

  reLocateAddress($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({location: {lat: latitude, lng: longitude}}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.form.get('address').patchValue({
            place:results[0].formatted_address,
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
