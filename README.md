# WHO Immunization Report 2018 Visualizations
Data and code for generating visualizations for the 2018 WHO Immunization Report.

The visualizations generated here were exported as SVG and further altered by hand before the final report was produced.

After a build, the `dist/` directory will contain a static site for viewing all the plots and sketches.

## Code Structure

Visualizations are written in D3.js.

Numbered directories (i.e. `src/01_top_10_bubble`) contain the visualizations used in the report, the `src/sketches/` directory contains the remaining experiments.

The `src/components/` directory contains both visualization and data processing components that are reused or otherwise not specific to a single visualization.

The `src/data/` directory contains data from WHO spreadsheets that is unaltered other than to convert to .csv or rename columns in some cases.

## Developing
[Parcel](https://parceljs.org/) is used for writing code in ES6 and building to static HTML.

Install dependencies:

    $ npm install

Start development environment:

    $ npm run start

Build for deployment:

    $ npm run build

## Exporting
Many sketches have a download link at the bottom of the SVG for downloading it and also have rendered a .png bitmap below the SVG.  This is possible via the methods written in `components/renderHelpers.js`.

### Coverage Dorling Map
To switch between dtp1 and dtp3, change the state variable.

To export still image of final year, wait until animation finishes and take a screenshot.

To render gif:

* Take screen recording
* trim beginning and end
* Use Adobe Media Encoder to change resolution (currently 1024 width) and export .gif
* Open in Photoshop and use "Export -> Save for Web (Legacy)" to export as a 128 color .gif
