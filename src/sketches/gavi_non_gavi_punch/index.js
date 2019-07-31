import * as d3 from "d3";

import { punchColorScale } from "/components/punchColorScale";
import { punchRadiusScale } from "/components/punchRadiusScale";
import gaviCoverageDataURL from "/data/Gavi_non_gavi_coverage.csv";
import GaviCoverageDataProvider from "./GaviCoverageDataProvider";

import "./index.scss";

import punchCard from "/components/punchCard";
import punchCardLegend from '/components/punchCardLegend';

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(gaviCoverageDataURL)]).then(function([gaviCoverageData]) {
    //console.log("gaviCoverageData");
    //console.log(gaviCoverageData);

    const gaviCoverageDataProvider = new GaviCoverageDataProvider({
      gaviCoverageData
    });

    var scalefactor = 1;

    var width = 600;
    var height = 300;

    var categories = [
      "bcg",
      "hepbb",
      "dtp1",
      "dtp3",
      "hepb3",
      "hib3",
      "pol3",
      "pcv3",
      "rotac",
      "rcv1",
      "mcv1",
      "mcv2"
    ];

    var vaccine_format = {
      bcg: "BCG",
      hepbb: "HepBb",
      dtp1: "DTP1",
      dtp3: "DTP3",
      hepb3: "HepB3",
      hib3: "Hib3",
      pol3: "Pol3",
      pcv3: "PCV3",
      rotac: "Rotac",
      rcv1: "Rcv1",
      mcv1: "Mcv1",
      mcv2: "Mcv2"
    };

    var margin = { top: 55, right: 70, bottom: 20, left: 20 };

    var radius = punchRadiusScale;
    var color = punchColorScale;

    const legendContainer = d3.select("body").append("div");

    punchCardLegend(legendContainer, {
      scalefactor,
      color,
      radius
    });

    const yAxisTickFormat = d => vaccine_format[d];

    const data = gaviCoverageDataProvider
      .getRows()
      .filter(function(d) {
        return categories.indexOf(d.Vaccine) > -1;
      })
      .map(d => ({
        ...d,
        metric: d.Coverage / 100.0
      }));

    const xValueGetter = d => d.Year;
    const yValueGetter = d => d.Vaccine;

    const xdomain = d3.extent(data, xValueGetter);

    var nested = d3
      .nest()
      .key(function(d) {
        return d.Affilitation;
      })
      .sortKeys(d3.ascending)
      .key(yValueGetter)
      .entries(data);

    const multiplesContainer = d3.select("body").append("div").attr("class", "multiples");
    var canals = multiplesContainer.html("")
      .selectAll("div")
      .data(nested)
      .enter()
      .append("div")
      .attr("class", "svgToPng")
      .style("height", scalefactor * height + "px")
      .style("width", scalefactor * width + "px");

    canals.each(function(raw) {
      //console.log(raw);
      punchCard(d3.select(this), {
        width,
        height,
        margin,
        scalefactor,
        ydomain: categories,
        xdomain,
        radius,
        data: raw.values,
        title: raw.key,
        color,
        yAxisTickFormat,
        xValueGetter,
        yValueGetter
      });
    });
  });
});
