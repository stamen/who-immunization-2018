import { ascending } from 'd3';

class FragileBubbleDataProvider {
  constructor({fragileCountryBubbleData}) {
    this.rows = fragileCountryBubbleData.map(d => ({
        country: d.Country,
        status: d.Status,
        unvaccinated: +d.Unvaccinated,
        dtp3: +d.dtp3
    })).sort((a, b) => ascending(a.unvaccinated, b.unvaccinated));
  }

  getRows () {
    return this.rows;
  }
}

export default FragileBubbleDataProvider;
