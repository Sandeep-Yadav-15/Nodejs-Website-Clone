// HTTP MODULE:
// Import the 'http' module, which allows us to create an HTTP server
import { createServer } from 'http';
// Import file system module
import { readFile } from 'fs';// For reading files from the file system
// Import the 'path' module, which provides utilities for working with file paths
import { join, extname} from 'path';//For working with file paths


// Import the 'url' module to work with file URLs
import { fileURLToPath } from 'url';// To get the file path in ES modules
// Import the 'path' module to work with file paths
import { dirname } from 'path';// To get the directory name of a file path

/*To capture and handle the form data in server.js, i need to:
Parse the incoming POST request body.
Process the form data and send an appropriate response back to the user*/
// To parse incoming POST data
//Importing the querystring module:
import { parse } from 'querystring'; 
/*The querystring module is used to parse URL-encoded form data. The parse function helps convert raw form data (which is sent as a string) into a JavaScript object that can be easily accessed.*/ 


// Manually define __dirname since it's not directly available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Sample data to simulate search results
const searchData = {
  node: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
  express: 'Express is a minimal and flexible Node.js web application framework.',
  javascript: 'JavaScript is a programming language that conforms to the ECMAScript specification.',
  about: 'About Node.js: A page that contains details about Node.js.'
};

// Create an HTTP server
const server = createServer((req, res) => {


  // Log the requested URL
   // Skip logging requests for static files (e.g., .css, .js, .png, etc.)
  //  if (!req.url.includes('.')) {
  // console.log(req.url);

  // Ignore requests for the favicon
  if (req.url === '/favicon.ico') {
    res.writeHead(204); // 204 No Content: No need to send any content
    res.end();
    return;
  }
  console.log(req.url); // Log the requested URL

//Handle the search request
if (req.url.startsWith('/search'))/*This line checks if the incoming request URL begins with /search. If it does, the server treats this as a search request and proceeds with the search-related logic.

For example, if the user enters something like http://localhost:8000/search?query=node, the URL starts with /search, so this condition becomes true. */ {
  const urlParams = new URL(req.url, `http://${req.headers.host}`);/*new URL(req.url, ...): This line creates a URL object using the request URL. The req.url (like /search?query=node) and the server's host (http://${req.headers.host}) are combined to form the full URL (like http://localhost:8000/search?query=node).
  Purpose: The URL object allows us to easily extract the query string parameters (like query=node) from the URL.*/
  const searchQuery = urlParams.searchParams.get('query').toLowerCase();/*urlParams.searchParams.get('query'): This line retrieves the value of the query parameter from the search URL. For example, if the user entered /search?query=node, the value of query would be "node".
  .toLowerCase(): Converts the search query to lowercase to make the search case-insensitive. This ensures that a search for "Node" and "node" would yield the same result.*/ 

  // Search for the query in the sample search data
  const result = searchData[searchQuery] || 'No results found for your search query.';/*searchData[searchQuery]: This line attempts to retrieve a matching search result from the searchData object (which contains predefined search terms and descriptions).
  For example, if searchQuery is "node", it checks searchData['node'].
  || 'No results found for your search query.': If there’s no matching entry in searchData for the query, this fallback message is used to inform the user that no results were found.*/ 

  // Return the search results
  res.writeHead(200, { 'Content-Type': 'text/html' });/*This line sends a response header to the client with an HTTP status code of 200 (OK) and a Content-Type of text/html. This tells the client that the response will contain HTML content.*/ 
  res.end(`
    <html>
        <head>
         <link rel="stylesheet" href="/bootstrap.min.css">
          <title>Search Results</title>
        </head>
        <body style="text-align: center;">
           <h1 style="text-align: center;">Search Results for "${searchQuery}"</h1>
           <p style="text-align: center; font-size: 1.5rem;">${result}</p>
           <a href="/" style="text-align: center; font-size: 1.5rem; font-weight: bold;">Go back to the homepage</a>
        </body>
      </html>
  `);
  return;
}
/* <body>
          <h1>Search Results for "${searchQuery}"</h1>
          <p>${result}</p>
         <a href="/">Go back to the homepage</a>
        </body>
3. How It Works
1.User Submits a Search Query: When the user types a query in the search bar (for example, "node") and submits the form, the browser sends a GET request to /search?query=node.

2.Server Processes the Query: The server extracts the search query (node in this case) and checks if it exists in the searchData object.

3.Server Sends the Result: The server sends an HTML response back with the search result. If no matching result is found, it responds with a message saying "No results found for your search query."

4. Simulating Search Data
In this example, I used a simple searchData object to simulate search results.

5. Test the Feature
Run the server with node server.js.
Open http://localhost:8000 and try searching for terms like node, express, or javascript.


•Handling Static Files: The server.js file now handles serving static files (like style.css and bootstrap.min.css) properly. When the request is for a file (like /style.css or /bootstrap.min.css), it reads the file from the public folder and sends it with the correct Content-Type.
•Ensuring Static Files Load on Search Pages: In the response for /search results, you now include links to style.css and bootstrap.min.css. This ensures that your search results page also loads the necessary CSS files.
Step 3: Test the Search Feature
1.Start the Server: Run node server.js.
2.Access the Website: Go to http://localhost:8000 and make a search query using the search bar. The search results should display the correct styles (from style.css and bootstrap.min.css).
*/


//This code handles a POST request to submit form data, such as a contact form, and returns a response that thanks the user for their submission.
// Handle form submission at /submit-contact
if (req.url === '/submit-contact' && req.method === 'POST')/*This condition checks if the URL requested is /submit-contact and if the request method is POST (indicating that data is being submitted via a form). If both conditions are true, it will proceed with the code inside the block. */ {

  //Accumulating form data
  let body = '';// Initialize an empty string to collect incoming data
  //The body variable will store the incoming form data, which comes in chunks.

  // Collect data chunks
  req.on('data', chunk => {
      body += chunk.toString(); // Convert buffer to string and add it to 'body'
  });/*The req.on('data') event listens for data being sent in chunks. As each chunk of data arrives, it is added to the body variable. The data is in binary form (buffer), so it is converted to a string.*/ 


  //Handling the end of data transmission:
  // After the data has been fully received
  req.on('end', () => {
      // Parse the received form data
      const formData = parse(body);// Parse the accumulated form data
      /*The req.on('end') event fires when all the form data has been received. At this point, the full data is stored in the body variable, and we parse it using the parse function from the querystring module, which converts it into an object (e.g., { name: 'John', message: 'Hello' }). */

      // Logging and preparing the response:
      // Log the form data to the console
      console.log('Form Data:', formData);// Log the parsed form data
      //The form data is logged in the console to see what the user submitted.

      // Send a response back to the user
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
          <html>
              <head>
              <link rel="stylesheet" href="/bootstrap.min.css">
              <title>Contact Form Submission</title>
              </head>
              <body style="text-align: center;">
                  <h1 style="text-align: center;">Thank You, ${formData.name}!</h1>
                  <p style="text-align: center; font-size: 1.5rem;">We have received your message:</p>
                  <p style="text-align: center; font-size: 1.5rem;">${formData.message}</p>
                  <a href="/" style="text-align: center; font-size: 1.5rem; font-weight: bold;">Go back to the homepage</a>
              </body>
          </html>
      `);/*A successful response is sent back to the user with status code 200 and content type text/html.
      The response is a complete HTML page that dynamically includes the user's name and message from the form data (e.g., "Thank You, John!").
      A link to go back to the homepage is provided, styled using a CSS file (bootstrap.min.css).*/
  });

  return;
}
/*Explanation:
Handling POST requests:

The server checks if the URL is /submit-contact and if the request method is POST.
The data from the form is captured in chunks and stored in the body variable.
After receiving all the data, it is parsed using querystring.parse() to get the form data in an object (formData).
The parsed data (formData) contains name, email, and message fields, which can be logged or processed.
Responding to the user:

After processing the form data, the server sends an HTML response thanking the user for their submission and displaying the message they submitted.*/




  /* agr mai host mai /abour typr karo toh about page hone chiye toh ese handle karne ke liye shabse phlae mai check karo gaa konsa request url aarahi toh console karke check karonga
  console.log(req.url);
  ///toh simply mai yahna per check lagasakta hoon agar home page hai
  if (req.url === '/') {
    ///Read the contents of 'index.html' from the 'public' directory
  readFile(join(__dirname, 'public', 'index.html'), (err, content) => {
    if (err) {
      /// If there is an error reading the file, send a 500 status and log the error
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      console.error('Error reading file:', err);
      return;
    }
    
    /// If no error, send the content of the file as the response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  })
  /// If the request is for the '/about' page, send the content of 'about.html
  } else if (req.url === '/about') {
    readFile(join(__dirname, 'public', 'about.html'), (err, content) => {
      if (err) {
        /// If there is an error reading the file, send a 500 status and log the error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        console.error('Error reading file:', err);
        return;
        }
       ///If no error, send the content of the file as the response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  })
}*/

/*
Read the contents of 'index.html' from the 'public' directory
  readFile(join(__dirname, 'public', 'index.html'), (err, content) => {
    if (err) {
      If there is an error reading the file, send a 500 status and log the error
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      console.error('Error reading file:', err);
      return;
    }
    xq1
    If no error, send the content of the file as the response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  })

*/

   

  

  //Send a response to the client
    // res.end('<h1>Welcome sandeep</h1>');
  /*This is a callback function that will be executed when a request is received
  req represents the incoming request, and res represents the response
  Currently, this function is empty, so we need to add logic to handle requests*/ 

  // esko thora sa universal baannate esko refactor karte hai 
  //shab se phale ek variable create karronga.
  //create a dynamic file path
  // const filePath = join(__dirname, 'public', req.url === '/' ? 'index.html': req.url + '.html'); //about
  let filePath = join(__dirname, 'public', req.url === '/' ? 'index.html': req.url); //about
   // Extract the file extension from the requested file path
   let ext = extname(filePath);
  let contentType = 'text/html'; // Default to HTML
 
  // Default to serving HTML files if no extension is provided
  if(!ext){
    filePath += '.html';
    ext = '.html';//Set the extension as .html
  }

  /*jo hamara problem hai css ka jo MIME TYPE KA hai.*/ 
  // Set the appropriate Content-Type based on the file extension
  // let contentType = 'text/html'; // Default to HTML
  switch(ext){
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'application/javascript';
      // contentType = 'text/javascript';
      break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpeg';
        break;
      case '.ico':
        contentType = 'image/x-icon';
        break;
    default:
      contentType = 'text/html'

    
  }

  //read the file at the dynamic path
  // Read the file from the computed file path
  readFile(filePath, (err, content) => {
    if (err) {
      //If there is an error reading the file, then read a error.html file.
      readFile(join(__dirname, 'public', '404.html'), (err2, errorContent) => {
        if (err2) {
          //If there is an error reading the error.html file, send a 500 status and log
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          // console.error('Error reading error.html:', err2);
          console.error('Error reading 404.html:', err2);
          // return;
          }else{
          //If no error, send the content of the error.html file as the response
           // If error.html is successfully read, send it with a 404 status
          res.writeHead(404, { 'Content-Type': 'text/html' });
          // res.writeHead(404, { 'Content-Type': 'contentType' });
          res.end(errorContent);
        }
      });
      //return;// Ensure the function exits here to prevent further execution

      // If there is an error reading the file, send a 404 status and log the error
      /*res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.error('Error reading file:', err);
      return;*/
    }else{
    //If no error, send the content of the file as the response
    // If the requested file is successfully read, send it with the correct Content-Type
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);


    //If no error, send the content of the file as the response
    /*res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);*/
    }
  });


});
// Define the port number to use for the server
// If the PORT environment variable is set, use that; otherwise, use 3000
const PORT = process.env.PORT || 8000;

// Start the server and listen for incoming requests on the specified port
server.listen(PORT, () => { 
  // This callback function will be executed when the server is successfully listening
  // PORT 3000 might not be available on the server, so we use the dynamically assigned port
  console.log(`Server is running on port ${PORT}`);//Server is running on port 3000
});

/*"test": "echo \"Error: no test specified\" && exit 1",*/