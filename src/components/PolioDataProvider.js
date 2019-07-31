import { descending, hierarchy } from "d3";

class PolioDataProvider {
  constructor(props) {
    this.rows = props.polioChartData
      .map(d => ({
        total: +d["Denominator"],
        protectedBoth: +d["Protected with Pol3 and IPV1 absolute"],
        protectedPartial: +d["Only Pol 3 absolute"],
        notProtected: +d["Not protected with Pol 3 absolute"],
        protectedBothPercentage: +d["Protected with Pol3 and IPV1 percentage"],
        country: d.country
      }))
      .filter(d => d.country !== "")
      .sort((a, b) =>
        descending(a.protectedBothPercentage, b.protectedBothPercentage)
      );

    this.countries = this.rows.reduce(function(countries, d) {
      countries.push(d.country);
      return countries;
    }, []);

    this.hierarchy = hierarchy(
      {
        children: this.rows.map(d => ({
          children: [
            {
              name: "protectedBoth",
              total: d.protectedBoth
            },
            {
              name: "protectedPartial",
              total: d.protectedPartial
            },
            {
              name: "notProtected",
              total: d.notProtected
            }
          ],
          name: "country"
        }))
      },
      d => d.children
    ).sum(d => d.total);

    console.log("this.hierarchy");
    console.log(this.hierarchy);
  }
  getRows() {
    return this.rows;
  }
  getHierarchy() {
    return this.hierarchy;
  }
  getCountries() {
    return this.countries;
  }
}

export default PolioDataProvider;
