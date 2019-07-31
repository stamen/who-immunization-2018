import * as d3 from "d3";

import underperformersDataURL from "/data/underperformers.csv";

import UnderperformersDataProvider from "./UnderperformersDataProvider";
import { addSVGDownloadLinkBeneath } from '/components/renderHelpers';

import { punchColorScale } from '/components/punchColorScale';

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(underperformersDataURL)]).then(function([
    underperformersData
  ]) {
    const underperformersDataProvider = new UnderperformersDataProvider({
      underperformersData
    });
    const height = 2160,
      width = 4096,
      margin = { top: 200, right: 500, bottom: 200, left: 500 },
      chartWidth = width - margin.left - margin.right,
      chartHeight = height - margin.top - margin.bottom;
    const plotSVG = d3
      .select("body")
      .append("svg")
      .attr("height", height)
      .attr("width", width);
    plotSVG.style("font-family", "sans-serif").style("font-size", "24px");

    const data = underperformersDataProvider.getRows();

    const x = d => d.growth;
    const y = d => d.dtp3;

    const xscale = d3
      .scaleLinear()
      .domain([-50, 50])
      .range([0, chartWidth]);

    const yscale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0]);

    const xAxis = d3.axisBottom(xscale);
    const yAxis = d3.axisLeft(yscale);

    [xAxis, yAxis].forEach(a => a.tickFormat(d => `${d}%`));

    const container = plotSVG
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    container
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .attr("class", "axis x")
      .call(xAxis);
    container
      .append("g")
      .attr("class", "axis y")
      .call(yAxis);

    d3.selectAll("g.axis").style("font-size", "32px");

    // Draws threshold lines
    container
      .append("line")
      .attr("class", "thresholdLine")
      .attr("x2", xscale(-50))
      .attr("y2", yscale(60))
      .attr("x1", xscale(50))
      .attr("y1", yscale(60));

    container
      .append("line")
      .attr("class", "thresholdLine")
      .attr("x2", xscale(0))
      .attr("y2", yscale(0))
      .attr("x1", xscale(0))
      .attr("y1", yscale(100));

    d3.selectAll("line.thresholdLine")
      .style("stroke", "#333")
      .style("stroke-width", 4);

    const scatterContainer = container.append("g");

    const CIRCLE_RADIUS = 15;
    const UNDER_PERFORMING_CIRCLE_RADIUS = 35;

    // Draws scatterplot
    scatterContainer
      .selectAll("circle.country")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "country")
      .attr("r", d => y(d) < 60 ? UNDER_PERFORMING_CIRCLE_RADIUS : CIRCLE_RADIUS)
      .attr("cx", d => xscale(x(d)))
      .attr("cy", d => yscale(y(d)))
      .attr("fill", d => punchColorScale(y(d) / 100.0));

    const pointsToLabel = data.filter(d => y(d) < 60);
    // Draws labels on countries with less than 60%
    const labelContainer = container.append("g");
    labelContainer
      .selectAll("text.countryLabel")
      .data(pointsToLabel)
      .enter()
      .append("text")
      .attr("class", "countryLabel")
      .attr("x", d => xscale(x(d)) + CIRCLE_RADIUS)
      .attr("y", d => yscale(y(d)))
      .style("font-size", "48px")
      .text(d => d.country);

    addSVGDownloadLinkBeneath(plotSVG);

  });
});
