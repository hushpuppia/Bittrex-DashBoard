import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'btcTicker'
})
export class BtcTickerPipe implements PipeTransform {


  transform(ticker: any): any {
    // console.log(ticker);
    let tickerBTC = [];
    let i = 0;
    for (let it in ticker) {
      if (ticker[it].BaseCurrency == 'BTC') {
        tickerBTC[i] = {}
        tickerBTC[i].coin = it;
        tickerBTC[i].price = ticker[it].Last;
        tickerBTC[i].coinname = ticker[it].coinname;
        i = i + 1;
      }
    }
    return tickerBTC;
  }

}
