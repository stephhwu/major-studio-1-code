// Smithsonian API example code
const apiKey = "prrYie1Ch2wT5MWofSqPcycSSZ8MAMuu90QneT4V";  

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// constructing the search query based on your API query
const search =  `online_visual_material:true AND type:edanmdm AND NMNHINV+depth`;

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

// Function to fetch all data from the search and push them into the array
function fetchAllData(url) {
  window
  .fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data);

    // Iterate through the rows and add the data you need to the array
    data.response.rows.forEach(function(n) {
      addObject(n);
    });
    
    jsonString += JSON.stringify(myArray);
    console.log(myArray);
  })
  .catch(error => {
    console.log(error);
  })
}

// // Function to add specific object data to the array
// function addObject(objectData) {  
//   let currentDepth = "";
//   let currentCountry = "";
//   let imageGUID = "";

//   // Extract the Depth information if available
//   if(objectData.content.physicalDescription && objectData.content.physicalDescription.label) {
//     let depthLabel = objectData.content.physicalDescription.label.find(item => item.includes("Depth (m)"));
//     if (depthLabel) {
//       currentDepth = depthLabel.split(":")[1].trim();
//     }
//   }

//   // Extract the Country information if available
//   if(objectData.content.indexedStructured && objectData.content.indexedStructured.place) {
//     currentCountry = objectData.content.indexedStructured.place[0];
//   }

//   // Extract the Image GUID if available
//   if(objectData.content.online_media && objectData.content.online_media.media) {
//     if(objectData.content.online_media.media[0].guid) {
//       imageGUID = objectData.content.online_media.media[0].guid;
//     }
//   }

//   // Add the object to the array
//   myArray.push({
//     id: objectData.id,
//     title: objectData.title,
//     depth: currentDepth,
//     country: currentCountry,
//     imageGUID: imageGUID,
//     link: objectData.content.descriptiveNonRepeating.record_link
//   });
// }

// Function to log the full metadata structure
// function logFullMetadata(objectData, index) {
//   console.log(`\n--- Full Metadata for Object ${index} ---`);
//   console.log("ID:", objectData.id);
//   console.log("Title:", objectData.title);
//   console.log("Full object structure:");
//   console.log(JSON.stringify(objectData, null, 2));
//   console.log("--- End of Metadata ---\n");
// }

// // Modified fetchAllData function to include metadata logging
// function fetchAllData(url) {
//   window
//   .fetch(url)
//   .then(res => res.json())
//   .then(data => {
//     console.log("Total rows in this fetch:", data.response.rows.length);

//     // Log full metadata for the first 5 objects (or fewer if there are less than 5)
//     const numToLog = Math.min(5, data.response.rows.length);
//     for (let i = 0; i < numToLog; i++) {
//       logFullMetadata(data.response.rows[i], i + 1);
//     }

//     // Iterate through the rows and add the data you need to the array
//     data.response.rows.forEach(function(n) {
//       addObject(n);
//     });
    
//     jsonString += JSON.stringify(myArray);
//     console.log("Current array length:", myArray.length);
//   })
//   .catch(error => {
//     console.log("Error in fetchAllData:", error);
//   })
// }

// // Keep your existing addObject function here

// // Existing fetchSearchData function (unchanged)
// function fetchSearchData(searchTerm) {
//   let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm;
//   console.log("Initial search URL:", url);
//   window
//   .fetch(url)
//   .then(res => res.json())
//   .then(data => {
//     console.log("Initial search response:", data);
    
//     let pageSize = 1000;
//     let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
//     console.log("Number of queries needed:", numberOfQueries);

//     for(let i = 0; i < numberOfQueries; i++) {
//       let searchAllURL;
//       if (i == (numberOfQueries - 1)) {
//         searchAllURL = url + `&start=${i * pageSize}&rows=${data.response.rowCount - (i * pageSize)}`;
//       } else {
//         searchAllURL = url + `&start=${i * pageSize}&rows=${pageSize}`;
//       }
//       console.log(`Fetching data for query ${i + 1}:`, searchAllURL);
//       fetchAllData(searchAllURL);
//     }
//   })
//   .catch(error => {
//     console.log("Error in fetchSearchData:", error);
//   })
// }
function addObject(objectData) {  
  let currentDepth = "Not available";
  let currentCountry = "Not available";
  let imageGUID = "Not available";

  console.log("Processing object:", objectData.id);

  // Extract the Depth information
  if (objectData.content && objectData.content.freetext && objectData.content.freetext.physicalDescription) {
    const depthItem = objectData.content.freetext.physicalDescription.find(item => item.label === "Depth (m)");
    if (depthItem) {
      currentDepth = depthItem.content;
      console.log("Depth found:", currentDepth);
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

  // Add the object to the array
  const newItem = {
    id: objectData.id,
    title: objectData.title || "No title",
    depth: currentDepth,
    country: currentCountry,
    imageGUID: imageGUID,
    link: objectData.content.descriptiveNonRepeating?.record_link || 'No link available'
  };

  console.log("Adding item to array:", newItem);
  myArray.push(newItem);
}

fetchSearchData(search);
// // Smithsonian API example code
// // check API documentation for search here: http://edan.si.edu/openaccess/apidocs/#api-search-search
// // Using this data set https://collections.si.edu/search/results.htm?q=Flowers&view=grid&fq=data_source%3A%22Cooper+Hewitt%2C+Smithsonian+Design+Museum%22&fq=online_media_type%3A%22Images%22&media.CC0=true&fq=object_type:%22Embroidery+%28visual+works%29%22

// // put your API key here;
// const apiKey = "prrYie1Ch2wT5MWofSqPcycSSZ8MAMuu90QneT4V";  

// // search base URL
// const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// // constructing the initial search query
// // const search =  'mask AND unit_code:"FSG"';
// const search =  `Flowers AND unit_code:"CHNDM" AND object_type:"Embroidery (visual works)" AND online_media_type:"Images"`;


// // array that we will write into
// let myArray = [];

// // string that will hold the stringified JSON data
// let jsonString = '';

// // search: fetches an array of terms based on term category
// function fetchSearchData(searchTerm) {
//     let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm;
//     console.log(url);
//     window
//     .fetch(url)
//     .then(res => res.json())
//     .then(data => {
//       console.log(data)
      
//       // constructing search queries to get all the rows of data
//       // you can change the page size
//       let pageSize = 1000;
//       let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
//       console.log(numberOfQueries)
//       for(let i = 0; i < numberOfQueries; i++) {
//         // making sure that our last query calls for the exact number of rows
//         if (i == (numberOfQueries - 1)) {
//           searchAllURL = url + `&start=${i * pageSize}&rows=${data.response.rowCount - (i * pageSize)}`;
//         } else {
//           searchAllURL = url + `&start=${i * pageSize}&rows=${pageSize}`;
//         }
//         console.log(searchAllURL)
//         fetchAllData(searchAllURL);
      
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     })
// }

// // fetching all the data listed under our search and pushing them all into our custom array
// function fetchAllData(url) {
//   window
//   .fetch(url)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data)

//     data.response.rows.forEach(function(n) {
//       addObject(n);
//     });
//     jsonString += JSON.stringify(myArray);
//     console.log(myArray);
//   })
//   .catch(error => {
//     console.log(error)
//   })

// }

// // create your own array with just the data you need
// function addObject(objectData) {  
  
//   // we've encountered that some places have data others don't
//   let currentPlace = "";
//   if(objectData.content.indexedStructured.place) {
//     currentPlace = objectData.content.indexedStructured.place[0];
//   }
// //myArray is where you would plug in key value 
// //key value pairs (e.g. "id" is the key and "objectData.id" is the pair)
//   myArray.push({
//     id: objectData.id,
//     title: objectData.title,
//     link: objectData.content.descriptiveNonRepeating.record_link,
//     place: currentPlace
//   })
// }


// fetchSearchData(search);


// //---------------------------UNIT CODES------------------------------
// // ACAH: Archives Center, National Museum of American History
// // ACM: Anacostia Community Museum
// // CFCHFOLKLIFE: Smithsonian Center for Folklife and Cultural Heritage
// // CHNDM: Cooper-Hewitt, National Design Museum
// // FBR: Smithsonian Field Book Project
// // FSA: Freer Gallery of Art and Arthur M. Sackler Gallery Archives
// // FSG: Freer Gallery of Art and Arthur M. Sackler Gallery
// // HAC: Smithsonian Gardens
// // HMSG: Hirshhorn Museum and Sculpture Garden
// // HSFA: Human Studies Film Archives
// // NAA: National Anthropological Archives
// // NASM: National Air and Space Museum
// // NMAAHC: National Museum of African American History and Culture
// // NMAfA: Smithsonian National Museum of African Art
// // NMAH: Smithsonian National Museum of American History
// // NMAI: National Museum of the American Indian
// // NMNHANTHRO: NMNH - Anthropology Dept.
// // NMNHBIRDS: NMNH - Vertebrate Zoology - Birds Division
// // NMNHBOTANY: NMNH - Botany Dept.
// // NMNHEDUCATION: NMNH - Education & Outreach
// // NMNHENTO: NMNH - Entomology Dept.
// // NMNHFISHES: NMNH - Vertebrate Zoology - Fishes Division
// // NMNHHERPS: NMNH - Vertebrate Zoology - Herpetology Division
// // NMNHINV: NMNH - Invertebrate Zoology Dept.
// // NMNHMAMMALS: NMNH - Vertebrate Zoology - Mammals Division
// // NMNHMINSCI: NMNH - Mineral Sciences Dept.
// // NMNHPALEO: NMNH - Paleobiology Dept.
// // NPG: National Portrait Gallery
// // NPM: National Postal Museum
// // SAAM: Smithsonian American Art Museum
// // SI: Smithsonian Institution, Digitization Program Office
// // SIA: Smithsonian Institution Archives
// // SIL: Smithsonian Libraries