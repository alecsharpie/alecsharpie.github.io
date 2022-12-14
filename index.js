var request = new XMLHttpRequest();

request.open('GET', 'localhost:8000/projects.json', true);
console.log(request);
request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        console.log(data);
        for (var key in data) {
            // if (data.hasOwnProperty(key)) {
            //     var value = data[key];
            //     var container = document.getElementById('container');
            //     container.innerHTML += '<p>' + key + ': ' + value + '</p>';
            // }

            // Create a new div element
            var div = document.createElement('div');

            // Set the inner HTML of the div to some content
            div.innerHTML = '<p>This is my new div element with content!</p>';

            // Get a reference to the element with the id "project-container"
            var container = document.getElementById('project-container');

            // Append the new div to the container element
            container.appendChild(div);

        }

    } else {
        // We reached our target server, but it returned an error
    }

};

request.onerror = function() {
    // There was a connection error of some sort
};



console.log('hello world');