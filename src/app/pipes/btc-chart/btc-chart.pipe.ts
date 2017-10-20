import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'btcChart'
})
export class BtcChartPipe implements PipeTransform {

  transform(chart: any, args?: any): any {
    let chartBTC = [];

    let i = 0;
    for (let it in chart) {
      let l = chart[it].length; 
      // console.log(l);
      chartBTC[i] = {};
      chartBTC[i].coin = it;
      // console.log(it);
      let volsum = 0;
      for (let j = 0; j < l; ++j) {
        volsum += chart[it][l - j - 1].V;
      }
      chartBTC[i].volume5min = chart[it][l - 1].V;
      chartBTC[i].volspike5min = parseFloat(((chart[it][l - 1].V / volsum) * 600).toFixed(2));
      let volsum15min = 0;
      for (let j = 0; j < 3; ++j) {
        volsum15min += chart[it][l - j - 1].V;
      }
      chartBTC[i].volume15min = volsum15min;
      chartBTC[i].volspike15min = parseFloat(((volsum15min / volsum) * 200).toFixed(2));
      console.log(chartBTC[i]);
      i = i + 1;
    }
    return chartBTC

  }

}
