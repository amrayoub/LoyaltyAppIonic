import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import { Chart } from 'chart.js';
import {MyLinks} from "../../services/mylinks";
import {Http} from "@angular/http";
import {PieChartForm} from "../../model/piechartForm";

/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {


  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  barChart: any;
  doughnutChart: any;
  lineChart: any;
  title:any;



  constructor(private actionSheetCtrl:ActionSheetController,private ml: MyLinks,public navCtrl: NavController, public navParams: NavParams,private http:Http,private loadingCtrl:LoadingController,private alertCtrl:AlertController,private toastCtrl: ToastController) {
  }

  pieChartForm = new PieChartForm();

  pieChartSettings(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort Filter',
      buttons: [
        {
          text: 'Today',
          role: 'destructive',
          handler: () => {

            this.makeTheCall('2017-11-08','true','Today');
          }
        },{
          text: 'Yesterday',
          handler: () => {
            this.makeTheCall('2017-11-07','true','Yesterday');
          }
        },{
          text: 'Last week',
          handler: () => {
            this.makeTheCall('2017-01-01','false','Last week');
          }
        },{
          text: 'Last month',
          handler: () => {
            this.makeTheCall('2017-01-01','false','Last month');
          }
        },{
          text: 'Last 6 months',
          handler: () => {
            this.makeTheCall('2017-01-01','false','Last 6 months');
          }
        },{
          text: 'Last year',
          handler: () => {
            this.makeTheCall('2017-01-01','false','Last year');
          }
        },{
          text: 'All Time',
          handler: () => {
            this.makeTheCall('2017-01-01','false','All Time');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }


  makeTheCall(date : string, equality : string,title : string){
    this.title=title;
    const loading = this.loadingCtrl.create({
      content : 'Please wait..'
    });
    loading.present();

    console.log(this.ml.base+this.ml.a_get_pie_chart+'&date='+date+'&equality='+equality);
    this.http.get(this.ml.base+this.ml.a_get_pie_chart+'&date='+date+'&equality='+equality)
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
        loading.dismiss();

        this.pieChartForm = new PieChartForm();
        for(var i=0;i<data.results.length;i++){
          this.pieChartForm.names.push(data.results[i].name);
          this.pieChartForm.counts.push(data.results[i].count);
          this.pieChartForm.getRandomColor();
        }
        this.startPieChart(title);
      }
    });

  }

  ionViewDidLoad() {

    this.makeTheCall("2016-11-01","false",'All Time');

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],


          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }

    });



    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
          }
        ]
      }

    });

  }

  startPieChart(selected : string){
    this.title = selected;
    if(this.doughnutChart!=null)
      this.doughnutChart.destroy();
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: this.pieChartForm.names,
        datasets: [{
          label: '% of coupons used',
          data: this.pieChartForm.counts,
          backgroundColor: this.pieChartForm.colors,
          hoverBackgroundColor: this.pieChartForm.hover_colors
        }]
      },
      options : {
        animation: {
          duration : 3000
        }
      }

    });
  }


}
