import * as d3 from "d3";

export default function punchCard(selection, props) {
  const {
    width,
    height,
    margin,
    scalefactor,
    xdomain,
    ydomain,
    data,
    title,
    radius,
    color,
    yAxisTickFormat,
    xValueGetter,
    yValueGetter
  } = props;

  const chartheight = ydomain.length * 18;
  const chartwidth = width - margin.left - margin.right;

  const timescale = d3
    .scaleLinear()
    .range([0, chartwidth])
    .domain(xdomain);

  const xAxis = d3
    .axisTop()
    .scale(timescale)
    .tickFormat(String);
  //.tickValues([1980, 1990, 1997, 2000, 2005, 2010, 2016, 2017]);

  const yAxis = d3
    .axisRight()
    .tickFormat(yAxisTickFormat)
    .tickSize(-chartwidth);

  const xTextOffset = 12;
  xAxis.tickSize(-chartheight);

  const yscale = d3
    .scaleBand()
    .range([0, chartheight])
    .domain(ydomain);

  yAxis.scale(yscale);

  const container = selection
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", scalefactor * width)
    .attr("height", scalefactor * height)
    .style("font-family", "Helvetica, Arial, sans-serif")
    .append("g")
    .attr("transform", "scale(" + scalefactor + ")");

  container
    .append("rect")
    .style("fill", "#fff")
    .attr("width", scalefactor * width)
    .attr("height", scalefactor * height);

  container
    .append("text")
    .attr("x", 5)
    .attr("y", 12)
    .style("font-size", "16px")
    .attr("alignment-baseline", "hanging")
    .style("font-weight", "bold")
    .text(title);

  const svg = container
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .selectAll("text")
    .attr("y", -xTextOffset)
    .style("font-size", "14px");

  svg
    .append("g")
    .attr("transform", `translate(${chartwidth},${-8})`)
    .attr("class", "y axis")
    .call(yAxis);

  svg.selectAll(".axis path").style("display", "none");

  svg
    .selectAll(".axis line")
    .style("fill", "none")
    .style("stroke", "#e7e7e7");

  svg.selectAll(".y.axis .tick text").attr("x", 16);

  svg
    .selectAll(".x.axis .tick line")
    .attr("transform", `translate(0,-${xTextOffset})`);

  const rows = svg
    .selectAll("g.county")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "county");

  rows
    .selectAll("circle")
    .data(function(d) {
      return d.values;
    })
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return timescale(xValueGetter(d));
    })
    .attr("cy", function(d) {
      return yscale(yValueGetter(d));
    })
    .attr("r", function(d) {
      return radius(d.metric) || 1.5;
    })
    .style("fill", function(d) {
      return color(d.metric);
    })
    .style("stroke-width", "1")
    .style("stroke", "#fff")
    .append("title")
    .text(function(d) {
      return d.metric + " metric";
    });
}
