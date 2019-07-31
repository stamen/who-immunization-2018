import { descending } from 'd3';

class UnvaxByCountryDataProvider {
  constructor(props) {
    this.unvaxByCountryData = props.unvaxByCountryData
      .map(d => ({
        Country: d["Row Labels"],
        SumUnvaccinated: +d["Sum of Unvaccinated"],
        Coverage: +d["Sum of coverage"],
        SumVaccinated: +d["Sum of vaccinated"],
        total: +d["Sum of Unvaccinated"] + +d["Sum of vaccinated"] 
      }))
      .filter(d => d.Country !== "" && d.Country !== "Grand Total");

    console.log("this.unvaxByCountryData");
    console.log(this.unvaxByCountryData);
  }

  getRows() {
    return this.unvaxByCountryData;
  }

  getTopUnvaccinated(n) {
    return this.unvaxByCountryData
      .sort((a, b) => descending(a.SumUnvaccinated, b.SumUnvaccinated))
      .slice(0, n);
  }
}

export default UnvaxByCountryDataProvider;
