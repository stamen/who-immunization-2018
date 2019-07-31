class HPVDataProvider {
  constructor(props) {
    console.log("props.hpvData");
    console.log(props.hpvData);
    this.hpvData = props.hpvData.map(d => {
      const p = parseFloat(d['value']);
      return (
        {
          countryCode: d['iso3code'],
          latestPercent: isNaN(p) ? p : p / 100.0
        }
      );
    });

    this.hpvDataByCountry = this.hpvData.reduce((hpvDataByCountry, d) => {
      const {countryCode} = d;
      if (!hpvDataByCountry.hasOwnProperty(countryCode)) {
        hpvDataByCountry[countryCode] = d;
      }
      return hpvDataByCountry;
    }, {});
  }
  getRows() {
    return this.hpvData;
  }
  getDataForCountry(countryCode) {
    return this.hpvDataByCountry[countryCode];
  }
}

export default HPVDataProvider;
