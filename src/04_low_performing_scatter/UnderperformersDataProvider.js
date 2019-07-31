class UnderperformersDataProvider {
  constructor({underperformersData}) {
    this.rows = underperformersData.map(d => ({
        dtp3: +d['2018 dtp3'],
        countryCode: d['Country'],
        country: d['Name'],
        growth: +d['Projected growth by 20130'] * 100
    }));
  }

  getRows() {
    return this.rows;
  }
}

export default UnderperformersDataProvider;
