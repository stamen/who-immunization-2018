import * as d3 from "d3";

import polioChartDataURL from "/data/polio_chart.csv";
import PolioDataProvider from "/components/PolioDataProvider";

const labelTextTransform = {
  "United States of America": "United States",
  "Syrian Arab Republic": "Syria",
  "Democratic Republic of the Congo": "DR Congo"
};

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(polioChartDataURL)]).then(function([polioChartData]) {
    const polioDataProvider = new PolioDataProvider({
      polioChartData
    });

    const color = "rgba(0,0,0,0.2)";

    const polioVacColors = {
      protectedBoth: 'green',
      protectedPartial: 'orange',
      notProtected: 'red'
    };

    const barBorderWidth = {
      country: 1
    };

    var width = 1620,
      height = 900;

    const hierarchy = polioDataProvider.getHierarchy();

    const root = d3
      .treemap()
      .size([width, height])
      .tile(d3.treemapSliceDice)
      .padding(0)(hierarchy);

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("g")
      .selectAll("rect")
      .data(root.descendants())
      .enter()
      .append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => polioVacColors[d.data.name] || color)
      .attr("stroke-width", d => barBorderWidth[d.data.name] || 0)
      .attr("stroke", 'black');

  });
});
