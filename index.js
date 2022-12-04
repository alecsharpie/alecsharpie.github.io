var request = new XMLHttpRequest();

request.open('GET', 'localhost:8000/projects.json', true);
request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        console.log(data)
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                var container = document.getElementById('container');
                container.innerHTML += '<p>' + key + ': ' + value + '</p>';
            }

        }

    } else {
        // We reached our target server, but it returned an error
    }

};

request.onerror = function() {
    // There was a connection error of some sort
};



console.log('hello world');