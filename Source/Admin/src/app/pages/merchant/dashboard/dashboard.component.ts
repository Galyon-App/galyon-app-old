/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { StoresService } from 'src/app/services/stores.service';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  dash_head = {
    totol_completed_orders: 0,
    totol__customers: 0,
    totol_active_products: 0,
    totol_reviews: 0
  };

  public lineChartLabels: Label[] = [];
  public barChartLabels: Label[] = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  public pieChartLabels: Label[] = ["CEO Quads Glow Kit", "Advance Moisturizing Kit", "Rejuvinating Facial Kit"];
  public lineChartData: ChartDataSets[] = [];
  public barChartData: ChartDataSets[] = [];
  public pieChartData: number[] = [300, 500, 100];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'grey',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    { 
      backgroundColor: 'rgba(241, 126, 124,0.3)',
      borderColor: 'rgba(241, 126, 124,1)',
      pointBackgroundColor: 'rgba(241, 126, 124,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(241, 126, 124,0.8)'
    },
    { 
      backgroundColor: 'rgba(91, 225, 75,0.3)',
      borderColor: 'rgba(91, 225, 75,1)',
      pointBackgroundColor: 'rgba(91, 225, 75,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(91, 225, 75,1)'
    },
    {
      backgroundColor: 'rgba(75, 172, 225,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(75, 172, 225,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(75, 172, 225,0.8)'
    }
  ];
  public lineChartLegend = true;


  constructor(
    public api: ApisService,
    private router: Router,
    private modalService: NgbModal,
    public util: UtilService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private storeService: StoresService
  ) {
    let owner_id = this.authService.userValue.uuid;
    this.storeService.getStoreByOwner(owner_id, (response) => {
      if(response) {
        //this.statusText = ' by ' + this.storeService.storeValue.name;
        //this.getData();
      }
    });

    for (var i = 1; i <= 30; i++) {
      this.lineChartLabels.push(i.toString());
    }

    var colabs: any[] = ['BSEI','Skinfit','Sydenham'];
    colabs.forEach(element => {
      var max: number = this.getRandomInt(100);
      var labels: any[] = [];
      for (var i = 1; i <= 30; i++) {
        labels.push(this.getRandomInt(max));
      }
      this.lineChartData.push(
        { data: labels, label: element }
      );      
    })

    var labels: any[] = [];
      for (var i = 1; i <= 12; i++) {
        labels.push(this.getRandomInt(10000));
      }
    this.barChartData.push(
      { data: labels, label: 'Sales' }
    );
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  openIt(item) {
    this.router.navigate([item]);
  }
}
