class RankingChartDataProvider {
  constructor(props) {
    this.rows = props.rankingChartData.map(d => ({
        country: d['Row Labels'],
        total: +d['Surviving Infants'],
        noDTP3: +d['No DTP3'],
        noDTP1: +d['No DTP1'],
        wuenic: +d['Sum of WUENIC']
    })).filter(d => d.country !== '');
  }
  getRows () {
    return this.rows;
  }
}

export default RankingChartDataProvider;
