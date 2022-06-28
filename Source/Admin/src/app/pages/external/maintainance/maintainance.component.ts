import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintainance',
  templateUrl: './maintainance.component.html',
  styleUrls: ['./maintainance.component.css']
})
export class MaintainanceComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  tryAgain() {
    this.router.navigate(['/']);
  }

}
