import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-main-modal',
  templateUrl: './main-modal.page.html',
  styleUrls: ['./main-modal.page.scss'],
})
export class MainModalPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
      this.modalCtrl.dismiss();
  }

}
