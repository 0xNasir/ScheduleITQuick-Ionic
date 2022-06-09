import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {
  }
  async showLoading(){
    const loading=this.loadingController.create({
      message: 'Loading...',
      showBackdrop:true
    });
    await (await loading).present();
    return loading;
  }
  dismissLoading(loading) {
    loading.then(load => {
      load.dismiss();
    });
  }
}
