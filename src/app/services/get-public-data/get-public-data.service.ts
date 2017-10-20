import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GetPublicDataService {

  ticker: any;
  tickerView: any;
  tickerBTC = [];
  columns;
  timer;
  i: number = 0;
  dataChannel: any;
  currencyInfo: any;
  marketInfo: any;

  api = {
    'ticker': 'https://bittrex.com/api/v1.1/public/getticker',
    'markets': 'https://bittrex.com/api/v1.1/public/getmarkets',
    'market24h': 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
    'orderBook': {
      'base': 'https://poloniex.com/public?command=returnOrderBook',
      'param':
      [
        'currencyPair',
        'depth'
      ]
    },
    'currencyList': 'https://bittrex.com/api/v1.1/public/getcurrencies',
    'chartData': {
      'base': 'https://bittrex.com/Api/v2.0/pub/market/GetTicks?',
      'param': [
        'currencyPair',
        'start',
        'end',
        'period'
      ]
    }
  };

  constructor(private http: Http) {
    this.dataChannel = {
      'tickerView': {},
      'chartView': {},
      'progress': 0,
      'marketsAvailable': false,
      'tickerViewFlag': false,
      'tickerProgress': 0,
      'chartProgress': 0
    };
    this.getCurrencies()
      .subscribe(data => {
        this.currencyInfo = data;
      });
    this.getMarkets()
      .subscribe(data => {
        this.marketInfo = data;
        this.dataChannel.marketsAvailable = true;
      });
    this.ticker = {};
  }

  getCurrencies() {
    return this.http.get(this.api.currencyList)
      .map(res => res.json().result)
  }

  getMarkets() {
    return this.http.get(this.api.markets)
      .map(res => res.json().result);
  }

  getTickerData() {
    this.dataChannel.tickerProgress = 0;
    if (this.dataChannel.marketsAvailable) {
      let i = this.marketInfo.length;
      const l = i;
        for (let it in this.marketInfo) {
        let coin = this.marketInfo[it];
        let url = this.api.ticker + '?market=' + coin.BaseCurrency + '-' + coin.MarketCurrency;
        if (coin.BaseCurrency == 'BTC') {
          this.http.get(url)
            .map(res => res.json().result)
            .subscribe(data => {
              i = i - 1;
              // console.log(coin.MarketCurrency);
              this.dataChannel.tickerProgress = parseFloat(((1 - i / l) * 100).toFixed(2));
              // console.log(i);
              if (data) {
                this.ticker[coin.MarketCurrency] = data;
                // console.log(data);  
                this.ticker[coin.MarketCurrency]['coinname'] = this.marketInfo[it]['MarketCurrencyLong'];
                this.ticker[coin.MarketCurrency]['MarketCurrency'] = this.marketInfo[it]['MarketCurrency'];
                this.ticker[coin.MarketCurrency]['BaseCurrency'] = this.marketInfo[it]['BaseCurrency'];
                if (i == 0) {
                  this.dataChannel.tickerView = this.ticker;
                  this.dataChannel.tickerViewFlag = true;
                  console.log('up');
                }
              }
            });
        }
        else {
          i = i - 1;
        }
      }
      this.http.get(this.api.market24h)
        .map(res => res.json())
        .subscribe(data => {
          // console.log(data);
        });
      // for (let it in this.marketInfo) {

      // }
    }
    else {
      setTimeout(this.getTickerData(), 1000);
      console.log('wait');
    }
  }

  getChartData() {
    this.dataChannel.chartProgress = 0;
    let g = Object.keys(this.dataChannel.tickerView).length;
    console.log(g);
    const h = g;
    let chartView = {};
    for (let it in this.dataChannel.tickerView) {
      let coin = this.dataChannel.tickerView[it];
      let interval = + new Date();
      let url = this.api.chartData.base + 'marketName=' + coin['BaseCurrency'] + '-' + coin['MarketCurrency'] + '&tickInterval=fiveMin&_=' + interval;
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          g = g - 1;
          this.dataChannel.chartProgress = ((1 - (g / h)) * 100).toFixed(2);
          let l = data.result.length;
          chartView[coin['MarketCurrency']] = data.result.slice(l - 60, l);
          if (g == 0) {
            this.dataChannel.chartView = chartView;
            console.log('done');
          }
        });
    }
  }
}
