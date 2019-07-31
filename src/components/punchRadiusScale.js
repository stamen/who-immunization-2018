import { scaleSqrt } from 'd3';
export const punchRadiusScale = scaleSqrt()
  .range([1.5, 6.5])
  .domain([0, 1])
  .clamp(true);
