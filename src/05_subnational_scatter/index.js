import * as d3 from "d3";

import { legendColor, legendSize, legendHelpers } from "d3-svg-legend";

import subnationalDataURL from "/data/subnational_coverage.csv";

import SubnationalDataProvider from "./SubnationalDataProvider";

import { renderImageBeneath, addSVGDownloadLinkBeneath } from "/components/renderHelpers";

function subnationalCoverageScatter({
  year,
  vaccine,
  height,
  width,
  margin,
  chartWidth,
  chartHeight,
  subnationalDataProvider
}) {
  const data = subnationalDataProvider
    .getRowsForYearAndVaccine({
      year,
      vaccine
    });
    //.slice(0, 5000);
  const plotSVG = d3
    .select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);
  plotSVG.style("font-family", "sans-serif").style("font-size", "24px");

  const container = plotSVG
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const legendContainer = plotSVG
    .append("g")
    .attr("transform", `translate(25,25)`)
    .attr("font-size", "36px");

  var coveragescale = d3
    .scaleLinear()
    .range([0, (2 * chartWidth) / 3, chartWidth])
    .domain([1, 100, 1000])
    .clamp(true);

  var unvaccinatedscale = d3
    .scaleSqrt()
    .range([chartHeight, chartHeight / 3, 0])
    .domain([1, 100000, 500000]);

  var radius = d3
    .scaleSqrt()
    .domain([1, 500000])
    .range([8, 60])
    .clamp(true);

  var color = d3
    .scaleThreshold()
    .domain([0.6, 0.7, 0.8, 0.9, 0.95, 1, 50])
    .range([
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#91cf60",
      "#66bd63",
      "#1a9850",
      "#875f87"
    ]);

  legendContainer
    .append("g")
    .attr("transform", `translate(0,48)`)
    .append("text")
    .text(`Subnational ${vaccine} coverage for ${year}`)
    .style("font-size", "48px")
    .style("font-weight", "bold");

  const colorLegend = legendColor()
    .labelFormat(d3.format(".0%"))
    .labels(legendHelpers.thresholdLabels)
    .scale(color)
    .shapePadding(20)
    .shapeHeight(40)
    .shapeWidth(40)
    .ascending(true);

  legendContainer
    .append("g")
    .attr("transform", `translate(0,100)`)
    .call(colorLegend);

  const radiusLegend = legendSize()
    .scale(radius)
    .shape("circle")
    .cells([1, 10, 100, 1000, 10000, 100000, 300000])
    .shapePadding(40)
    .labelOffset(40)
    .labelFormat(d3.format(".2s"))
    .orient("horizontal");
  legendContainer
    .append("g")
    .attr("transform", `translate(0,600)`)
    .call(radiusLegend);

  var xAxis = d3
    .axisTop()
    .scale(coveragescale)
    .tickFormat(function(d) {
      if (d >= 1000) return ">1000%";
      return d + "%";
    })
    .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 400, 700, 1000])
    .tickSize(-chartHeight);

  var yAxis = d3
    .axisRight()
    .scale(unvaccinatedscale)
    .tickFormat(d3.format(","))
    .tickSize(-chartWidth)
    .tickValues([
      10,
      500,
      2000,
      5000,
      10000,
      15000,
      20000,
      30000,
      40000,
      50000,
      60000,
      80000,
      100000,
      150000,
      200000,
      300000,
      400000,
      500000
    ]);

  container
    .append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .selectAll("text")
    .attr("y", -12);
  container
    .append("g")
    .attr("transform", "translate(" + chartWidth + ",0)")
    .attr("class", "y axis")
    .call(yAxis);
  [".axis path", ".axis line"].forEach(selector =>
    plotSVG
      .selectAll(selector)
      .style("fill", "none")
      .style("stroke", "#e7e7e7")
  );
  plotSVG.selectAll(".axis text").style("font-size", "24px");

  container
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => coveragescale(d.coverage))
    .attr("cy", d => unvaccinatedscale(d.denominator))
    .attr("r", d => radius(d.denominator))
    .style("fill", d => color(d.coverage / 100))
    .style("stroke", "#fff")
    .style("stroke-opacity", 0.6)
    .sort((a, b) => d3.ascending(a.denominator, b.denominator))
    .on("mouseover", d => {
      console.log(d);
    });

    addSVGDownloadLinkBeneath(plotSVG);
    renderImageBeneath(plotSVG, height, width);
}

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(subnationalDataURL)]).then(function([subnationalData]) {
    const subnationalDataProvider = new SubnationalDataProvider({
      subnationalData
    });

    const year = 2018;
    let vaccine = "dtp3";

    const height = 2160,
      width = 3096,
      margin = { top: 200, right: 500, bottom: 200, left: 500 },
      chartWidth = width - margin.left - margin.right,
      chartHeight = height - margin.top - margin.bottom;

    subnationalCoverageScatter({
      year,
      vaccine,
      height,
      width,
      margin,
      chartWidth,
      chartHeight,
      subnationalDataProvider
    });


    vaccine = "mcv1";

    subnationalCoverageScatter({
      year,
      vaccine,
      height,
      width,
      margin,
      chartWidth,
      chartHeight,
      subnationalDataProvider
    });
  });
});
