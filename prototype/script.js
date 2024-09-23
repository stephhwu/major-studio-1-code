// Depth groups
const depthGroups = [
    "0-10 meters", "10-20 meters", "20-30 meters", "30-40 meters", 
    "40-50 meters", "50-75 meters", "75-100 meters", "100-150 meters", 
    "150-200 meters", "200-300 meters", "300-500 meters", "500-1000 meters", 
    "1000-2000 meters", "2000-3000 meters", "3000-4000 meters"
];

// Load the data and create the visualization
d3.json("everything.json").then(data => {
    // Count items for each depth group
    const groupCounts = {};
    depthGroups.forEach(group => groupCounts[group] = 0);
    
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

    // Set up SVG
    const width = 1728;
    const height = 5500;
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Add a group for the legend
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(50, 20)`); // Adjusted y position

    // Add a rectangle (box) to contain the legend
// Add a rectangle (box) to contain the legend
legend.append("rect")
    .attr("x", 350)  // Adjusted x position
    .attr("y", 220)
    .attr("width", 1000)  // Adjust the width as needed
    .attr("height", 200)  // Adjust the height as needed
    .attr("fill", "none")
    .attr("stroke", "#B7B3AD")
    .attr("stroke-width", 0.5)
    .attr("rx", 10)      // Rounded corners
    .attr("ry", 10);     

// Add the "Legend" label
legend.append("text")
    .attr("x",400)
    .attr("y", 330) // Adjusted y position
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .style("font-family", "'Cormorant Garamond', serif") // Apply the font
    .style("font-size", "48px")
    .style("font-weight", "bold")
    .style("fill", "#B7B3AD")  // Set text color
    .text("Legend");

// Define the lines of the paragraph text
const paragraphTextLines = [
    "Circle size correlates with",
    "the number of images",
    "at that depth"
];

// Add the paragraph text with line breaks
paragraphTextLines.forEach((line, index) => {
    legend.append("text")
        .attr("x", 900) // Position to the right of the circles
        .attr("y", 280 + index * 25) // Adjust the y position for each line
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .style("font-family", "'Inter', sans-serif") // Change to Inter Regular
        .style("font-size", "20px") // Adjust font size as needed
        .style("fill", "#B7B3AD")  // Set text color
        .text(line);
});

// Draw the horizontal line
legend.append("line")
    .attr("x1", 900)   // Starting x position (left)
    .attr("y1", 370)   // Y position below the text
    .attr("x2", 1250)  // Ending x position (right)
    .attr("y2", 370)   // Keep y position the same for a horizontal line
    .attr("stroke", "#B7B3AD") // Line color
    .attr("stroke-width", 1);

// Draw the arrowhead at the right end of the line
const arrowLength = 10; // Length of the arrowhead
const arrowWidth = 5;   // Width of the arrowhead

// Left side of the arrowhead
legend.append("line")
    .attr("x1", 1250)                  // X position for the start of the arrowhead
    .attr("y1", 370)                   // Same Y position
    .attr("x2", 1250 - arrowLength)    // X position for the end of the left arrowhead
    .attr("y2", 370 - arrowWidth)      // Y position for the left arrowhead
    .attr("stroke", "#B7B3AD")         // Line color
    .attr("stroke-width", 1);

// Right side of the arrowhead
legend.append("line")
    .attr("x1", 1250)                  // X position for the start of the arrowhead
    .attr("y1", 370)                   // Same Y position
    .attr("x2", 1250 - arrowLength)    // X position for the end of the right arrowhead
    .attr("y2", 370 + arrowWidth)      // Y position for the right arrowhead
    .attr("stroke", "#B7B3AD")         // Line color
    .attr("stroke-width", 1);



// Add the circles with different sizes to represent various data counts
const circleData = [
    { size: 60 },  // Replace with your data category
    { size: 100 }, // Replace with your data category
    { size: 130 }   // Replace with your data category
];

// Add the circles
circleData.forEach((d, i) => {
    legend.append("circle")
        .attr("cx", 650 + i * 70) // Adjust spacing between circles as needed
        .attr("cy", 330)            // Center of the box vertically
        .attr("r", d.size / 2)     // Adjust radius according to your legend sizes
        .attr("fill", "url(#bubbleGradient)");
});



    // Add linear gradient definition
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

    // Create scale for bubble size
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(bubbleData, d => d.count)])
        .range([5, 100]);

    // Create scale for bubble position
    const yScale = d3.scalePoint()
        .domain(depthGroups)
        .range([600, height - 40]);

    // Create x scale for spacing
    const xScale = d3.scalePoint()
        .domain(bubbleData.map((d, i) => i))  // Use indices for x positioning
        .range([width / 7 + 50, (3 * width) / 4 + 50]);  // Shifted to the right by adding 50

    // Create a group for the chart
    const chartGroup = svg.append("g")
        .attr("transform", "translate(170, 0)"); // Shift the entire chart to the right

// Create a div for the tooltip
const chartTooltip = d3.select("body").append("div")
    .attr("class", "tooltip-container chart-tooltip-container")
    .style("opacity", 0);

chartTooltip.append("div")
    .attr("class", "tooltip chart-tooltip");

// Create bubbles
chartGroup.selectAll(".bubble")
    .data(bubbleData)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", (d, i) => xScale(i))
    .attr("cy", d => yScale(d.group))
    .attr("r", d => sizeScale(d.count))
    .attr("fill", "url(#bubbleGradient)")
    .on("mouseover", function(event, d) {
        chartTooltip.style("opacity", 1);
        chartTooltip.select(".chart-tooltip")
            .html(`${d.group}: ${d.count} items`)
            .style("visibility", "visible");
        chartTooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
    })
    .on("mouseout", function(d) {
        chartTooltip.style("opacity", 0);
        chartTooltip.select(".chart-tooltip")
            .style("visibility", "hidden");
        })
        .on("click", function(event, d) {
            displayImagesForDepth(d.group);
    });

    function displayImagesForDepth(depthGroup) {
        // Filter the data for the selected depth group
        const imagesForDepth = data.filter(item => item.depthGroup === depthGroup);
        
        // Clear existing images
        const imageContainer = d3.select("#depth-images-container"); 
        imageContainer.html(""); 
        
        // Display the depth group
        imageContainer.append("h2")
            .text(`Images for ${depthGroup}`)
            .style("font-family", "'Cormorant Garamond', serif")
            .style("text-align", "center")
            .style("font-size", "20px")
            .style("font-weight", "bold");
            
        
        // Create image elements
        imageContainer.selectAll(".depth-image")
            .data(imagesForDepth)
            .enter()
            .append("div")
            .attr("class", "depth-image")
            .html(d => `
                <img src="${d.imageGUID}" alt="${d.title}">
                <p>${d.title}</p>
                <p>Depth: ${d.depth} meters</p>
                <p>Country: ${d.country}</p>
                <a href="${d.link}" target="_blank">More Info</a>
            `);
        
        // Show the image container
        imageContainer.style("display", "block");
        document.addEventListener('click', closePopupOnOutsideClick);

    }

    
    
    // Add a close button to the image container
    d3.select("#depth-images-container")
        .append("button")
        .text("Close")
        .on("click", function() {
            d3.select("#depth-images-container").style("display", "none");
        });

    // Add depth labels
    chartGroup.selectAll(".depth-label")
        .data(depthGroups)
        .enter()
        .append("text")
        .attr("class", "depth-label")
        .attr("x", 95)
        .attr("y", d => yScale(d))
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text(d => d);
    
    // After creating bubbles, add vertical lines
chartGroup.selectAll(".vertical-line")
.data(bubbleData)
.enter()
.append("line")
.attr("class", "vertical-line")
.attr("x1", (d, i) => xScale(i)) // X position of the bubble
.attr("y1", 500) // Start at the top of the horizontal line
.attr("x2", (d, i) => xScale(i)) // X position of the bubble
.attr("y2", d => yScale(d.group) - sizeScale(d.count)) // Go to the top of the bubble
.attr("stroke", "#B7B3AD")
.attr("stroke-width", 0.15)
.attr("stroke-opacity", 0.7); // Adjust opacity here (0 is fully transparent, 1 is fully opaque)



    // Add vertical line
    chartGroup.append("line")
        .attr("x1", 125)
        .attr("y1", 500)
        .attr("x2", 125)
        .attr("y2", height - 10)
        .attr("stroke", "#B7B3AD")
        .attr("stroke-width", 0.5);

    // Add horizontal line at the top
    chartGroup.append("line")
        .attr("x1", 125)
        .attr("y1", 500)
        .attr("x2", width - 380)
        .attr("y2", 500)
        .attr("stroke", "#B7B3AD")
        .attr("stroke-width", 0.5);

// Select all hover images and add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const tooltipContainers = document.querySelectorAll('.tooltip-container');

    tooltipContainers.forEach(container => {
        const hoverImage = container.querySelector('.hover-image');
        const tooltip = container.querySelector('.tooltip');

        hoverImage.addEventListener('mouseover', function() {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });

        hoverImage.addEventListener('mouseout', function() {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
    });
});

});

// d3.selectAll(".hover-image")
//     .on("mouseover", function(event, d) {
//         const tooltip = d3.select(this.parentNode).select(".tooltip");
//         tooltip.style("visibility", "visible")
//                .text("The uppermost layer of the ocean that receives abundant sunlight. It supports diverse marine life, including phytoplankton and various fish species, and is crucial for photosynthesis, making it highly productive within the ocean's food web.") // Update this to set specific text if needed
//                .style("top", (event.pageY - 400) + "px")
//                .style("left", (event.pageX + 5) + "px");
//     })
    
//     .on("mouseout", function() {
//         const tooltip = d3.select(this.parentNode).select(".tooltip");
//         tooltip.style("visibility", "hidden");
//     });

