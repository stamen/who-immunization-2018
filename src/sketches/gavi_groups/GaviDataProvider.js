const HIGH_INCOME_STATUSES = ["high income: nonoecd", "high income: oecd"];

class GaviDataProvider {
  constructor(props) {
    this.gaviData = props.gaviData.map(d => {
      let income_status = d.income_status;
      if (HIGH_INCOME_STATUSES.includes(d.income_status)) {
        income_status = "high income";
      }
      return {
        ...d,
        sum_unvaccinated: +d.sum_unvaccinated,
        gavi_status: d.gavi_status.replace("-", ""),
        income_status
      };
    });
  }
  getRows() {
    return this.gaviData;
  }
}

export default GaviDataProvider;
