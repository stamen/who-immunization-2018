import * as d3 from "d3";
import { legendColor, legendSize } from "d3-svg-legend";

import unvaxByCountryDataURL from "/data/ranking_chart.csv";

//import UnvaxByCountryDataProvider from "./UnvaxByCountryDataProvider";
import RankingChartDataProvider from "./RankingChartDataProvider";
import { bubbleChart } from "./bubbleChart";
import { punchColorScale } from "/components/punchColorScale";

import { renderImageBeneath, addSVGDownloadLinkBeneath } from '/components/renderHelpers';

import "/index.scss";
import "./index.scss";

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(unvaxByCountryDataURL)]).then(function([
    rankingChartData
  ]) {
    const rankingChartDataProvider = new RankingChartDataProvider({
      rankingChartData
    });
    const rows = rankingChartDataProvider.getRows();

    const height = 2160,
      width = 2160;

    const plotSVG = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "bubble-chart");

    const margin = {
      left: 280,
      right: 200,
      top: 0,
      bottom: 500
    };

    const backLayerCircleColor = "rgba(0,0,0,0.15)";

    const populationNumFormat = d3.format(".2s");

    // Top 10 unvaccinated as bubble
    const { radiusScale } = bubbleChart(plotSVG, {
      width,
      height,
      margin,
      data: rows,
      xValue: d => `${d.country} ${populationNumFormat(d.noDTP3)}`,
      yValue: () => "",
      innerRadiusValue: d => d.noDTP3,
      outerRadiusValue: d => d.total,
      colorValue: d => d.wuenic / 100.0,
      maxRadius: 240,
      xAxisOffset: -540,
      yAxisOffset: 0,
      title: "",
      titleOffset: 0,
      backLayerCircleColor
      //colorScheme: d3.interpolateViridis
    });

    //const width = 1280;
    //const height = 720;

    //const plotSVG = d3
    //.select("body")
    //.append("svg")
    //.attr("width", width)
    //.attr("height", height)
    //.attr("class", "bubble-chart");

    //const margin = {
    //left: 200,
    //right: 420,
    //top: 150,
    //bottom: 400
    //};
    //const topCountryRowsTwoCategories = rows.reduce(
    //(twoCategories, d) => {
    //const total = d.SumUnvaccinated + d.SumVaccinated;
    //twoCategories.push({
    //...d,
    //category: "Total Vaccinated",
    //value: d.SumVaccinated,
    //total
    //});
    //twoCategories.push({
    //...d,
    //category: "Total Unvaccinated",
    //value: d.SumUnvaccinated,
    //total
    //});
    //return twoCategories;
    //},
    //[]
    //);

    //console.log("topCountryRowsTwoCategories");
    //console.log(topCountryRowsTwoCategories);

    //// Top 10 unvaccinated as bubble
    //const { radiusScale } = bubbleChart(plotSVG, {
    //width,
    //height,
    //margin,
    //data: topCountryRowsTwoCategories,
    //xValue: d => d.Country,
    //yValue: d => d.category,
    //innerRadiusValue: d => d.value,
    //outerRadiusValue: d => d.total,
    //colorValue: d => 1.0 - d.value / d.total,
    //maxRadius: 40,
    //xAxisOffset: 50,
    //yAxisOffset: 50,
    //title: "Countries with most unprotected children",
    //titleOffset: -80,
    //backLayerCircleColor: "rgba(255,255,255,1.0)",
    //colorScheme: punchColorScale
    //});

    const colorLegendContainer = plotSVG
      .append("g")
      .attr("class", "legend legend_color")
      .attr("transform", "translate(100,100)");

    const percentFormatter = d3.format(".0%");
    const colorLegend = legendColor()
      .orient("horizontal")
      .shapePadding(28)
      .shape("circle")
      .labelOffset(4)
      .labels(({ i, domain }) => {
        let percStr = `${percentFormatter(domain[i])}`;
        if (i === 0) {
          percStr = `${percentFormatter(domain[i])}`;
          return `< ${percStr}`;
        } else if (i === domain.length - 1) {
          return `${percStr}`;
        } else {
          percStr = `${percentFormatter(domain[i - 1])}`;
          return percStr;
        }
      })
      .cellFilter(c => c.label !== "")
      .scale(punchColorScale);
    colorLegendContainer.append("g").attr("transform", "scale(2)").call(colorLegend);

    const sizeLegendContainer = plotSVG
      .append("g")
      .attr("class", "legend legend_size")
      .attr("transform", "translate(600,200)");

    const sizeLegend = legendSize()
      .shape("circle")
      .orient("horizontal")
      .shapePadding(80)
      .labelOffset(20)
      .labelFormat(d3.format(".2s"))
      // Hides the first "empty" bubble
      .cellFilter(c => c.label !== "0.0")
      .scale(radiusScale);
    sizeLegendContainer.call(sizeLegend);
    sizeLegendContainer.selectAll("circle").attr("fill", backLayerCircleColor);
    
    renderImageBeneath(plotSVG, height, width);
    addSVGDownloadLinkBeneath(plotSVG);
  });
});
