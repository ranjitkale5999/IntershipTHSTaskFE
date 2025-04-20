import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddstudComponent } from './StudentReactiveFrom/addstud/addstud.component';
import { ListstudComponent } from './StudentReactiveFrom/liststud/liststud.component';
import { UpdatestudComponent } from './StudentReactiveFrom/updatestud/updatestud.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'r-addstud', component: AddstudComponent},
  {path: 'home', component: ListstudComponent},
  {path:'studUpdate/:id',component: UpdatestudComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
