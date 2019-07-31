import { geoTimes } from 'd3-geo-projection';

export const makeProjection = (width, height) => geoTimes()
  .scale(700)
  .translate([width / 2, height / 2])
  .precision(.1);
