import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BtcTickerPipe } from '../pipes/btc-ticker/btc-ticker.pipe'
import { BtcChartPipe } from '../pipes/btc-chart/btc-chart.pipe'
import { GetPublicDataService } from '../services/get-public-data/get-public-data.service'
import { RoundPipe } from '../pipes/math/round/round.pipe';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css'],
  providers: [BtcTickerPipe, BtcChartPipe]
})
export class TickerComponent implements OnInit {

  tickerView: any;
  tickerBTC = [];
  columns;
  timer: Observable<any> = Observable.timer(0, 1000);
  i: number = 0;
  dataChannel;
  currencyInfo: any;
  date;
  message;

  constructor(private http: Http, private getData: GetPublicDataService, private btcTicker: BtcTickerPipe) {
    this.dataChannel = this.getData.dataChannel;
    this.dataChannel.chartFlag = true;
    this.dataChannel.marketsAvailable = false;
    this.dataChannel.durationActive = 7200;
  }

  ngOnInit() {
    // this.getTicker();
    this.date = Math.round((new Date()).getTime() / 1000);
    this.date = this.date - this.date % 300;
    // setInterval(() => this.getChartData(), 1000);
  }

  getTicker() {
    console.log('tick');
  }

  getTickerData() {
    this.getData.getTickerData();
  }

  stopDashboard() {
    this.timer = null;
  }

  getChartData() {
    if (this.dataChannel.tickerViewFlag == false) {
      this.message = 'Please refresh ticker first';
    }
    else {
      this.message = null;
      console.log(this.dataChannel.tickerViewFlag);
      this.getData.getChartData();
    }
  }
}
