var request = new XMLHttpRequest();

request.open('GET', 'https://example.com/data.json', true);
request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
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

request.send();