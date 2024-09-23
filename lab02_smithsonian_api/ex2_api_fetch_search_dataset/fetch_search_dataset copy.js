// Smithsonian API example code
const apiKey = "prrYie1Ch2wT5MWofSqPcycSSZ8MAMuu90QneT4V";  

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// constructing the search query based on your API query
const search =  `online_visual_material:true AND type:edanmdm AND NMNHINV+boyle+stage`;

// array that will hold the results
let myArray = [];

// string that will hold the stringified JSON data
let jsonString = '';

// Function to fetch the initial search data
function fetchSearchData(searchTerm) {
    let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm;
    console.log(url);
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      
      // Adjust page size and number of queries based on row count
      let pageSize = 1000;
      let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
      console.log(numberOfQueries);

      for(let i = 0; i < numberOfQueries; i++) {
        let searchAllURL;
        if (i == (numberOfQueries - 1)) {
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
    })
}

// Function to log the full metadata structure
function logFullMetadata(objectData, index) {
  console.log(`\n--- Full Metadata for Object ${index} ---`);
  console.log("ID:", objectData.id);
  console.log("Title:", objectData.title);
  console.log("Full object structure:");
  console.log(JSON.stringify(objectData, null, 2));  // Pretty-print the object metadata
  console.log("--- End of Metadata ---\n");
}

// Modified fetchAllData function to include metadata logging
function fetchAllData(url) {
  window
  .fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Total rows in this fetch:", data.response.rows.length);

    // Log full metadata for the first 5 objects (or fewer if there are less than 5)
    const numToLog = Math.min(5, data.response.rows.length);
    for (let i = 0; i < numToLog; i++) {
      logFullMetadata(data.response.rows[i], i + 1);
    }

    // Iterate through the rows and add the data you need to the array
    data.response.rows.forEach(function(n) {
      addObject(n);
    });
    
    jsonString += JSON.stringify(myArray);
    console.log("Current array length:", myArray.length);
  })
  .catch(error => {
    console.log("Error in fetchAllData:", error);
  })
}

// Placeholder function to add objects to the array (modify as needed)
function addObject(n) {
  myArray.push(n);  // Add object to the array
}

// Call this function to start the process
fetchSearchData(search);
