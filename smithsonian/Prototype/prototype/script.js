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
    const height = 6000;
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
// Create all three images
const epipelagicImage = svg.append("image")
    .attr("href", "images/epipelagic-modal.png")
    .attr("x", 900)
    .attr("y", 105)
    .attr("width", 298)
    .attr("height", 950)
    .attr("class", "sticky-image");

const mesophoticImage = svg.append("image")
    .attr("href", "images/mesophotic-modal.png")
    .attr("x", 900)
    .attr("y", 105)
    .attr("width", 298)
    .attr("height", 950)
    .attr("class", "sticky-image")
    .style("opacity", 0);

const benthicImage = svg.append("image")
    .attr("href", "images/benthic-modal.png")
    .attr("x", 900)
    .attr("y", 105)
    .attr("width", 298)
    .attr("height", 950)
    .attr("class", "sticky-image")
    .style("opacity", 0);

// Store the original Y position and sticky offset
const originalImageY = 105;
const stickyOffset = 10;

// Add scroll event listener
window.addEventListener('scroll', function() {
    // Get the SVG container's bounds
    const svgRect = svg.node().getBoundingClientRect();
    
    // Find both depth labels
    const mesophoticDepthLabel = svg.selectAll('.depth-label')
        .filter(d => d === "200-300 meters")
        .node();
    
    const benthicDepthLabel = svg.selectAll('.depth-label')
        .filter(d => d === "1000-2000 meters")
        .node();
    
    if (!mesophoticDepthLabel || !benthicDepthLabel) return;
    
    const mesophoticBounds = mesophoticDepthLabel.getBoundingClientRect();
    const benthicBounds = benthicDepthLabel.getBoundingClientRect();
    
    // Calculate scroll position
    const scrollThreshold = svgRect.top + originalImageY;
    
    if (-scrollThreshold > -stickyOffset) {
        // Calculate new Y position
        const newY = Math.abs(svgRect.top) + stickyOffset;
        const finalY = Math.min(newY, svgRect.height - 963 - stickyOffset);
        
        // Update Y positions for all images
        epipelagicImage.attr("y", finalY);
        mesophoticImage.attr("y", finalY);
        benthicImage.attr("y", finalY);
        
        // Handle transitions based on depth ranges
        if (benthicBounds.top <= window.innerHeight / 2) {
            // Show benthic image
            epipelagicImage.style("opacity", 0);
            mesophoticImage.style("opacity", 0);
            benthicImage.style("opacity", 1);
        } else if (mesophoticBounds.top <= window.innerHeight / 2) {
            // Show mesophotic image
            epipelagicImage.style("opacity", 0);
            mesophoticImage.style("opacity", 1);
            benthicImage.style("opacity", 0);
        } else {
            // Show epipelagic image
            epipelagicImage.style("opacity", 1);
            mesophoticImage.style("opacity", 0);
            benthicImage.style("opacity", 0);
        }
    } else {
        // Reset to original positions
        epipelagicImage.attr("y", originalImageY);
        mesophoticImage.attr("y", originalImageY);
        benthicImage.attr("y", originalImageY);
        
        // Reset opacities to initial state
        epipelagicImage.style("opacity", 1);
        mesophoticImage.style("opacity", 0);
        benthicImage.style("opacity", 0);
    }
});

        
    
    // Add a group for the legend
// Reference the new SVG inside the div
const legendSvg = d3.select("#legend-svg")
.attr("preserveAspectRatio", "xMidYMid meet");


// Add a group for the legend elements
const legend = legendSvg.append("g")
    .attr("id", "legend")

// Add a rectangle (box) to contain the legend
legend.append("rect")
    .attr("x", 350)  
    .attr("y", 220)
    .attr("width", 1000)  
    .attr("height", 200) 
    .attr("fill", "none")
    .attr("stroke", "#B7B3AD")
    .attr("stroke-width", 0.5)
    .attr("rx", 10)
    .attr("ry", 10);     

// Add the "Legend" label
legend.append("text")
    .attr("x", 400)
    .attr("y", 330) // Adjusted y position
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .style("font-family", "'Cormorant Garamond', serif")
    .style("font-size", "48px")
    .style("font-weight", "bold")
    .style("fill", "#B7B3AD")
    .text("Legend");

// Add the paragraph text lines
const paragraphTextLines = [
    "Circle size correlates with",
    "the number of images",
    "at that depth"
];

paragraphTextLines.forEach((line, index) => {
    legend.append("text")
        .attr("x", 900) // Position to the right of the circles
        .attr("y", 280 + index * 25) // Adjust the y position for each line
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .style("font-family", "'Inter', sans-serif")
        .style("font-size", "20px")
        .style("fill", "#B7B3AD")
        .text(line);
});

// Draw the horizontal line and arrowhead as before
legend.append("line")
    .attr("x1", 900)   
    .attr("y1", 370)   
    .attr("x2", 1250)  
    .attr("y2", 370)   
    .attr("stroke", "#B7B3AD")
    .attr("stroke-width", 1);

// Draw the arrowhead
const arrowLength = 10; 
const arrowWidth = 5;  

legend.append("line")
    .attr("x1", 1250)                  
    .attr("y1", 370)                   
    .attr("x2", 1250 - arrowLength)    
    .attr("y2", 370 - arrowWidth)      
    .attr("stroke", "#B7B3AD")         
    .attr("stroke-width", 1);

legend.append("line")
    .attr("x1", 1250)                  
    .attr("y1", 370)                   
    .attr("x2", 1250 - arrowLength)    
    .attr("y2", 370 + arrowWidth)      
    .attr("stroke", "#B7B3AD")         
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
        .range([200, height - 200]);

    // Create x scale for spacing
    const xScale = d3.scalePoint()
        .domain(bubbleData.map((d, i) => i))  // Use indices for x positioning
        .range([width / 7 + 10, (3 * width) / 4 + 10]);  // Shifted to the right by adding 50

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
    .attr("cx", width / 6) // Use a fixed x position for all bubbles
    .attr("cy", d => yScale(d.group))
    .attr("r", d => sizeScale(d.count))
    .attr("fill", "url(#bubbleGradient)")
    .style("opacity", 0.7) // Set initial opacity to 0.7
    .on("mouseover", function(event, d) {
        // Change opacity to 1 on hover
        d3.select(this).style("opacity", 1);

        // Tooltip logic
        chartTooltip.style("opacity", 1);
        chartTooltip.select(".chart-tooltip")
            .html(`${d.group}: ${d.count} items`)
            .style("visibility", "visible");
        chartTooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
    })
    .on("mouseout", function(d) {
        // Revert opacity to 0.7 when mouse leaves
        d3.select(this).style("opacity", 0.7);

        // Hide the tooltip
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

        const overlay = d3.select("body").append("div")
        .attr("class", "overlay")
        .on("click", function() {
            closePopup();
        });
        
        // Create a sticky header for title and close button
        const stickyHeader = imageContainer.append("div")
            .attr("class", "modal-sticky-header");
            
        // Add the title to the sticky header
        stickyHeader.append("h2")
            .attr("class", "depth-title")
            .text(`Images for ${depthGroup}`);
            
        // Add close button to the sticky header
        stickyHeader.append("button")
            .attr("aria-label", "Close")  // For accessibility
            .on("click", function() {
                closePopup();
            });
        
        // Create a scrollable content area
        const scrollContent = imageContainer.append("div")
            .attr("class", "modal-scroll-content");
            
        // Create a grid container for the images inside the scrollable area
        const gridContainer = scrollContent.append("div")
            .attr("class", "image-grid-container");
            
        // Create image elements
        gridContainer.selectAll(".depth-image")
            .data(imagesForDepth)
            .enter()
            .append("div")
            .attr("class", "depth-image")
            .html(d => `
                <div class="image-wrapper-grid">
                    <img src="${d.imageGUID}" alt="${d.title}">
                </div>
                <p>${d.title}</p>
                <p>Depth: ${d.depth} meters</p>
                <p>Country: ${d.country}</p>
                <a href="${d.link}" target="_blank">More Info</a>
            `);
    
        // Show the image container
        imageContainer.style("display", "block");
        document.addEventListener('click', closePopupOnOutsideClick);
    }

    function closePopup() {
        d3.select("#depth-images-container").style("display", "none");
        d3.select(".overlay").remove(); // Remove overlay
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
// chartGroup.selectAll(".vertical-line")
// .data(bubbleData)
// .enter()
// .append("line")
// .attr("class", "vertical-line")
// .attr("x1", (d, i) => xScale(i)) // X position of the bubble
// .attr("y1", 100) // Start at the top of the horizontal line
// .attr("x2", (d, i) => xScale(i)) // X position of the bubble
// .attr("y2", d => yScale(d.group) - sizeScale(d.count)) // Go to the top of the bubble
// .attr("stroke", "#B7B3AD")
// .attr("stroke-width", 0.15)
// .attr("stroke-opacity", 0.7); // Adjust opacity here (0 is fully transparent, 1 is fully opaque)

//this is where modal used to be appended. 



    // Add vertical line
    chartGroup.append("line")
        .attr("x1", 125)
        .attr("y1", 100)
        .attr("x2", 125)
        .attr("y2", height - 10)
        .attr("stroke", "#B7B3AD")
        .attr("stroke-width", 0.5);

    // Add horizontal line at the top
    chartGroup.append("line")
        .attr("x1", 125)
        .attr("y1", 100)
        .attr("x2", width - 380)
        .attr("y2", 100)
        .attr("stroke", "#B7B3AD")
        .attr("stroke-width", 0.5);
    
        // Add a dotted horizontal line at 200-300 meters
    chartGroup.append("line")
        .attr("x1", 150)  // Start from the left of the chart
        .attr("x2", width -170)  // Extend to the right of the chart
        .attr("y1", yScale("200-300 meters"))  // Position based on the yScale for 200-300 meters
        .attr("y2", yScale("200-300 meters"))  // Same as y1 to keep it horizontal
        .attr("stroke", "#B7B3AD")  // Line color
        .attr("stroke-width", 1)  // Line thickness
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-opacity", 0.5);  // set opacity of the stroke to 0.5  // Dotted line style (5px dash, 5px gap)

       // Add a dotted horizontal line at 1000-2000 meters
       chartGroup.append("line")
        .attr("x1", 150)  // Start from the left of the chart
        .attr("x2", width - 170)  // Extend to the right of the chart
        .attr("y1", yScale("1000-2000 meters"))  // Position based on the yScale for 200-300 meters
        .attr("y2", yScale("1000-2000 meters"))  // Same as y1 to keep it horizontal
        .attr("stroke", "#B7B3AD")  // Line color
        .attr("stroke-width", 1)  // Line thickness
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-opacity", 0.5);  // set opacity of the stroke to 0.5  // Dotted line style (5px dash, 5px gap)
       

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

// Append arrows next to the y-axis labels
const arrowGroup = chartGroup.append("g")
    .attr("class", "arrow-group")
    .attr("transform", "translate(-60, 0)"); // Position arrows to the left of the y-axis

// Append animated arrows next to each depth label
arrowGroup.selectAll(".arrows")
    .data(depthGroups)
    .enter()
    .append("svg")
    .attr("class", "arrows")
    .attr("x", -30) // Adjust to center smaller arrows
    // .attr("y", 450)
    .attr("y", d => yScale(d) - 20) // Adjust the y position to align with the labels
    .attr("width", 30) // Adjusted width
    .attr("height", 40) // Adjusted height
    .html(`
        <path class="a1" d="M0 0 L15 16 L30 0"></path> <!-- Adjusted coordinates for smaller size -->
        <path class="a2" d="M0 10 L15 26 L30 10"></path> <!-- Adjusted coordinates for smaller size -->
        <path class="a3" d="M0 20 L15 36 L30 20"></path> <!-- Adjusted coordinates for smaller size -->
    `);


});

