import { nest } from 'd3';

class CountryTotalsDataProvider {
  constructor({dtp1Data, dtp3Data}) {

    // extracts the list of years in the dataset
    const years = new Set();
    dtp1Data.columns.forEach(k => {
      if (!isNaN(+k)) {
        years.add(k);
      }
    });

    const numericColumnList = dtp1Data.columns.filter(k => k !== 'country');

    this.yearList = Array.from(years);
    this.vaccineList = ['dtp1', 'dtp3'];

    this.rows = [
      // Adds vaccine name to every row
      ...dtp1Data.map(d => ({
          ...d,
          vaccine: 'dtp1'
      })),
      ...dtp3Data.map(d => ({
          ...d,
          vaccine: 'dtp3'
      }))
      // Converts all numeric columns to Numbers
    ].map(d => ({
      ...d,
      ...numericColumnList.reduce((acc, k) => {
        acc[k] = +d[k];
        return acc;
      }, {})
    })).filter(d => d.country !== 'Grand Total');
  }
  getRows() {
    return this.rows;
  }
  getYears() { 
    return this.yearList;
  }
}

export default CountryTotalsDataProvider;
