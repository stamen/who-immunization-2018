class WuenicMasterDataProvider {
  constructor(props) {
    this.wuenicMasterData = props.wuenicMasterData.map(row => ({
      ...row,
      countryCode: row["ISOCountryCode"].toUpperCase(),
      year: parseInt(row["Year"]),
      WUENIC: parseFloat(row["WUENIC"]),
      childrenInTarget: parseInt(row["ChildrenInTarget"])
    }));
  }

  getRows() {
    return this.wuenicMasterData;
  }

  getRowsForCountryAndVaccine(countryCode, vaccine) {
    return this.wuenicMasterData.filter(
      row => row.Vaccine === vaccine && row.countryCode === countryCode
    );
  }

  getRowsForYearAndVaccine(year, vaccine) {
    return this.wuenicMasterData.filter(
      row => row.Vaccine === vaccine && row.year === year
    );
  }

  getRowForCountryYearAndVaccine(countryCode, year, vaccine) {
    return this.wuenicMasterData.find(
      row =>
        row.Vaccine === vaccine &&
        row.year === year &&
        row.countryCode === countryCode
    );
  }
}

export default WuenicMasterDataProvider;
