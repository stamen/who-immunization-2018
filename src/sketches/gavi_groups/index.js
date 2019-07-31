import * as d3 from "d3";

import gaviDataURL from "/data/gavi_explicit_rows.csv";

import GaviDataProvider from "./GaviDataProvider";

import { addSVGDownloadLinkBeneath } from '/components/renderHelpers';

import "/index.scss";
import "./index.scss";

const ROOT_COLOR = "#FFFFFF";

// Defines the GAVI status possible values.  NOTE: The order here determines
// order in the circle and is used in the color scales below.
const uniqueGaviStatusList = [
  "NON GAVI",
  "Transitioned ",
  "Transitioning",
  "GAVI"
];
//const uniqueIncomeStatusList = [
//"Low Income",
//"lower middle income",
//"upper middle income",
//"high income"
//];

const labelTextTransform = {
  "United States of America": "United States",
  "Syrian Arab Republic": "Syria",
  "Democratic Republic of the Congo": "DR Congo",
  "high income": "High",
  "lower middle income": "Low Mid",
  "upper middle income": "Upper Mid",
  "Low Income": "Low"
};

const hue = 204;
const gaviStatusColorScale = d3.scaleOrdinal(uniqueGaviStatusList, [
  `hsl(${hue}, 25%, 80%)`,
  `hsl(${hue}, 100%, 72%)`,
  `hsl(${hue}, 100%, 72%)`,
  `hsl(${hue}, 75%, 60%)`
  //`hsl(${hue}, 85%, 68%)`,
]);

const gaviStatusBorderColor = d3.scaleOrdinal(uniqueGaviStatusList, [
  `hsl(${hue}, 25%, 90%)`,
  `hsl(${hue}, 100%, 82%)`,
  `hsl(${hue}, 100%, 82%)`,
  `hsl(${hue}, 75%, 70%)`
  //`hsl(${hue}, 85%, 78%)`,
]);

const getLabelText = d => {
  let label = d.data.key || d.data.country_name;

  if (labelTextTransform.hasOwnProperty(label)) {
    label = labelTextTransform[label];
  }
  return label;
};

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this);
    if (text.attr("class") === "sunburst_label_outside") {
      return;
    }
    var words = text
        .text()
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    word = words.pop();
    while (word) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
      word = words.pop();
    }
  });
}

function drawGAVISunburst(root) {
  const width = 1440;
  const height = 900;
  const radius = height * 0.4;

  const plotSVG = d3
    .select("body")
    .append("svg")
    .attr("class", "gavi_sunburst")
    .attr("width", width)
    .attr("height", height);

  const container = plotSVG
    .append("g")
    .attr("transform", `translate(${0.5 * width}, ${0.5 * height})`);

  const getInnerRadius = d => d.y0;
  const getOuterRadius = d => d.y1;

  const partition = d3.partition().size([2 * Math.PI, radius]);

  const arc = d3
    .arc()
    .startAngle(function(d) {
      return d.x0;
    })
    .endAngle(function(d) {
      return d.x1;
    })
    .innerRadius(getInnerRadius)
    .outerRadius(getOuterRadius);

  const isRadialLabel = d => d.x1 - d.x0 > 0.035;

  const labelTransform = d => {
    const theta = d.x0 + (d.x1 - d.x0) / 2;
    if (isRadialLabel(d)) {
      const r = getInnerRadius(d) + (getOuterRadius(d) - getInnerRadius(d)) / 2;
      const rotation = ((theta - Math.PI / 2) / Math.PI) * 180;
      return `rotate(${rotation}) translate(${r},0) rotate(${
        theta < Math.PI ? 0 : 180
      })`;
    } else {
      const r = getOuterRadius(d) + 12;
      return `translate(${r * Math.cos(theta - Math.PI / 2)},${r *
        Math.sin(theta - Math.PI / 2)})`;
    }
  };

  const labelClass = d => {
    if (isRadialLabel(d)) {
      return "sunburst_label_radial";
    } else {
      return "sunburst_label_outside";
    }
  };

  const labelAnchor = d => {
    const theta = d.x0 + (d.x1 - d.x0) / 2;
    if (isRadialLabel(d)) {
      return "middle";
    } else {
      if (theta < Math.PI) {
        return "start";
      } else {
        return "end";
      }
    }
  };

  const nodes = partition(root).descendants();

  // filters nodes to keep only those large enough to see.
  //const nodes = partition(root)
  //.descendants()
  //.filter(function(d) {
  //return d.x1 - d.x0 > 0.04; // 0.005 radians = 0.29 degrees
  //});

  const getGaviStatusForNode = d => {
    switch (d.depth) {
      case 1:
        return d.data.key;
      case 2:
        return d.parent.data.key;
      case 3:
        return d.data.gavi_status;
      default:
        break;
    }
  };

  container
    .selectAll("path.sunburst_path")
    .data(nodes)
    .enter()
    .append("svg:path")
    .attr("class", "sunburst_path")
    .attr("display", function(d) {
      return d.depth ? null : "none";
    })
    .attr("d", arc)
    //.attr("fill-rule", "evenodd")
    .style("stroke", d => {
      switch (d.depth) {
        case 0:
          return ROOT_COLOR;
        case 1:
        case 2:
        case 3:
          return gaviStatusBorderColor(getGaviStatusForNode(d));
        default:
          break;
      }
    })
    .style("fill", d => {
      switch (d.depth) {
        case 0:
          // color of root
          return ROOT_COLOR;
        case 1:
        case 2:
        case 3:
          return gaviStatusColorScale(getGaviStatusForNode(d));
        default:
          break;
      }
    });
  //.style("fill", "#eee");

  const labelNodes = nodes.slice(1);
  //const labelNodes = [nodes[1]];

  container
    .selectAll("text.sunburst_label")
    .data(labelNodes)
    .enter()
    .append("text")
    .attr("class", labelClass)
    .attr("transform", labelTransform)
    //.attr("width", d => getOuterRadius(d) - getInnerRadius(d))
    .attr("dy", d => (isRadialLabel(d) ? 0.25 : 2))
    .attr("text-anchor", labelAnchor)
    .attr("opacity", d => (isRadialLabel(d) ? 1.0 : 0.0))
    .text(getLabelText)
    .call(wrap, 72);

  const innerCircleContainer = container
    .append("g")
    .attr("class", "sunburst_inner_circle");

  const rootNode = nodes[0];

  innerCircleContainer
    .data([rootNode])
    .append("circle")
    .attr("r", d => d.y1);
  
  const centerTitleContainer = d3
    .select("body")
    .data([rootNode])
    .append("div")
    .attr("class", "title_container")
    .style("left", d => 0.5 * width - d.y1 + 6)
    .style("top", d => 0.5 * height - 0.5 * d.y1 + 6)
    .style("width", d => 2*d.y1);
  centerTitleContainer.append("h1").text("19.4 Million Unprotected Children");

  addSVGDownloadLinkBeneath(plotSVG);

}

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(gaviDataURL)]).then(function([gaviData]) {
    const gaviDataProvider = new GaviDataProvider({
      gaviData
    });

    //const uniqueGaviStatus = new Set();
    //const uniqueIncomeStatus = new Set();

    //gaviData.forEach(d => {
    //uniqueGaviStatus.add(d.gavi_status);
    //uniqueIncomeStatus.add(d.income_status);
    //});

    //console.log("uniqueGaviStatus");
    //console.log(uniqueGaviStatus);
    //console.log("uniqueIncomeStatus");
    //console.log(uniqueIncomeStatus);

    //const uniqueGaviStatusList = Array.from(uniqueGaviStatus);
    //const uniqueIncomeStatusList = Array.from(uniqueIncomeStatus);

    //const incomeStatusColorScale = d3.scaleOrdinal(
    //uniqueIncomeStatusList,
    //d3.schemeSet3.slice(4, 4 + 4)
    //);

    const gaviNodes = d3
      .nest()
      .key(d => d.gavi_status)
      .sortKeys(
        (a, b) =>
          uniqueGaviStatusList.indexOf(a) < uniqueGaviStatusList.indexOf(b)
      )
      .key(d => d.income_status)
      .entries(gaviDataProvider.getRows());

    // Turn the data into a d3 hierarchy and calculate the sums.
    const root = d3
      .hierarchy({ values: gaviNodes }, d => d.values)
      .sum(function(d) {
        return d.sum_unvaccinated;
      })
      .sort(function(a, b) {
        return b.sum_unvaccinated - a.sum_unvaccinated;
      });

    console.log("gaviNodes");
    console.log(gaviNodes);

    drawGAVISunburst(root);
  });
});
