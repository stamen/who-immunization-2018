export const renderImageBeneath = (svgSelection, height, width) => {
  /* REPLACE WITH CANVAS, increased by scale factor */
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  var context = canvas.getContext("2d");

  // Convert SVG to Canvas
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
  var DOMURL = window.URL || window.webkitURL || window;

  // Get the string representation of a DOM node (removes the node)
  const domNode = svgSelection.node();

  // Inserts canvas after the node
  domNode.insertAdjacentElement('afterend', canvas);

  const svgString = new XMLSerializer().serializeToString(domNode);

  var image = new Image();
  var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  var url = DOMURL.createObjectURL(svgBlob);

  image.onload = function() {
    context.drawImage(image, 0, 0);
    DOMURL.revokeObjectURL(url);
  };

  image.src = url;
};

export const addSVGDownloadLinkBeneath = (svgSelection) => {
  const domNode = svgSelection.node();
  const svgAsXML = new XMLSerializer().serializeToString(domNode);
  const dataURL = `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`;

  const dl = document.createElement("a");
  dl.setAttribute("href", dataURL);
  dl.setAttribute("download", "download.svg");
  dl.innerHTML = "Download";
  domNode.insertAdjacentElement('afterend', dl);
}
