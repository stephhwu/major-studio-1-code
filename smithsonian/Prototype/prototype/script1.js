// Define the depth group
const depthGroup = [
    "0-10 meters", "10-20 meters", "20-30 meters", "30-40 meters", 
    "40-50 meters", "50-75 meters", "75-100 meters", "100-150 meters", 
    "150-200 meters", "200-300 meters", "300-500 meters", "500-1000 meters", 
    "1000-2000 meters", "2000-3000 meters", "3000-4000 meters"
];

// Load the data and create the visualization
d3.json("everything.json").then(data => {
    // Count items for each depth group
    const groupCounts = {};
    depthGroup.forEach(group => groupCounts[group] = 0);
    
    data.forEach(item => {
        if (groupCounts.hasOwnProperty(item.depthGroup)) {
            groupCounts[item.depthGroup]++;
        }
    });

    // Prepare data for D3
    const bubbleData = Object.entries(groupCounts).map(([group, count]) => ({
        group,
        count
    }));

    // Set up SVG dimensions and margins
    const margin = { top: 20, right: 20, bottom: 120, left: 70 };
    const width = 1200 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom; // Increased height

    const svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Append a group element to account for margins
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create scale for bubble size
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(bubbleData, d => d.count)])
        .range([5, 50]);

    // Create scale for bubble position
    const xScale = d3.scalePoint()
        .domain(depthGroup)
        .range([0, width]);

    // Create color scale using the defined linear gradient
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
        .attr("id", "bubbleGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "70%")
        .attr("y2", "70%");

    linearGradient.append("stop")
        .attr("offset", "18.75%")
        .attr("stop-color", "#F49AAB")
        .attr("stop-opacity", "0.28");

    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#9FB1C4")
        .attr("stop-opacity", "0.5");

    // Tooltip element
    const chartTooltip = d3.select("#chartTooltip");

    // Create bubbles
    g.selectAll(".bubble")
        .data(bubbleData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d.group))
        .attr("cy", height / 2)
        .attr("r", d => sizeScale(d.count))
        .attr("fill", "url(#bubbleGradient)") // Use the gradient for fill
        .on("mouseover", function(event, d) {
            chartTooltip.style("opacity", 1);
            chartTooltip.select(".chart-tooltip")
                .html(`${d.group}: ${d.count} items`)
                .style("visibility", "visible");
            chartTooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            chartTooltip.style("opacity", 0);
            chartTooltip.select(".chart-tooltip")
                .style("visibility", "hidden");
        });

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);

    g.append("g")
        .attr("transform", `translate(0, ${height})`) // Position axis at the bottom
        .call(xAxis)
        .selectAll("text")
        .style("font-family", "Inter") // Set font to Inter
        .style("font-size", "14px") // Adjust font size as desired
        .style("fill", "#B7B3AD") // Set text color to #B7B3AD
        .attr("transform", "rotate(-45)") // Rotate labels for better visibility
        .style("text-anchor", "end");

    // Adjust x-axis line and tick color
    g.selectAll(".domain") // Select the x-axis line (path)
        .attr("stroke", "#B7B3AD"); // Set axis line color to #B7B3AD

    g.selectAll(".tick line") // Select tick lines
        .attr("stroke", "#B7B3AD"); // Set tick line color to #B7B3AD

});
