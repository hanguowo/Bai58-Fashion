import { NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FashionListComponent } from './fashion-list/fashion-list.component';
import { FashionDetailComponent } from './fashion-detail/fashion-detail.component';
import { FashionFormComponent } from './fashion-form/fashion-form.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [
    App,
    FashionListComponent,
    FashionDetailComponent,
    FashionFormComponent,
    SafeHtmlPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, CKEditorModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
  ],
  bootstrap: [App],
})
export class AppModule {}
