import { writeProjectRow } from './project-writer.js';


// Retrieve the contents of the JSON file
fetch('data/projects.json')
    .then(response => response.json())
    .then(data => {

            // Get a reference to the element with the id "project-container"
            var container = document.getElementById('project-container');

            // Loop through the keys in the JSON object
            data['educational'].forEach((project, index) => {

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