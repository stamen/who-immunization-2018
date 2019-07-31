import * as d3 from "d3";

import { feature } from "topojson";
import { legendColor, legendHelpers } from "d3-svg-legend";

import hpvDataURL from "/data/prHPVc_2018.csv.0";
import cancerDataURL from "/data/cx_cancer_rates.csv.0";
import world from "/data/world.json";

import HPVDataProvider from "/components/HPVDataProvider";
import CancerDataProvider from "./CancerDataProvider";
import { makeProjection } from "/components/projection";
import { renderImageBeneath } from "/components/renderHelpers";
//import dorlingCartogram from "/components/dorlingCartogram";

import "/index.scss";

//function legendTitleText(container) {
//return container
//.append("text")
//.style("font-size", "24px")
//.style("font-weight", "bold");
//}

function createLegendContainer(container) {
  return container
    .append("g")
    .attr("transform", `translate(200,1000)`)
    .style("font-family", "sans-serif")
    .style("font-size", "36px");
}

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([
    //d3.json(worldCountriesGeoJSONURL),
    d3.csv(hpvDataURL),
    d3.csv(cancerDataURL)
  ]).then(function([hpvData, cancerData]) {
    const worldCountriesGeoJSON = feature(world, world.objects.general);

    console.log("worldCountriesGeoJSON");
    console.log(worldCountriesGeoJSON);

    const hpvDataProvider = new HPVDataProvider({
      hpvData
    });

    const cancerDataProvider = new CancerDataProvider({
      cancerData
    });

    //worldCountriesGeoJSON.features = worldCountriesGeoJSON.features.filter(
      //f => f.id !== "ATA"
    //);

    // Renders HPV map

    const hpvPlotSVG = d3.select("div.plot-container").append("svg");
    const height = 2160,
      width = 4096;

    hpvPlotSVG.attr("height", height).attr("width", width);

    // Map and projection
    var projection = makeProjection(width, height);
    var path = d3.geoPath().projection(projection);

    const COUNTRY_STROKE_COLOR = "rgba(0, 0, 0, 0.4)";

    const NO_DATA_COLOR = "#FFFFFF";
    // Data and color scale
    var colorScheme = d3.schemePurples[3];
    const NAN_COLOR = d3.color(d3.schemeBlues[5][2]);
    NAN_COLOR.opacity = 0.15;
    //var colorScheme = ["#a50026","#d73026","#fdae61","#fee08b", "#91cf60", "#1a9850"];
    //var colorScheme = ["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"];
    //var colorScheme = ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"];
    //var colorScheme = ["#d73027", "#f46d43", "#fdae61", "#91cf60", "#66bd63", "#1a9850", "#875f87"];
    //var colorScheme = ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#66bd63", "#1a9850"];
    const domain = [0.5, 0.8];
    var colorScale = d3
      .scaleThreshold()
      .domain(domain)
      .range(colorScheme);

    const secondaryColorScale = d3
      .scaleOrdinal()
      .domain([NaN, undefined])
      .range([NAN_COLOR, NO_DATA_COLOR]);

    const LEGEND_SWATCH_WIDTH = 80;
    const LEGEND_SWATCH_HEIGHT = 40;

    const colorLegendBase = () =>
      legendColor()
        .shapeWidth(LEGEND_SWATCH_WIDTH)
        .shapeHeight(LEGEND_SWATCH_HEIGHT)
        .shapePadding(20)
        .orient("vertical");

    const legendContainer = createLegendContainer(hpvPlotSVG);
    //legendTitleText(legendContainer).text("HPV Coverage");
    const primaryLegendContainer = legendContainer
      .append("g");

    const secondaryLegendContainer = legendContainer
      .append("g")
      .attr("transform", `translate(400,0)`);

    const formatter = d3.format(".0%");
    var legend = colorLegendBase()
      .scale(colorScale)
      .labels(legendHelpers.thresholdLabels)
      .labelFormat(formatter);
    primaryLegendContainer.call(legend);

    secondaryLegendContainer.call(
      colorLegendBase()
        .scale(secondaryColorScale)
        .labels(["Introduced", "Not Available"])
    );

    legendContainer
      .selectAll("rect.swatch")
      .style("stroke-width", "1px")
      .style("stroke", COUNTRY_STROKE_COLOR);

    // Draw the map
    hpvPlotSVG
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(worldCountriesGeoJSON.features)
      .enter()
      .append("path")
      .attr("fill", function(d) {
        //const countryCode = d.id;
        const countryCode = d.properties.ISO_3_CODE;
        // Pull data for this country
        const hpvData = hpvDataProvider.getDataForCountry(countryCode);

        if (hpvData === undefined) {
          return secondaryColorScale(hpvData);
        } else if (isNaN(hpvData.latestPercent)) {
          return secondaryColorScale(hpvData.latestPercent);
        } else {
          return colorScale(hpvData.latestPercent);
        }
      })
      .attr("d", path)
      .style("stroke-width", "1px")
      .style("stroke", COUNTRY_STROKE_COLOR);

    renderImageBeneath(hpvPlotSVG, height, width);

    // Renders cancer map

    const cancerType = "Cervix uteri";

    //const asrExtents = d3.extent(cancerDataProvider.getRows(), d => d.asr);
    const asrColorScale = d3
      .scaleSequential()
      .domain([0, 80])
      .interpolator(d3.interpolateOranges);

    const cancerPlotSVG = d3.select("div.cancer-plot-container").append("svg");
    cancerPlotSVG.attr("width", width).attr("height", height);

    // Draws cancer map
    cancerPlotSVG
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(worldCountriesGeoJSON.features)
      .enter()
      .append("path")
      .attr("fill", function(d) {
        //const countryCode = d.id;
        const countryCode = d.properties.ISO_3_CODE;
        // Pull data for this country
        const cancerData = cancerDataProvider.getRowForCountryAndCancer(
          countryCode,
          cancerType
        );

        if (cancerData) {
          return asrColorScale(cancerData.asr);
        } else {
          return NO_DATA_COLOR;
        }
      })
      .attr("d", path)
      // Regular stroke on cancer burden map
      .style("stroke-width", "1px")
      .style("stroke", COUNTRY_STROKE_COLOR);

    //const HPV_INTRODUCED_STROKE_COLOR = "black";
    const HPV_INTRODUCED_STROKE_COLOR = "#17435e";
    const HPV_INTRODUCED_STROKE_WIDTH = 7;

    // Draws outlines on top of cancer map where HPV vaccine is present
    cancerPlotSVG
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(worldCountriesGeoJSON.features)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("d", path)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", d => {
        //const countryCode = d.id;
        const countryCode = d.properties.ISO_3_CODE;
        // Pull data for this country
        const hpvData = hpvDataProvider.getDataForCountry(countryCode);

        if (hpvData === undefined) {
          return "1px";
        } else {
          return `${HPV_INTRODUCED_STROKE_WIDTH}px`;
        }
      })
      .attr("stroke", d => {
        const countryCode = d.id;
        // Pull data for this country
        const hpvData = hpvDataProvider.getDataForCountry(countryCode);

        if (hpvData === undefined) {
          return COUNTRY_STROKE_COLOR;
        } else {
          return HPV_INTRODUCED_STROKE_COLOR;
        }
      });

    const cancerLegend = colorLegendBase()
      .scale(asrColorScale)
      .cells([0, 20, 40, 60, 80])
      .labelFormat(d3.format(".0s"));

    // Draws cancer map legend
    const cancerLegendContainer = createLegendContainer(cancerPlotSVG);
    //legendTitleText(cancerLegendContainer).text(
    //"Cervical Cancer Incidence (ASR per 100,000)"
    //);
    const cancerPrimaryLegendContainer = cancerLegendContainer.append("g");
    cancerPrimaryLegendContainer
      .call(cancerLegend)
      .selectAll("rect.swatch")
      .style("stroke-width", "1px")
      .style("stroke", COUNTRY_STROKE_COLOR);

    const cancerSecondaryLegendContainer = cancerLegendContainer.append("g").attr("transform", "translate(200,0)");
    cancerSecondaryLegendContainer
      .append("rect")
      .attr("width", LEGEND_SWATCH_WIDTH)
      .attr("height", LEGEND_SWATCH_HEIGHT)
      .attr("fill", "none")
      .attr("stroke", HPV_INTRODUCED_STROKE_COLOR)
      .attr("stroke-width", `${HPV_INTRODUCED_STROKE_WIDTH}px`);
    cancerSecondaryLegendContainer
      .append("text")
      .attr("transform", `translate(${LEGEND_SWATCH_WIDTH + 15},${0.5 * LEGEND_SWATCH_HEIGHT})`)
      .text("HPV Vaccine Introduced");

    renderImageBeneath(cancerPlotSVG, height, width);

    //const bivariatePlotSVG = d3
    //.select("div.bivariate-plot-container")
    //.append("svg");
    //bivariatePlotSVG.attr("width", width).attr("height", height);

    //const bivariateColors = [
    //"#e8e8e8",
    //"#ace4e4",
    //"#5ac8c8",
    //"#dfb0d6",
    //"#a5add3",
    //"#5698b9",
    //"#be64ac",
    //"#8c62aa",
    //"#3b4994"
    //];
    //const n = Math.floor(Math.sqrt(bivariateColors.length));
    //const x = d3.scaleQuantize(
    //d3.extent(hpvDataProvider.getRows(), d => d.latestPercent),
    //d3.range(n)
    //);
    //const y = d3.scaleQuantize(asrExtents, d3.range(n));
    //const bivariateColor = value => {
    //if (!value) return "#ccc";
    //const [a, b] = value;
    //return bivariateColors[y(b) + x(a) * n];
    //};

    // Draws bivariate map
    //bivariatePlotSVG
    //.append("g")
    //.attr("class", "countries")
    //.selectAll("path")
    //.data(worldCountriesGeoJSON.features)
    //.enter()
    //.append("path")
    //.attr("fill", function(d) {
    //const countryCode = d.id;
    //// Pull HPV data for this country
    //const hpvData = hpvDataProvider.getDataForCountry(countryCode);

    //// Pull cancer data for this country
    //const cancerData = cancerDataProvider.getRowForCountryAndCancer(
    //countryCode,
    //cancerType
    //);

    //let a, b;
    //if (cancerData) {
    //b = cancerData.asr;
    //} else {
    //console.log(`No cancer data for ${countryCode}`);
    //b = asrExtents[0];
    //}

    //if (hpvData) {
    //if (isNaN(hpvData.latestPercent)) {
    //a = 0.01;
    //} else {
    //a = hpvData.latestPercent;
    //}
    //} else {
    //a = 0.01;
    //}
    //return bivariateColor([a, b]);
    //})
    //.attr("d", path)
    //.style("stroke-width", "1px")
    //.style("stroke", COUNTRY_STROKE_COLOR);

    //renderImageBeneath(
    //d3.select("div.bivariate-plot-container"),
    //height,
    //width
    //);

    //var radius = d3
    //.scaleSqrt()
    //.domain(d3.extent(data, d => d.asr))
    //.range([1, 60]);

    //dorlingCartogram(hpvPlotSVG.append("g"), {
    //data,
    //projection,
    //radius: d => radius(d.asr),
    //fill: () => "rgba(128,0,0,0.0)",
    //stroke: () => "rgba(128,0,0,0.2)",
    //labelFilter: () => false,
    //iterations: 0,
    //strength: 0.1
    //});
  });
});
