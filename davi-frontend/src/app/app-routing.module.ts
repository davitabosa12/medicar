import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component'
import { CadastroComponent } from './cadastro/cadastro.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConsultaCreateComponent } from './consulta-create/consulta-create.component';
import { AuthMiddlewareService } from './auth-middleware.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthMiddlewareService] },
  { path: 'marcarConsulta', component: ConsultaCreateComponent, canActivate:[AuthMiddlewareService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
