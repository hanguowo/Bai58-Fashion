import { NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FashionHomeComponent } from './fashion-home/fashion-home.component';
import { FashionDetailComponent } from './fashion-detail/fashion-detail.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [App, FashionHomeComponent, FashionDetailComponent, SafeHtmlPipe],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
  ],
  bootstrap: [App],
})
export class AppModule {}
