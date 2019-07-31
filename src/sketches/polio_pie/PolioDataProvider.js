import { lookup } from "country-data";


const countryCodeMap = {
  "Democratic Republic of the Congo": "COD"
};

class PolioDataProvider {
  constructor(props) {
    console.log("props.polioData");
    console.log(props.polioData);
    this.polioData = props.polioData.map(d => {
      let countryCode = countryCodeMap[d.Country];

      if (!countryCode) {
        const countryInfo = lookup.countries({ name: d.Country });
        if (countryInfo.length === 0) {
          throw new Error(`Country ${d.Country} not found...`);
        } else {
          countryCode = countryInfo[0].alpha3;
        }
      }

      return ({
        country: d.Country,
        countryCode,
        notProtected: parseFloat(d["Not protected"]),
        bothOPVAndIPV: parseFloat(d["Protected with 3 doses of OPV and 1 dose of IPV"]),
        onlyOPV: parseFloat(d["Protected with 3 doses of OPV, but not IPV"])
      });
    });
    console.log("this.polioData");
    console.log(this.polioData);
  }
  getRows() {
    return this.polioData;
  }
}

export default PolioDataProvider;
