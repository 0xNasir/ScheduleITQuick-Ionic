import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfZMROVvS1ERwChhxgnSsQPLIUheRAcwY',
      libraries: ['places']
    })
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
