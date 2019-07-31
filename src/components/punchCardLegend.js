import { legendSize } from "d3-svg-legend";
import { format } from 'd3';

export default function punchCardLegend(selection, props) {
  const { 
    scalefactor,
    radius,
    color
  } = props;
  selection.datum({ key: "scale" });
  var radius_svg = selection
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", scalefactor * 310)
    .attr("height", scalefactor * 40)
    .style("font-family", "Helvetica, Arial, sans-serif")
    .append("g")
    .attr("transform", "scale(" + scalefactor + ")");

  radius_svg
    .append("rect")
    .style("fill", "#fff")
    .attr("width", 310)
    .attr("height", 40);

  radius_svg
    .append("text")
    .text("Coverage (WUENIC) Color and Radius Scale")
    .attr("y", 10)
    .attr("x", 6);

  radius_svg
    .append("g")
    .attr("class", "legendQuant")
    .attr("transform", "translate(10,22)");

  radius_svg.selectAll("text");

  var radius_legend = legendSize()
    .scale(radius)
    .shape("circle")
    .cells([
      0,
      0.1001,
      0.2001,
      0.3001,
      0.4001,
      0.5001,
      0.6001,
      0.7001,
      0.8001,
      0.9001,
      0.95001
    ])
    .shapePadding(18)
    .labelOffset(8)
    .labelFormat(format(".0%"))
    .orient("horizontal");

  radius_svg.select(".legendQuant").call(radius_legend);

  radius_svg
    .selectAll("circle")
    .style("fill", function(d) {
      return color(d - 0.0001);
    })
    .style("stroke-width", "1")
    .style("stroke", "#fff");

  radius_svg
    .selectAll("text")
    .style("font-size", "9px")
    .style("font-family", "Helvetica, Arial, sans-serif")
    .style("font-weight", "bold");
  /* End Legends */
}
