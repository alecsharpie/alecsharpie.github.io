export function writeProjectRow(project, side, icon_map) {
    // Create a new div element
    var row = document.createElement('div');
    row.className = "project-row-" + side;

    // IMAGE

    var flexbox_img = document.createElement('div');
    flexbox_img.className = "flex-block";

    var project_img = document.createElement('img');
    project_img.className = "project-image";
    project_img.src = 'images/project-icons/' + project['image_path'];
    project_img.alt = project['image_alt'];

    flexbox_img.appendChild(project_img)

    row.appendChild(flexbox_img)

    // TEXT

    var flexbox_text = document.createElement('div');
    flexbox_text.className = "flex-block";


    // Title

    var flex_item = document.createElement('div');
    flex_item.className = "flex-item";

    flex_item.innerHTML = `<h2 class="project-title">${project['title']}</h2>`;

    flexbox_text.append(flex_item)

    // Date

    var flex_item = document.createElement('div');
    flex_item.className = "flex-item";

    var date_block = document.createElement('div');
    date_block.className = "date";

    date_block.innerHTML = `
                  <span class="iconify" data-icon="bi:calendar-week" data-inline="false"></span>
                  <span class="seperator"> | </span>
                  <span>${project['date']}</span>
                  `;

    flex_item.append(date_block)

    flexbox_text.append(flex_item)



    // Links

    var flex_item = document.createElement('div');
    flex_item.className = "flex-item";

    for (var key of Object.keys(project['links'])) {

        var link_click = document.createElement('a');
        link_click.href = `${project['links'][key]}`;

        var link_block = document.createElement('span');
        link_block.className = "info-link-button";

        link_block.innerHTML = `
                      <span class="iconify inline" data-icon=${icon_map[key]} data-inline="false"></span>
                      <p class='inline'>${key}</p>
                      `;

        // <span class="seperator inline"> | </span>

        link_click.append(link_block)

        flex_item.append(link_click)

    }


    flexbox_text.append(flex_item);


    // Description

    var flex_item = document.createElement('div');
    flex_item.className = "flex-item";

    flex_item.innerHTML = `<p class="project-description">${project['description']}`;

    flexbox_text.append(flex_item)

    // Tags

    var flex_item = document.createElement('div');
    flex_item.className = "flex-item";

    // using for...of
    for (let i of project['tags']) {

        var tag = document.createElement('span');

        tag.classList.add("tag");

        tag.classList.add(`${i.toLowerCase().replace(/\s+/g, '')}`);

        tag.innerHTML = `${i}`;

        flex_item.append(tag)

    }

    // var flex_item = document.createElement('div');
    // flex_item.className = "flex-item";

    // flex_item.innerHTML = `
    //   <span class = "tag edu">Code</span>
    //   <span class = "tag dataset">Dataset</span>
    //   `;

    flexbox_text.append(flex_item)


    row.append(flexbox_text)

    return row
}