export default function slopeChart (container, props) {
  const {
    width,
    y1,
    y2,
    stroke,
    startLabel,
    endLabel,
    data
  } = props;


  const enter = container
    .selectAll("g.slopeItem")
    .data(data)
    .enter();
  enter
    .append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", y1)
    .attr("y2", y2)
    .style("stroke", stroke)
    .style("stroke-width", 4);
  enter
    .append("text")
    .attr("x", -3)
    .attr("y", y1)
    .style("text-anchor", "end")
    .style("alignment-baseline", "middle")
    .text(startLabel);
  enter
    .append("text")
    .attr("x", width + 3)
    .attr("y", y2)
    .style("alignment-baseline", "middle")
    .text(endLabel);
}
