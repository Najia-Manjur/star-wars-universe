import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule} from 'ngx-bootstrap/pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListCharactersComponent } from './list-characters/list-characters.component';
import { ListFilmsComponent } from './list-films/list-films.component';

@NgModule({
  declarations: [
    AppComponent,
    ListCharactersComponent,
    ListFilmsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
