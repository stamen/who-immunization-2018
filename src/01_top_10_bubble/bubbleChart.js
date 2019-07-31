import {
  select,
  scalePoint,
  scaleLinear,
  scaleSqrt,
  max,
  //extent,
  //scaleSequential,
  axisBottom,
  axisLeft
} from "d3";

import { punchColorScale } from "/components/punchColorScale";
import "./bubbleChart.scss";

const removeAxisLines = selection => {
  selection.selectAll(".domain, .tick line").remove();
};

export const bubbleChart = (selection, props) => {
  const {
    width,
    height,
    data,
    xValue,
    yValue,
    innerRadiusValue,
    outerRadiusValue,
    colorValue,
    margin,
    maxRadius,
    xAxisOffset,
    yAxisOffset,
    title,
    titleOffset,
    backLayerCircleColor,
    //colorScheme
  } = props;

  const gUpdate = selection.selectAll("g.container").data([1]);
  const gEnter = gUpdate
    .enter()
    .append("g")
    .attr("class", "container");
  const g = gEnter
    .merge(gUpdate)
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scalePoint()
    .domain(data.map(xValue))
    .range([0, innerWidth]);

  const yScale = scalePoint()
    .domain(data.map(yValue))
    .range([innerHeight, 0]);

  const radiusScale = scaleSqrt()
    .domain([0, max(data, outerRadiusValue)])
    .range([0, maxRadius]);

  //const colorScale = scaleSequential(colorScheme).domain(
  //extent(data, colorValue).reverse()
  //);
  const colorScale = punchColorScale;

  let layerGroups = g
    .selectAll("g.layer")
    .data([outerRadiusValue, innerRadiusValue]);
  layerGroups = layerGroups
    .enter()
    .append("g")
    .attr("class", "layer")
    .merge(layerGroups);

  layerGroups.each(function(radiusValue) {
    const isInner = radiusValue === innerRadiusValue;
    const circles = select(this)
      .selectAll("circle")
      .data(data, d => xScale(xValue(d)) + "," + yScale(yValue(d)));
    circles
      .enter()
      .append("circle")
      .merge(circles)
      .attr("class", isInner ? "inner" : "outer")
      .attr("cx", d => xScale(xValue(d)))
      .attr("cy", d => yScale(yValue(d)))
      .attr("r", d => radiusScale(radiusValue(d)))
      .attr("fill", d =>
        isInner ? colorScale(colorValue(d)) : backLayerCircleColor
      );
    circles.exit().remove();
  });

  const xAxis = axisBottom(xScale);
  gEnter
    .append("g")
    .attr("class", "x-axis")
    .merge(gUpdate.select(".x-axis"))
    .attr("transform", `translate(0,${innerHeight + xAxisOffset})`)
    .call(xAxis)
    .call(removeAxisLines)
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", "24px")
    .attr("dx", "-.8em")
    // .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  const yAxis = axisLeft(yScale);
  gEnter
    .append("g")
    .attr("class", "y-axis")
    .merge(gUpdate.select(".y-axis"))
    .attr("transform", `translate(${-yAxisOffset})`)
    .call(yAxis)
    .call(removeAxisLines);

  gEnter
    .append("text")
    .attr("class", "visualization-title")
    .merge(gUpdate.select(".visualization-title"))
    .attr("x", innerWidth / 2)
    .attr("y", titleOffset)
    .text(title);

  return {
    radiusScale
  };
};
