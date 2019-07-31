import { lookupCountryCode } from "/components/countryUtils";

class CancerDataProvider {
  constructor(props) {
    this.rows = props.cancerData
      .filter(d => d.COUNTRY !== "")
      .map(d => ({
        cancer: d.CANCER,
        country: d.COUNTRY,
        asr: +d["ASR(W)"],
        countryCode: lookupCountryCode(d.COUNTRY)
      }));
  }
  getRowForCountryAndCancer(countryCode, cancer) {
    return this.rows.filter(d => d.countryCode === countryCode).find(d => d.cancer === cancer);
  }
  getRows() {
    return this.rows;
  }
}

export default CancerDataProvider;
