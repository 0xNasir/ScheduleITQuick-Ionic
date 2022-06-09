import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateTokenPage } from './validate-token.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateTokenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateTokenPageRoutingModule {}
