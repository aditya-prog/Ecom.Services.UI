import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHeaderComponent } from './nav-header/nav-header.component';



@NgModule({
  declarations: [NavHeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [NavHeaderComponent]
})
export class CoreModule { }
