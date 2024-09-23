const apiKey = "prrYie1Ch2wT5MWofSqPcycSSZ8MAMuu90QneT4V";  
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";
const search = `online_visual_material:true AND type:edanmdm AND NMNHINV+depth`; // Updated query
let allData = [];
let maxDepthGlobal = null;  // Variable to track the global maximum depth

// Function to download JSON data as a file
function downloadJSON(data, filename = 'data.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL object
}

// Function to fetch data from the API with pagination
function fetchAllData(searchTerm, numRows = 500) {
    let start = 0;
    let totalRows = 0;

    function fetchPage() {
        const url = `${searchBaseURL}?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&rows=${numRows}&start=${start}`;
        console.log("Fetching data from:", url);

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (!data.response || !Array.isArray(data.response.rows)) {
                    console.error("Invalid data structure");
                    return;
                }

                // Extract and accumulate data
                let extractedData = extractData(data);
                allData = allData.concat(extractedData);

                totalRows = data.response.rowCount;
                let numResults = data.response.rows.length;
                start += numResults;

                console.log("All Extracted Data:", allData); // Log accumulated data

                if (start < totalRows) {
                    fetchPage(); // Fetch next page
                } else {
                    console.log("All data fetched:", allData);
                    downloadJSON(allData); // Trigger download of the data
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error); // Handle and log any errors
            });
    }

    // Start fetching pages
    fetchPage();
}

// Function to extract the required data from the API response
function extractData(data) {
    if (!data.response || !Array.isArray(data.response.rows)) {
        console.error("Invalid data structure");
        return [];
    }

    return data.response.rows.map((item) => {
        let currentDepth = "Not available";
        let maxDepth = "Not available";  
        let currentCountry = "Not available";
        let imageGUID = "Not available";
        let depthGroup = "Not available"; 

        console.log("Processing object:", item.id);

        // Extract Depth information
        if (item.content && item.content.freetext && item.content.freetext.physicalDescription) {
            const depthItem = item.content.freetext.physicalDescription.find(d => d.label === "Depth (m)");
            if (depthItem) {
                let depthRange = depthItem.content.split('-').map(d => parseFloat(d.trim()));
                currentDepth = depthItem.content;
                if (depthRange.length === 2) {
                    maxDepth = Math.max(depthRange[0], depthRange[1]);
                } else {
                    maxDepth = depthRange[0];
                }
                
                // Update global maxDepth if necessary
                if (!isNaN(maxDepth)) {
                    if (maxDepthGlobal === null || maxDepth > maxDepthGlobal) {
                        maxDepthGlobal = maxDepth;
                    }
                }

                // Assign depth group based on maxDepth
                if (maxDepth <= 10) {
                    depthGroup = "0-10 meters";
                } else if (maxDepth <= 20) {
                    depthGroup = "10-20 meters";
                } else if (maxDepth <= 30) {
                    depthGroup = "20-30 meters";
                } else if (maxDepth <= 40) {
                    depthGroup = "30-40 meters";
                } else if (maxDepth <= 50) {
                    depthGroup = "40-50 meters";
                } else if (maxDepth <= 75) {
                    depthGroup = "50-75 meters";
                } else if (maxDepth <= 100) {
                    depthGroup = "75-100 meters";
                } else if (maxDepth <= 150) {
                    depthGroup = "100-150 meters";
                } else if (maxDepth <= 200) {
                    depthGroup = "150-200 meters";
                } else if (maxDepth <= 300) {
                    depthGroup = "200-300 meters";
                } else if (maxDepth <= 500) {
                    depthGroup = "300-500 meters";
                } else if (maxDepth <= 1000) {
                    depthGroup = "500-1000 meters";
                } else if (maxDepth <= 2000) {
                    depthGroup = "1000-2000 meters";
                } else if (maxDepth <= 3000) {
                    depthGroup = "2000-3000 meters";
                } else if (maxDepth <= 4000) {
                    depthGroup = "3000-4000 meters";
                } else {
                    depthGroup = "Depth exceeds 4000 meters"; // Optional: for depth greater than 4000
                }
            } else {
                console.log("Depth not found in physical description");
            }
        }

        // Extract the Country information
        if (item.content && item.content.indexedStructured && item.content.indexedStructured.geoLocation) {
            const geoLocation = item.content.indexedStructured.geoLocation[0];
            if (geoLocation && geoLocation.L2 && geoLocation.L2.type === "Country") {
                currentCountry = geoLocation.L2.content;
                console.log("Country found:", currentCountry);
            } else {
                console.log("Country not found in geoLocation");
            }
        }

        // Extract the Image GUID
        if (item.content && item.content.descriptiveNonRepeating && item.content.descriptiveNonRepeating.online_media) {
            const media = item.content.descriptiveNonRepeating.online_media.media;
            if (media && media.length > 0 && media[0].guid) {
                imageGUID = media[0].guid;
                console.log("Image GUID found:", imageGUID);
            } else {
                console.log("No image GUID found");
            }
        }

        // Add the object to the array with extracted data
        return {
            id: item.id,
            title: item.title || "No title",
            depth: currentDepth,
            maxDepth: maxDepth,
            depthGroup: depthGroup,
            country: currentCountry,
            imageGUID: imageGUID,
            link: item.content.descriptiveNonRepeating?.record_link || 'No link available'
        };
    });
}

// Call the fetch function with the desired search term
fetchAllData(search);
