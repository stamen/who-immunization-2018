class HealthWorkerDataProvider {
  constructor(props) {
    const { healthWorkerData } = props;

    this.healthWorkerData = healthWorkerData.map(row => ({
      year: parseInt(row["YEAR (code)"]),
      countryCode: row["COUNTRY (code)"],
      nursingMidwiferyPerPop: parseFloat(row["HWF_0006 (numeric)"]),
      nursingMidwiferyTotal: parseFloat(row["HWF_0007 (numeric)"])
    }));
  }

  getHealthWorkerPerPopForCountry(countryCode) {
    return this.healthWorkerData.filter(
      row =>
        row.countryCode === countryCode && !isNaN(row.nursingMidwiferyPerPop)
    );
  }

  getHealthWorkerTotalForCountry(countryCode) {
    return this.healthWorkerData.filter(
      row => row.countryCode === countryCode && !isNaN(row.nursingMidwiferyTotal)
    );
  }
}

export default HealthWorkerDataProvider;
