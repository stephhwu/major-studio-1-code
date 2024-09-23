// Load the data from the JSON file
d3.json("data-depth.json").then(data => {
    // Group data by depthGroup and count occurrences
    const depthCounts = d3.rollup(data, v => v.length, d => d.depthGroup);
    
    // Convert to an array of objects for D3, filling in missing categories with 0 counts
    const bubbles = depthCategories.map(depthGroup => ({
        depthGroup,
        count: depthCounts.get(depthGroup) || 0
    }));

    // Replace zero counts with 1 for logarithmic scale
    const adjustedBubbles = bubbles.map(d => ({
        depthGroup: d.depthGroup,
        count: d.count === 0 ? 1 : d.count // Replace 0 with 1
    }));

    // Debugging: log adjusted bubbles
    console.log(adjustedBubbles);

    // Set a scale for the bubble size based on count
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(adjustedBubbles, d => d.count)]) // Input domain
        .range([0, 100]); // Output range (max radius)

    // Set scales for the x-axis and y-axis
    const xScale = d3.scaleBand()
        .domain(adjustedBubbles.map(d => d.depthGroup)) // Set domain to depth groups
        .range([50, width - 50]) // X range with some padding
        .padding(0.1); // Add padding between bubbles

    const yScale = d3.scaleLog()
        .domain([1, d3.max(adjustedBubbles, d => d.count)]) // Log scale, starting at 1
        .range([height - 20, 20]); // Inverted y-axis

    // Add the bubbles to the chart
    svg.selectAll("circle")
        .data(adjustedBubbles)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d.depthGroup) + xScale.bandwidth() / 2) // X-position based on xScale
        .attr("cy", d => yScale(d.count)) // Y-position based on count
        .attr("r", d => sizeScale(d.count)) // Radius based on count
        .style("fill", (d, i) => d3.schemeCategory10[i % 10]) // Color
        .on("mouseover", function(event, d) {
            d3.select(this).transition().duration(200).style("fill-opacity", 1);
            // Add tooltip logic here if desired
        })
        .on("mouseout", function(d) {
            d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
        });

    // Add labels for depth groups
    svg.selectAll("text")
        .data(adjustedBubbles)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.depthGroup) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.count))
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => d.depthGroup);
    
    // Add the x-axis without labels
    svg.append("g")
        .attr("transform", `translate(0, ${height - 20})`) // Move the x-axis to the bottom
        .call(d3.axisBottom(xScale).tickFormat('')); // Create x-axis without labels
}).catch(error => {
    console.error('Error loading the data:', error);
});
