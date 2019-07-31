import * as d3 from "d3";

import fragileCountryBubbleDataURL from "/data/fragile_country_bubbles.csv";

import FragileBubbleDataProvider from "./FragileBubbleDataProvider";

import { addSVGDownloadLinkBeneath } from '/components/renderHelpers';

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(fragileCountryBubbleDataURL)]).then(function([
    fragileCountryBubbleData
  ]) {
    const fragileBubbleDataProvider = new FragileBubbleDataProvider({
      fragileCountryBubbleData
    });

    const data = fragileBubbleDataProvider.getRows();

    const height = 1280,
      width = 2048,
      margin = { top: 100, right: 100, bottom: 100, left: 100 },
      chartWidth = width - margin.left - margin.right,
      chartHeight = height - margin.top - margin.bottom;
    const plotSVG = d3
      .select("body")
      .append("svg")
      .attr("height", height)
      .attr("width", width);
    plotSVG.style("font-family", "sans-serif").style("font-size", "24px");

    const legendContainer = plotSVG
      .append("g")
      .attr("transform", `translate(25,25)`);

    const x = d => d.dtp3;
    const xscale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, chartWidth]);

    const statuses = ["Fragile", "Polio", "Others"];
    const statusColors = ["red", "orange", "turquoise"];

    const statusChannelHeight = chartHeight / statuses.length;

    const colorScale = d3
      .scaleOrdinal()
      .domain(statuses)
      .range(statusColors);

    const status = d => d.status;
    const statusChannelScale = d3
      .scaleOrdinal()
      .domain(statuses)
      .range(d3.range(statuses.length));

    const unvaccinated = d => d.unvaccinated;
    const radiusScale = d3
      .scaleSqrt()
      .domain(d3.extent(data, unvaccinated))
      .range([0, 120]);

    const isLabeled = d => ["Fragile", "Polio"].includes(status(d)) || unvaccinated(d) > 400000 || x(d) < 60;

    const xAxis = d3
      .axisTop(xscale)
      .tickFormat(d => `${d}%`)
      .tickSize(-chartHeight);

    const container = plotSVG
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const axisEl = container
      .append("g")
      .attr("transform", `translate(0,0)`)
      .attr("class", "axis x")
      .call(xAxis)
      .style("font-size", "24px");
    [axisEl.selectAll("g.tick line"), axisEl.selectAll("path.domain")].forEach(
      s => s.attr("opacity", "0.2")
    );

    const nodes = data.map(d => {
      const r = radiusScale(unvaccinated(d));
      const x0 = xscale(x(d));
      const y0 =
        statusChannelScale(status(d)) * statusChannelHeight +
        0.5 * statusChannelHeight +
        (Math.random() - 0.5) * statusChannelHeight;

      return {
        ...d,
        x0,
        y0,
        x: x0,
        y: y0,
        r
      };
    });

    container
      .selectAll("g.bubble")
      .data(nodes, d => d.country)
      .join(
        enter =>
        {
          const g = enter
            .append("g")
            .attr("class", "bubble")
            .attr("transform", d => `translate(${d.x},${d.y})`);
          g.append("circle")
          //.attr("cx", d => d.x0)
          //.attr("cy", d => d.y0)
            .attr("r", d => d.r)
            .attr("fill", d => colorScale(status(d)));
          g.append("text").text(d => isLabeled(d) ? d.country : "");
        }
      );

    addSVGDownloadLinkBeneath(plotSVG);
  });
});
