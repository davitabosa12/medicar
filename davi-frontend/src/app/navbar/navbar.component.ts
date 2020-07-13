import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string;
  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.username = this.auth.username;
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/']); // vai para tela de login.
  }

}
