import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManagerCareJhipsterCompatModule } from 'app/shared/jhipster-compat/template/jhipster-compat.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ManagerCareJhipsterCompatModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ManagerCareSharedLibsModule {}
