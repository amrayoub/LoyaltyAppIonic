import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, NavController, NavParams, Tabs,
  ToastController
} from 'ionic-angular';
import {Operator} from "../../model/operator";
import {QrPage} from "../qr/qr";
import {DatabaseStatsPage} from "../database-stats/database-stats";
import {Http} from "@angular/http";
import {Customer} from "../../model/customer";
import {StatsPage} from "../stats/stats";
import {ScannedPage} from "../scanned/scanned";
import {CustomerCardPage} from "../customer-card/customer-card";

/**
 * Generated class for the OperatorHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-operator-home',
  templateUrl: 'operator-home.html',
})
export class OperatorHomePage implements OnInit{
  @ViewChild('myTabs') tabs : Tabs;
  operator = new Operator();

  constructor(public navCtrl: NavController, public navParams: NavParams,private http:Http,private loadingCtrl:LoadingController,private alertCtrl:AlertController,private toastCtrl: ToastController) {
    this.operator.id=this.navParams.get('id');
    this.operator.username=this.navParams.get('username');
    this.operator.password=this.navParams.get('password');
    this.operator.access_level=this.navParams.get('access_level');
    this.operator.first_name=this.navParams.get('first_name');
    this.operator.last_name=this.navParams.get('last_name');
    this.operator.phone=this.navParams.get('phone');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OperatorHomePage');
  }

  openCamera(){
    this.navCtrl.push(QrPage);
  }

  ngOnInit(){
    console.log(this.operator);
  }

  openDatabaseStats(){
    this.navCtrl.push(DatabaseStatsPage);


  }

  openQrPage(){
    this.navCtrl.parent.select(1);
  }

  openManualAlert(){

      let prompt = this.alertCtrl.create({
        title: 'Χειροκίνητη εισαγωγή',
        message: 'Παρακαλώ εισάγεται τον κωδικό ή το τηλέφωνο του πελάτη',
        inputs: [
          {
            name: 'barcode',
            type: 'number',
            placeholder: 'Κωδικός ή τηλέφωνο'
          }
        ],
        buttons: [
          {
            text: 'Ακύρωση',
            role: 'cancel'
          },
          {
            text: 'Έλεγχος',
            handler: data => {
              console.log(data);
              this.goToScanned(data.barcode);

            }
          }
        ]
      });
      prompt.present();

  }

  openGraphs(){
    this.navCtrl.push(StatsPage);
  }

  goToScanned(barcode){

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="lds-css ng-scope">
  <div style="width:100%;height:100%" class="lds-wedges">
    <div>
      <div>
        <div></div>
      </div>
      <div>
        <div></div>
      </div>
      <div>
        <div></div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  </div>
</div>`,
      duration: 5000
    });
    loading.present();

    console.log('https://loyaltyapp.000webhostapp.com/loyalty.php?db=id755156_loyalty_db&action=customer_login&username='+barcode);
    this.http.get('https://loyaltyapp.000webhostapp.com/loyalty.php?db=id755156_loyalty_db&action=customer_login&username='+barcode)
      .map(res => res.json()).subscribe(data => {

      if (data.error != null) {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: data.message,
          buttons: [{
            text : 'Ok',
            handler: () => {
              loading.dismiss();
            }
          }]
        });
        alert.present();
      }else {
        const toast = this.toastCtrl.create({
          message: 'You logged in successfully',
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 2000
        });
        loading.dismiss();
        toast.present();
        let customer = new Customer();
          customer.id=data.id;
          customer.name=data.name;
          customer.surname=data.surname;
          customer.phone=data.phone;
          customer.barcode=data.barcode;
          customer.stamps=data.stamps;
          customer.coupons_used=data.coupons_used;
          customer.visits=data.visits;
          customer.last_visit=data.last_visit;
        this.navCtrl.push(CustomerCardPage,{customerId : customer,mode : 'scanned'});

        /*this.navCtrl.push(ScannedPage,{id:data.id,
          name:data.name,
          surname:data.surname,
          phone:data.phone,
          barcode:data.barcode,
          stamps:data.stamps,
          coupons_used:data.coupons_used,
          visits:data.visits,
          last_visit:data.last_visit});*/
      }
    });

  }
}
