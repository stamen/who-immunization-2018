class MeaslesDataProvider {
  constructor({measlesSlopeUpData, measlesSlopeDownData, measlesData}) {
    this.slopeUpRows = measlesSlopeUpData.map(d => ({
        country: d.Country,
        startPercent: +d['2010'],
        endPercent: +d['2018'],
    }))

    this.slopeDownRows = measlesSlopeDownData.map(d => ({
        country: d.country,
        startPercent: +d['Max 2010-2017'],
        endPercent: +d['2018']
    }));

    this.rows = measlesData.filter(d => d['2010'] !== "" && d['2018'] !== "").map(d => ({
        country: d.country,
        startPercent: +d['2010'],
        endPercent: +d['2018']
    }));
  }
  getRows() {
    return this.rows;
  }
  getSlopeUpRows() {
    return this.slopeUpRows;
  }
  getSlopeDownRows() {
    return this.slopeDownRows;
  }
}

export default MeaslesDataProvider;
