class GaviCoverageDataProvider {
  constructor(props) {
    this.gaviCoverageData = props.gaviCoverageData.map(d => ({
        ...d,
        Target: +d.Target,
        Unvaccinated: +d.Unvaccinated,
        Vaccinated: +d.Vaccinated,
        Coverage: +d.Coverage,
        Year: +d.Year
    }));
  }

  getRows() {
    return this.gaviCoverageData;
  }
}

export default GaviCoverageDataProvider;
