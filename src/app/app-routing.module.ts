import { ListFilmsComponent } from './components/list-films/list-films.component';
import { ListCharactersComponent } from './components/list-characters/list-characters.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/characters/1', pathMatch: 'full' },
  { path: 'characters/:currentPage', component: ListCharactersComponent },
  { path: 'characters/:id/:name', component: ListFilmsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
