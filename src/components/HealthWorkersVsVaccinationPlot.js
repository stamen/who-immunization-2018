import * as d3 from 'd3';

const plotWidth = 1000;
const plotHeight = 500;

class HealthWorkersVsVaccinationPlot {
  constructor(props) {
    const { containerEl, countries, countryCode, getWuenicDataForCountry, healthWorkerDataProvider } = props;
    const dpt3ForCountry = getWuenicDataForCountry(countryCode);
    const healthWorkersForCountry = healthWorkerDataProvider.getHealthWorkerPerPopForCountry(
      countryCode
    );
    const healthWorkerTotal = healthWorkerDataProvider.getHealthWorkerTotalForCountry(countryCode);

    console.log("dpt3ForCountry");
    console.log(dpt3ForCountry);
    console.log("healthWorkersForCountry");
    console.log(healthWorkersForCountry);
    console.log("healthWorkerTotal");
    console.log(healthWorkerTotal);

    const vaccinationExtents = d3.extent(dpt3ForCountry, d => d.WUENIC);
    const healthWorkerExtents = d3.extent(
      healthWorkersForCountry,
      d => d.nursingMidwiferyPerPop
    );

    const years = new Set();
    dpt3ForCountry.forEach(row => years.add(row.year));
    healthWorkersForCountry.forEach(row => years.add(row.year));

    const yearsList = Array.from(years).sort();

    const domain = d3.extent(yearsList);

    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = plotWidth - margin.left - margin.right,
      height = plotHeight - margin.top - margin.bottom;

    var xScale = d3
      .scaleLinear()
      .domain(domain)
      .range([0, width]);

    var vaccinationYScale = d3
      .scaleLinear()
      .domain([vaccinationExtents[0] * 0.95, vaccinationExtents[1] * 1.05])
      .range([height, 0]);

    var healthWorkerYScale = d3
      .scaleLinear()
      .domain(healthWorkerExtents)
      .range([height, 0]);

    const vaccinationLine = d3
      .line()
      .x(d => xScale(d.year))
      .y(d => vaccinationYScale(d.WUENIC));

    const healthWorkerLine = d3
      .line()
      .x(d => xScale(d.year))
      .y(d => healthWorkerYScale(d.nursingMidwiferyPerPop));

    var svg = containerEl
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("class", "title")
      .append("text")
      .text(countries[countryCode].name);

    svg
      .append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).ticks(yearsList.length, "i"));

    svg
      .append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(vaccinationYScale).tickFormat(d => `${d}%`));

    svg
      .append("path")
      .datum(dpt3ForCountry)
      .attr("class", "line")
      .attr("d", vaccinationLine);

    //svg.selectAll(".dot")
    //.data(dpt3ForCountry)
    //.enter().append("circle")
    //.attr("class", "dot")
    //.attr("cx", function(d) { return xScale(d.year) })
    //.attr("cy", function(d) { return vaccinationYScale(d.WUENIC) })
    //.attr("r", 5);

    svg
      .append("path")
      .datum(healthWorkersForCountry)
      .attr("class", "line secondary")
      .attr("d", healthWorkerLine);

    svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`)
      .attr("class", "yaxis secondary")
      .call(d3.axisRight(healthWorkerYScale));
  }
}

export default HealthWorkersVsVaccinationPlot;
