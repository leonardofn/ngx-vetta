import { NgModule } from '@angular/core';
import { UpperCaseDirective } from './uppercase.directive';

@NgModule({
  declarations: [UpperCaseDirective],
  imports: [],
  exports: [UpperCaseDirective]
})
export class VetUppercaseModule {}
