class SubnationalDataProvider {
  constructor({ subnationalData }) {
    this.rows = subnationalData
      .filter(
        d =>
          d.Coverage !== "-2222" &&
          d.Denominator !== "0" &&
          d.Denominator !== "-2222"
      )
      .map(d => ({
        year: +d.Year,
        country: d.CountryName,
        countryCode: d.iso,
        vaccine: d.Vaccine,
        coverage: +d.Coverage,
        denominator: +d.Denominator,
        admin1: d.Admin1,
        admin2: d.Admin2
      }));

    console.log("this.rows");
    console.log(this.rows);
  }
  getRows() {
    return this.rows;
  }
  getRowsForYearAndVaccine({ year, vaccine }) {
    return this.rows.filter(
      d => d.year === year && d.vaccine === vaccine.toUpperCase()
    );
  }
}

export default SubnationalDataProvider;
