import { writeProjectRow } from './project-writer.js';


// Retrieve the contents of the JSON file
fetch('projects.json')
    .then(response => response.json()) // Parse the JSON data
    .then(data => {
            // Use the data in your JavaScript code
            console.log(data['projects']);

            // Get an array of the keys in the JSON object
            // const keys = Object.keys(data);

            // Loop through the keys in the JSON object
            data['projects'].forEach((project, index) => {


                if (index % 2 == 0) {
                    var side = "left"
                } else {
                    var side = "right"
                }

                var row = writeProjectRow(project, side, data['icons']);

                // Get a reference to the element with the id "project-container"
                var container = document.getElementById('project-container');

                container.appendChild(row);

                // Split horizontal line
                var flex_item = document.createElement('div');
                flex_item.className = "flex-item";

                flex_item.innerHTML = `<hr class="projects-split"/>`;


                container.appendChild(flex_item);

            });
        }

    );