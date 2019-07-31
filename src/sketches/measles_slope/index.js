import * as d3 from "d3";

import MeaslesDataProvider from "./MeaslesDataProvider";
import measlesSlopeUpDataURL from "/data/measles_slope_up.csv";
import measlesSlopeDownDataURL from "/data/measles_slope_down.csv";
import measlesDataURL from '/data/measles.csv';

import { punchColorScale } from "/components/punchColorScale";
import slopeChart from "/components/slopeChart";
import { addSVGDownloadLinkBeneath } from '/components/renderHelpers';

function renderMeaslesSlope({
  data,
  height,
  width,
  chartWidth,
  margin,
  yscale
}) {
  const plotSVG = d3
    .select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);
  plotSVG.style("font-family", "sans-serif").style("font-size", "24px");
  const container = plotSVG
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  slopeChart(container, {
    data,
    width: chartWidth,
    y1: d => yscale(d.startPercent),
    y2: d => yscale(d.endPercent),
    stroke: d => punchColorScale(d.endPercent / 100.0),
    startLabel: d => `${d.country} ${d.startPercent}`,
    endLabel: d => `${d.endPercent} ${d.country}`
  });
  addSVGDownloadLinkBeneath(plotSVG);
}

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([
    d3.csv(measlesSlopeUpDataURL),
    d3.csv(measlesSlopeDownDataURL),
    d3.csv(measlesDataURL)
  ]).then(function([measlesSlopeUpData, measlesSlopeDownData, measlesData]) {
    const measlesDataProvider = new MeaslesDataProvider({
      measlesSlopeUpData,
      measlesSlopeDownData,
      measlesData
    });
    const height = 2160,
      width = 3096,
      margin = { top: 200, right: 500, bottom: 200, left: 500 },
      chartWidth = width - margin.left - margin.right,
      chartHeight = height - margin.top - margin.bottom;

    //const slopeUpYScale = d3
      //.scaleLinear()
      //.domain([40, 100])
      //.range([chartHeight, 0]);

    //renderMeaslesSlope({
      //className: 'slope-up',
      //data: measlesDataProvider.getSlopeUpRows(),
      //height,
      //width,
      //chartWidth,
      //margin,
      //yscale: slopeUpYScale
    //});


    //const slopeDownYScale = d3
      //.scaleLinear()
      //.domain([30, 100])
      //.range([chartHeight, 0]);

    //renderMeaslesSlope({
      //className: 'slope-down',
      //data: measlesDataProvider.getSlopeDownRows(),
      //height,
      //width,
      //chartWidth,
      //margin,
      //yscale: slopeDownYScale
    //});
    
    const data = measlesDataProvider.getRows();
    
    const yscale = d3.scaleLinear().domain([25, 100]).range([chartHeight, 0]);
    renderMeaslesSlope({
      data,
      height,
      width,
      chartWidth,
      margin,
      yscale
    });

    renderMeaslesSlope({
      data: data.slice(0, 25),
      height,
      width,
      chartWidth,
      margin,
      yscale
    });
  });
});
