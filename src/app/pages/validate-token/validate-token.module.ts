import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ValidateTokenPageRoutingModule} from './validate-token-routing.module';

import {ValidateTokenPage} from './validate-token.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ValidateTokenPageRoutingModule
  ],
  declarations: [ValidateTokenPage]
})
export class ValidateTokenPageModule {
}
