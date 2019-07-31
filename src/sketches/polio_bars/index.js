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

    const rows = polioDataProvider.getRows();

    var margin = { top: 80, right: 80, bottom: 80, left: 80 },
      width = 1720 - margin.left - margin.right,
      height = 900 - margin.top - margin.bottom;

    var padding = 0.1,
      outerPadding = 0.3,
      x = d3
        .scaleBand()
        .padding(0)
        .domain(polioDataProvider.getCountries())
        .range([0, width]);

    const totalExtents = d3.extent(rows, d => d.total);

    var y = d3
      .scaleLinear()
      .range([height, 0])
      .domain(totalExtents);

    const barWidthScale = d3
      .scaleLinear()
      .domain(totalExtents)
      .range([0, x.bandwidth()]);

    var xAxis = d3
      .axisBottom()
      .tickFormat(d => {
        return labelTextTransform[d] || d;
      })
      .scale(x);

    var yAxis = d3.axisLeft().scale(y);

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draws x axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Draws y axis
    svg.append("g").call(yAxis);

    const barWidth = d => barWidthScale(d.total);

    const barx = d => x(d.country) + 0.5 * x.bandwidth() - 0.5 * barWidth(d);

    // Draws bars
    const outerBars = svg
      .selectAll(".bar")
      .data(rows)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", barx)
      .attr("width", barWidth)
      .attr("y", d => y(d.total))
      .attr("height", d => height - y(d.total));

    outerBars
      .append("rect")
      .attr("x", barx)
      .attr("width", barWidth)
      .attr("y", d => y(d.protectedBoth))
      .attr("height", d => height - y(d.protectedBoth));
  });
});
