const apiKey = "prrYie1Ch2wT5MWofSqPcycSSZ8MAMuu90QneT4V";  
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";
const search = `online_visual_material:true AND type:edanmdm AND NMNHINV polynesia depth`;
let myArray = [];  // Initialize the array to hold all data
let maxDepthGlobal = null;  // Variable to track the global maximum depth

// Function to fetch the initial search data
function fetchSearchData(searchTerm) {
    let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + encodeURIComponent(searchTerm);
    console.log(url);
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        
        let pageSize = 1000;
        let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
        console.log(numberOfQueries);

        for (let i = 0; i < numberOfQueries; i++) {
            let searchAllURL;
            if (i === (numberOfQueries - 1)) {
                searchAllURL = url + `&start=${i * pageSize}&rows=${data.response.rowCount - (i * pageSize)}`;
            } else {
                searchAllURL = url + `&start=${i * pageSize}&rows=${pageSize}`;
            }
            console.log(searchAllURL);
            fetchAllData(searchAllURL);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

// Function to fetch all data from the search and push them into the array
function fetchAllData(url) {
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data);

        data.response.rows.forEach(n => {
            addObject(n);  // Add each object to myArray
        });

        // After processing all data, log or save myArray
        console.log("Combined Array Length:", myArray.length);
        console.log("Combined Array Data:", myArray);
        
        // Save the combined data as JSON if needed
        const jsonString = JSON.stringify(myArray, null, 2);
        // You can save jsonString to a file or do whatever you need with it

        // Display the maximum depth across all objects after processing
        if (maxDepthGlobal !== null) {
            console.log("Global Maximum Depth (m):", maxDepthGlobal);
        } else {
            console.log("No depth information available.");
        }
    })
    .catch(error => {
        console.log(error);
    });
}

// Function to add specific object data to the array
function addObject(objectData) {  
    let currentDepth = "Not available";
    let maxDepth = "Not available";  // Local max depth for each object
    let currentCountry = "Not available";
    let imageGUID = "Not available";
    let depthGroup = "Not available"; // New variable to store the depth group

    console.log("Processing object:", objectData.id);

    // Extract the Depth information
    if (objectData.content && objectData.content.freetext && objectData.content.freetext.physicalDescription) {
        const depthItem = objectData.content.freetext.physicalDescription.find(item => item.label === "Depth (m)");
        if (depthItem) {
            let depthRange = depthItem.content.split('-').map(d => parseFloat(d.trim()));  // Split and parse the depth range
            currentDepth = depthItem.content;
            console.log("Depth found:", currentDepth);

            // Calculate the maxDepth for this object
            if (depthRange.length === 2) {
                maxDepth = Math.max(depthRange[0], depthRange[1]);
            } else {
                maxDepth = depthRange[0];
            }
            console.log("Max Depth for this object:", maxDepth);

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
                depthGroup = "150-200 meters (End of the epipelagic zone)";
            } else if (maxDepth <= 300) {
                depthGroup = "200-300 meters (Start of the mesopelagic zone)";
            } else if (maxDepth <= 500) {
                depthGroup = "300-500 meters";
            } else if (maxDepth <= 1000) {
                depthGroup = "500-1000 meters (End of the mesopelagic zone)";
            } else if (maxDepth <= 2000) {
                depthGroup = "1000-2000 meters (Start of the bathypelagic zone)";
            } else if (maxDepth <= 3000) {
                depthGroup = "2000-3000 meters";
            } else if (maxDepth <= 4000) {
                depthGroup = "3000-4000 meters";
            } else {
                depthGroup = "Depth beyond 4000 meters";
            }

        } else {
            console.log("Depth not found in physical description");
        }
    } else {
        console.log("No physical description found");
    }

    // Extract the Country information
    if (objectData.content && objectData.content.indexedStructured && objectData.content.indexedStructured.geoLocation) {
        const geoLocation = objectData.content.indexedStructured.geoLocation[0];
        if (geoLocation && geoLocation.L2 && geoLocation.L2.type === "Country") {
            currentCountry = geoLocation.L2.content;
            console.log("Country found:", currentCountry);
        } else {
            console.log("Country not found in geoLocation");
        }
    } else {
        console.log("No geoLocation found");
    }

    // Extract the Image GUID
    if (objectData.content && objectData.content.descriptiveNonRepeating && objectData.content.descriptiveNonRepeating.online_media) {
        const media = objectData.content.descriptiveNonRepeating.online_media.media;
        if (media && media.length > 0 && media[0].guid) {
            imageGUID = media[0].guid;
            console.log("Image GUID found:", imageGUID);
        } else {
            console.log("No image GUID found");
        }
    } else {
        console.log("No online media found");
    }

    // Add the object to the array with depth range and max depth
    const newItem = {
        id: objectData.id,
        title: objectData.title || "No title",
        depth: currentDepth,        // Range of depth as is
        maxDepth: maxDepth,         // Max depth extracted from range
        depthGroup: depthGroup,     // The new depth group based on maxDepth
        country: currentCountry,
        imageGUID: imageGUID,
        link: objectData.content.descriptiveNonRepeating?.record_link || 'No link available'
    };

    console.log("Adding item to array:", newItem);
    myArray.push(newItem);
}

fetchSearchData(search);
