import * as d3 from "d3";

import polioDataURL from "/data/polio.csv";
import wuenicMasterDataURL from "/data/wuenic_master.csv.0";

import PolioDataProvider from "./PolioDataProvider";
import WuenicMasterDataProvider from "/components/WuenicMasterDataProvider";

import "/index.scss";
import "./index.scss";

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(polioDataURL), d3.csv(wuenicMasterDataURL)]).then(
    function([polioData, wuenicMasterData]) {
      const polioDataProvider = new PolioDataProvider({
        polioData
      });

      const wuenicDataProvider = new WuenicMasterDataProvider({
        wuenicMasterData
      });

      const width = 1440;
      const height = 900;
      const innerRadius = 0.0;
      const radius = height * 0.4;

      const plotSVG = d3
        .select("body")
        .append("svg")
        .attr("class", "polio_pie")
        .attr("width", width)
        .attr("height", height);

      const labelContainer = d3
        .select("body")
        .append("div")
        .attr("class", "polio_pie_labels")
        .style("width", width)
        .style("height", height);

      const container = plotSVG
        .append("g")
        .attr("transform", `translate(${0.5 * width}, ${0.5 * height})`);

      const toLabelContainerCoordinates = ([x, y]) => [
        x + 0.5 * width,
        y + 0.5 * height
      ];

      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);
      
      const labelArc = d3
        .arc()
        .innerRadius(1.1 * radius)
        .outerRadius(1.3 * radius);

      const polioCountryData = polioDataProvider.getRows().map(d => {
        const countryCode = d.countryCode;
        const coverageRow = wuenicDataProvider.getRowForCountryYearAndVaccine(
          countryCode,
          2017,
          "dtp3"
        );
        if (!coverageRow) {
          throw new Error(
            `Couldn't find coverage row for country ${countryCode}`
          );
        } else {
          const total = coverageRow.childrenInTarget;
          if (isNaN(total)) {
            throw new Error(`Couldn't find total for country ${countryCode}`);
          }
          return {
            ...d,
            total
          };
        }
      });

      //console.log("polioCountryData");
      //console.log(polioCountryData);

      const backgroundContainer = container.append("g");
      const pieFillContainer = container.append("g");

      const pie = d3
        .pie()
        .sort((a, b) => d3.ascending(a.bothOPVAndIPV, b.bothOPVAndIPV))
        .value(d => d.total);

      const pieData = pie(polioCountryData);

      // Calculates the outer radius for a pie fill section
      const fillOuterRadius = (area, theta) => Math.sqrt((area * 2) / theta);

      // Calculates the area of a circle section
      const sectionArea = (radius, theta) => theta * Math.pow(radius, 2) * 0.5;

      // Splits each country into 3 data points for filling the pie
      const pieAttributes = ["bothOPVAndIPV", "onlyOPV", "notProtected"];
      const pieFillData = pieData
        .reduce((pieFillData, d) => {
          const theta = d.endAngle - d.startAngle;
          // Calculates the total area of this country's pie slice
          const totalSectionArea = sectionArea(radius, theta);
          // Stores the area of each fill section
          const sectionAreasForAttributes = [];
          const radiusDataForAttributes = [];
          pieAttributes.forEach((name, i) => {
            const fillSectionArea = totalSectionArea * (d.data[name] / 100.0);
            sectionAreasForAttributes.push(fillSectionArea);
            let fillSectionInnerRadius;

            const previousAreas = sectionAreasForAttributes.slice(0, i + 1);
            const fillSectionOuterRadius = fillOuterRadius(
              d3.sum(previousAreas),
              theta
            );
            if (i === 0) {
              //fillSectionOuterRadius = percentRadiusScale(d.data[name]);
              fillSectionInnerRadius = innerRadius;
            } else {
              fillSectionInnerRadius =
                radiusDataForAttributes[i - 1].outerRadius;
              //fillSectionOuterRadius = radiusDataForAttributes[i - 1].outerRadius +
              //percentRadiusScale(d.data[name])
            }
            radiusDataForAttributes.push({
              innerRadius: fillSectionInnerRadius,
              outerRadius: fillSectionOuterRadius
            });
            pieFillData.push({
              ...d,
              ...radiusDataForAttributes[i],
              data: {
                ...d.data,
                value: d.data[name],
                name
              }
            });
          });
          return pieFillData;
        }, [])
        .sort(
          // Sorts the list to ensure the pie fill sections are drawn based
          // on the attributes listed above.
          (a, b) =>
            pieAttributes.indexOf(a.data.name) <
            pieAttributes.indexOf(b.data.name)
        );

      backgroundContainer
        .selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("class", "background")
        .attr("d", arc);

      const pieFillArc = d3.arc().innerRadius(innerRadius);
      pieFillContainer
        .selectAll("path")
        .data(pieFillData)
        .enter()
        .append("path")
        .attr("class", d => d.data.name)
        .attr("d", d => {
          return pieFillArc({
            ...d
          });
        });

      //pieFillContainer.selectAll("text")
      //.data(pieFillData)
      //.enter()
      //.append("text")
      //.attr("class", "fill_text")
      //.attr("transform", d => {
      //})

      const labels = labelContainer
        .selectAll("div")
        .data(pieData)
        .enter()
        .append("div")
        .attr("class", "polio_pie_label")
        .style(
          "left",
          d => toLabelContainerCoordinates(labelArc.centroid(d))[0]
        )
        .style(
          "top",
          d => toLabelContainerCoordinates(labelArc.centroid(d))[1]
        );
      labels
        .append("div")
        .attr("class", "country_name")
        .text(d => d.data.country);

      pieAttributes.forEach(name =>
        labels
          .append("span")
          .attr("class", `percentage ${name}`)
          .text(d => `${d.data[name]}%`)
      );
    }
  );
});
