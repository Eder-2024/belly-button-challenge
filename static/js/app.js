// Function to build the metadata panel
function buildMetadata(sample) {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field from the data
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(meta => meta.id == sample)[0];

    // Select the panel with id `#sample-metadata` and clear any existing metadata
    let panel = d3.select("#sample-metadata");
    panel.html("");

    // Append key-value pairs to the panel as text
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build the bar and bubble charts
function buildCharts(sample) {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field from the data
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Extract the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth" // Colorscale for marker colors
      }
    };
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
    };
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // Build a Bar Chart
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(), // Top 10 sample values
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(), // Top 10 OTU IDs
      text: otu_labels.slice(0, 10).reverse(), // Hover text for top 10
      type: "bar",
      orientation: "h" // Horizontal bar chart
    };
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Sample Values" },
    };
    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}

// Function to initialize the dashboard on page load
function init() {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field and populate the dropdown menu
    let names = data.names;
    let dropdown = d3.select("#selDataset");

    // Append each sample name as an option in the dropdown
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Build charts and metadata panel with the first sample
    let firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to update the dashboard when a new sample is selected
function optionChanged(newSample) {
  // Rebuild charts and metadata panel for the selected sample
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();