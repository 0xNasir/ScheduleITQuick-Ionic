import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IonContent, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Inbox} from '../../../models/inbox';
import {PivService} from '../../../services/piv.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Profile} from '../../../models/profile';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild('scrollElement') content: IonContent;
  public chats: Inbox[];
  chatForm: FormGroup;
  currentUser: Profile;
  chatUser: string;
  submitted = false;

  constructor(private fb: FormBuilder,
              private pivService: PivService,
              public router: Router,
              private toast: ToastController,
              private activeRouter: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    this.activeRouter.params.subscribe(params => {
      this.chatUser = params.username;
      this.pivService.retrieveMessage(params.username).subscribe((response: Inbox[]) => {
        this.chats = response;
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
      });
    });
    this.pivService.getProfile().subscribe(res => {
      this.currentUser = res;
    });
    this.chatForm = this.fb.group({
      text: ['', Validators.required],
      user: [this.chatUser, Validators.required]
    });
    setTimeout(() => {
      this.updateScroll();
    }, 50);
  }

  ngOnInit() {
  }

  submitChat(): any {
    if (this.chatForm.valid) {
      if (this.submitted === false) {
        this.submitted = true;
        this.pivService.postMessage(this.chatForm.value, this.chatUser).subscribe(res => {
          this.submitted = false;
          this.chatForm.get('text').setValue('');
          this.chats.push(res);
          setTimeout(() => {
            this.updateScroll();
          }, 50);
        }, error => {
          this.submitted = false;
        });
      }
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.updateScroll();
    }, 50);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.updateScroll();
    }, 50);
  }

  private updateScroll() {
    this.content.scrollToBottom(0);
  }


}
