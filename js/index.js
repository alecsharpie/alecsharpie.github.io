import { writeProjectRow } from './project-writer.js';
import { loadProjects } from './project-loader.js';


// Retrieve the contents of the JSON file
fetch('data/projects.json')
    .then(response => response.json()) // Parse the JSON data
    .then(data => {

            // Get a reference to the element with the id "project-container"
            var container = document.getElementById('project-container');


            // Loop through the keys in the JSON object
            data['projects'].forEach((project, index) => {


                if (index % 2 == 0) {
                    var side = "left"
                } else {
                    var side = "right"
                }

                var row = writeProjectRow(project, side, data['icons']);

                container.appendChild(row);

                // Split horizontal line
                var flex_item = document.createElement('div');
                flex_item.className = "flex-item";

                flex_item.innerHTML = `<hr class="projects-split"/>`;


                container.appendChild(flex_item);

            });
        }

    );

// Load the projects when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects('projects');
});