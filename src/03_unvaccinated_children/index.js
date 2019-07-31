import * as d3 from "d3";
import { feature } from "topojson";
import world from "/data/world.json";

import { legendColor, legendHelpers, legendSize } from "d3-svg-legend";

import dtp1DataURL from "/data/animated_map_dtp1.csv";
import dtp3DataURL from "/data/animated_map_dtp3.csv";

import { punchColorScale } from "/components/punchColorScale";
import { makeProjection } from "/components/projection";

import CountryTotalsDataProvider from "./CountryTotalsDataProvider";

import dorlingCartogram from "/components/dorlingCartogram";

import "/index.scss";
import "./index.scss";

var countriesWithLabels = [
  "Afghanistan",
  "Angola",
  "Argentina",
  "Australia",
  "Bangladesh",
  "Brazil",
  "Canada",
  "Chad",
  "China",
  "Colombia",
  "Congo",
  "Democratic Republic of the Congo",
  "Ecuador",
  "Egypt",
  "Equatorial Guinea",
  "Ethiopia",
  "France",
  "Germany",
  "Guatemala",
  "Guinea",
  "Haiti",
  "India",
  "Indonesia",
  "Iraq",
  "Italy",
  "Japan",
  "Lao People’s Democratic Republic",
  "Liberia",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mexico",
  "Myanmar",
  "Niger",
  "Nigeria",
  "Pakistan",
  "Papua New Guinea",
  "Peru",
  "Philippines",
  "Russian Federation",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sudan",
  "Syrian Arab Republic",
  "Uganda",
  "Ukraine",
  "United States of America",
  "Yemen"
];

const titleText = ({ year }) =>
  //`${year} Coverage and Unvaccinated Population for ${vaccine}`;
  `${year}`;

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(dtp1DataURL), d3.csv(dtp3DataURL)]).then(function([
    dtp1Data,
    dtp3Data
  ]) {
    const countryTotalsDataProvider = new CountryTotalsDataProvider({
      dtp1Data,
      dtp3Data
    });

    const years = countryTotalsDataProvider.getYears();
    const formatDataForYearAndVac = ({ year, vaccine }) =>
      countryTotalsDataProvider
        .getRows()
        // filters on one vaccine
        .filter(d => d.vaccine === vaccine)
        // filters on one year
        .map(d => ({
          ...d,
          unvaccinated: d[`${year}_unvaccinated`],
          coverage: d[`${year}`] / 100
        }));

    const state = {
      yearIndex: 0,
      year: years[0],
      vaccine: "dtp1"
    };
    let data = formatDataForYearAndVac(state);

    const height = 1800,
      width = 3096;

    var title = d3.select("body").append("h1");

    var radius = d3
      .scaleSqrt()
      .domain([1.5, 2500000])
      .range([0, 80]);

    const legendContainer = d3
      .select("body")
      .append("div")
      .attr("class", "legendContainer");

    const color = punchColorScale;
    const colorLegendContainer = legendContainer
      .append("div")
      .attr("class", "legend color-legend");
    colorLegendContainer.append("h2").text(`${state.vaccine.toUpperCase()} Coverage`);
    const color_svg = colorLegendContainer.append("svg").attr("height", 250);

    color_svg
      .append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(10,10)");

    const colorLegendSwatchSize = 40;

    var color_legend = legendColor()
      .labelFormat(d3.format(".0%"))
      .labels(legendHelpers.thresholdLabels)
      .scale(color)
      .shapeWidth(colorLegendSwatchSize)
      .shapeHeight(colorLegendSwatchSize)
      .ascending(true);

    color_svg.select(".legendQuant").call(color_legend);

    const radiusLegendWidth = 500;
    const radiusLegendHeight = 450;
    const radiusLegendContainer = legendContainer
      .append("div")
      .attr("class", "legend size-legend");
    radiusLegendContainer.append("h2").text("Unvaccinated Population");
    const radius_svg = radiusLegendContainer
      .append("svg")
      .attr("width", radiusLegendWidth)
      .attr("height", radiusLegendHeight);

    radius_svg
      .append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(25,45)");

    var formatSi = d3.format(".2s");

    var radius_legend = legendSize()
      .scale(radius)
      .shape("circle")
      .cells([1000, 10000, 100000, 1000000, 3000000])
      .shapePadding(40)
      .labelOffset(24)
      .labelFormat(formatSi)
      .orient("horizontal");

    radius_svg
      .select(".legendQuant")
      .call(radius_legend)
      .selectAll("circle")
      .style("opacity", 0.9)
      .style("fill", "#444");

    radius_svg
      .selectAll("text")
      .style("font-size", "24px")
      .style("font-family", "Helvetica");

    const projection = makeProjection(width, height);
    var path = d3.geoPath().projection(projection);

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .selectAll(".country")
      .data(feature(world, world.objects.general).features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
      .style("fill", "#e6e6e6");

    const { update } = dorlingCartogram(svg, {
      data,
      projection,
      radius: d => radius(d.unvaccinated),
      fill: d => color(d.coverage) || "#999",
      labelFilter: d => countriesWithLabels.indexOf(d.country) > -1
    });

    title.text(titleText(state));

    const renderNextYear = () => {
      state.yearIndex += 1;
      state.year = years[state.yearIndex];
      data = formatDataForYearAndVac(state);

      title.text(titleText(state));
      update(data);

      if (state.yearIndex < years.length - 1) {
        setTimeout(renderNextYear, 1500);
      } else {
        return;
      }
    };
    setTimeout(renderNextYear, 4000);
  });
});
