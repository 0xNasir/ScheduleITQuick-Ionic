import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CalendarDay} from 'ion2-calendar';
import {PivService} from '../../services/piv.service';
import * as moment from 'moment';
import {BlockDays} from '../../models/block-days';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../services/loading.service';
import {CalendarModalOptions} from 'ion2-calendar/dist/calendar.model';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  form: FormGroup;
  openModal = false;
  cDate = moment(new Date()).format('YYYY-MM-DD');
  serverData: BlockDays[];
  date: string[];
  type: 'string';
  loadedData = false;
  optionsMulti: CalendarModalOptions = {
    pickMode: 'multi',
    color: 'danger',
    disableWeeks: [],
    canBackwardsSelected: true
  };

  constructor(private pivService: PivService,
              private loadingService: LoadingService,
              private toast: ToastController,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.loadedData = false;
    this.date = [];
    const loading = this.loadingService.showLoading();
    this.pivService.getBlockDays().subscribe((response) => {
      this.serverData = response;
      response.forEach(res => {
        this.date.push(res.date.toString());
      });
      this.loadedData = true;
      this.loadingService.dismissLoading(loading);
    }, async error => {
      this.loadedData = true;
      this.loadingService.dismissLoading(loading);
      const t = await this.toast.create({
        message: 'Something went wrong. Refresh by swiping',
        duration: 1000
      });
      await t.present();
    });
  }

  myfunc($event: CalendarDay) {
    this.cDate = moment(new Date($event.time)).format('YYYY-MM-DD');
    const d = this.serverData.find(pred => pred.date === this.cDate);
    if (d === undefined) {
      this.form = this.fb.group({
        id: null,
        title: ['', Validators.required],
        date: this.cDate
      });
    } else {
      this.form = this.fb.group({
        id: d.id,
        title: [d.title, Validators.required],
        date: d.date
      });
    }
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
    this.ngOnInit();
  }

  submitLeaveReason() {
    if (this.form.valid) {
      if (this.form.value.id == null) {
        delete this.form.value.id;
        this.pivService.postBlockDays(this.form.value).subscribe(res => {
          this.ngOnInit();
          this.openModal = false;
        });
      } else {
        this.pivService.putBlockDays(this.form.value).subscribe(res => {
          this.ngOnInit();
          this.openModal = false;
        });
      }
    }
  }

  deleteLeaveReason(id) {
    this.pivService.deleteBlockDays(id).subscribe(res => {
      this.ngOnInit();
      this.openModal = false;
    }, error => {
      this.openModal = false;
      if (error.status === 401) {
        localStorage.clear();
        this.router.navigateByUrl('/login');
      }
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
