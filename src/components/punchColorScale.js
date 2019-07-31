import { scaleThreshold } from 'd3';

export const punchColorScale = scaleThreshold()
  .domain([0.6, 0.7, 0.8, 0.9, 0.95, 1])
  .range([
    "#d73027",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#66bd63",
    "#1a9850"
  ]);
