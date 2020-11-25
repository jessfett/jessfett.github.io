// Use D3 fetch to read the JSON file
d3.json("../data/samples.json").then((givenData) => {

	console.log(givenData);

	var data = givenData;

	var names = data.names;

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
	})

	// Initializes original plots
	function init() {

		// Select 940 Data to Display at Start
		starterData = data.samples.filter(sample => sample.id === "940")[0];
		console.log(starterData);


		allSampleValuesDefault = starterData.sample_values;
        allOtuIdsDefault = starterData.otu_ids;
		allOtuLabelsDefault = starterData.otu_labels;

		// Slice for Tops 10s
		sampleValuesDefault = allSampleValuesDefault.slice(0, 10).reverse();
		otuIdsDefault = allOtuIdsDefault.slice(0, 10).reverse();
		otuLabelsDefault = allOtuLabelsDefault.slice(0, 10).reverse();

		console.log(sampleValuesDefault);
		console.log(otuIdsDefault);
		console.log(otuLabelsDefault);

		// Create Bar Chart using 940
		var trace1 = {
			x: sampleValuesDefault,
			y: otuIdsDefault.map(outId => `OTU ${outId}`),
            text: otuLabelsDefault,
            marker: {
                color: 'orange'
            },
			type: "bar",
			orientation: "h"
		};

		var dataBar = [trace1];


		var layoutBar = {
			title: `<b>Top 10 OTUs in Selected Test Subject IDs<b>`,
			xaxis: { title: "<b>Sample Value<b>"},
			yaxis: { title: "<b>OTU ID<b>"},
			autosize: false,
			width: 500,
			height: 600
        }
        
		Plotly.newPlot("bar", dataBar, layoutBar);

		// Create Bubble Chart using 940
		var trace2 = {
			x: allOtuIdsDefault,
			y: allSampleValuesDefault,
			text: allOtuLabelsDefault,
			mode: 'markers',
			marker: {
				color: allOtuIdsDefault,
				size: allSampleValuesDefault
			}
		};
		
		var dataBubble = [trace2];
		
		var layoutBubble = {
			title: '<b>Sample Values of Selected Test Subject OTU IDs<b>',
			xaxis: { title: "<b>OTU ID<b>"},
			yaxis: { title: "<b>Sample Value<b>"}, 
			showlegend: false,
		};
		
		Plotly.newPlot('bubble', dataBubble, layoutBubble);

		// Show Starting Test Subject, 940
		demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
		console.log(demoDefault);

		// Key-Value Pairs
		Object.entries(demoDefault).forEach(
			([key, value]) => d3.select("#sample-metadata")
													.append("p").text(`${key.toUpperCase()}: ${value}`));

	}

	init();


	//  Update Bar Chart
	d3.selectAll("#selDataset").on("change", updatePlot);

	// INSTRUCTIONS PART 2:  Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
	// This function is called when a dropdown menu item is selected
	function updatePlot() {

        	// Dropdown Menu Selection
			var inputElement = d3.select("#selDataset");
			var inputValue = inputElement.property("value");
			console.log(inputValue);

		// Filter Selection
			dataset = data.samples.filter(sample => sample.id === inputValue)[0];
			console.log(dataset);

		// Selected Subject Data
			allSampleValues = dataset.sample_values;
			allOtuIds = dataset.otu_ids;
			allOtuLabels = dataset.otu_labels;

		// Select the top 10s
		top10Values = allSampleValues.slice(0, 10).reverse();
		top10Ids = allOtuIds.slice(0, 10).reverse();
		top10Labels = allOtuLabels.slice(0, 10).reverse();

		// Upate Bar Chart
		Plotly.restyle("bar", "x", [top10Values]);
		Plotly.restyle("bar", "y", [top10Ids.map(outId => `OTU ${outId}`)]);
		Plotly.restyle("bar", "text", [top10Labels]);

		// Update Bubble Chart
		Plotly.restyle('bubble', "x", [allOtuIds]);
		Plotly.restyle('bubble', "y", [allSampleValues]);
		Plotly.restyle('bubble', "text", [allOtuLabels]);
		Plotly.restyle('bubble', "marker.color", [allOtuIds]);
		Plotly.restyle('bubble', "marker.size", [allSampleValues]);

		// Subject Information
		metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];

		// Refresh & Clear Out Filter
		d3.select("#sample-metadata").html("");

		// Display key-value pairs
		Object.entries(metainfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key.toUpperCase()}: ${value}`));

	
	}
});
