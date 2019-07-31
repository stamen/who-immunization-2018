import * as d3 from "d3";
import { feature } from "topojson";

import world from "/data/world.json";

import { lookupCountryCode } from "/components/countryUtils";

const centroidLookup = {};

export default function dorlingCartogram(container, props) {
  const {
    data,
    radius,
    labelFilter,
    projection,
    fill,
    iterations = 20,
    strength = 0.55,
    stroke = () => "none"
  } = props;

  var path = d3.geoPath().projection(projection);

  feature(world, world.objects.general).features.map(function(d) {
    var obj = {
      data: d.properties,
      centroid: path.centroid(d)
    };
    centroidLookup[obj.data.ISO_3_CODE] = obj;
    return obj;
  });

  const createNodes = data =>
    data
      // filters countries with geojson
      .filter(d => {
        const hasGeoJSON = centroidLookup.hasOwnProperty(
          lookupCountryCode(d.country)
        );
        if (!hasGeoJSON) {
          console.log(
            `WARNING: Country '${d.country}' excluded for no GeoJSON`
          );
        }

        return hasGeoJSON;
      })
      .map(d => {
        const point = centroidLookup[lookupCountryCode(d.country)].centroid;
        return {
          ...d,
          x: point[0],
          y: point[1],
          x0: point[0],
          y0: point[1],
          r: radius(d)
        };
      });

  const key = d => d.country;

  let node = container.selectAll("circle");
  let labels = container.selectAll("text");

  const forceSim = d3.forceSimulation().stop();
  // Speeds up force simulation
  //forceSim.alphaDecay(1 - Math.pow(0.001, 1 / 200))
  // Cartogram
  forceSim.force("collide", d3.forceCollide(d => d.r).strength(strength));
  // Nodes are attracted to their original position
  //forceSim.force("gravity", function(alpha) {
  //const k = 0.01 * alpha;
  //node.each(function(d) {
  //d.x += (d.x0 - d.x) * k;
  //d.y += (d.y0 - d.y) * k;
  //});
  //});
  const TRANSITION_DUR = 200;
  let numIterations = 0;
  forceSim.on("tick", function() {
    node
      .transition()
      .duration(TRANSITION_DUR)
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .attr("r", d => d.r)
      .style("fill", fill)
      .style("stroke", stroke);

    labels
      .transition()
      .duration(TRANSITION_DUR)
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });
    numIterations += 1;
    if (numIterations > iterations) {
      forceSim.stop();
    }
  });

  const update = data => {
    const nodes = createNodes(data);
    node = container
      .selectAll("circle")
      .data(nodes, key)
      .join(
        enter =>
          enter
            .append("circle")
            .attr("r", d => d.r)
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            })
            .style("stroke", stroke)
            .style("opacity", 0.9)
            .style("fill", fill)
            .on("mouseover", function(d) {
              console.log(d.country);
            }),
        update =>
          update
            .transition()
            .duration(TRANSITION_DUR)
            .attr("r", d => d.r)
            .style("fill", fill)
            .style("stroke", stroke)
      );

    labels = container
      .selectAll("text")
      .data(nodes.filter(labelFilter), key)
      .join(enter =>
        enter
          .append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .style("fill", "#222")
          .text(function(d) {
            return d.country;
          })
          .style("font-size", "24px")
          .style("font-family", "Helvetica")
          .attr("x", function(d) {
            return d.x;
          })
          .attr("y", function(d) {
            return d.y;
          })
      );
    numIterations = 0;
    forceSim
      .nodes(nodes)
      .alpha(1)
      .restart();
  };

  update(data);

  return {
    update
  };
}
