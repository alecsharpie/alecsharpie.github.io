// Set year
document.getElementById('year').textContent = new Date().getFullYear();

// Load projects
fetch('data/projects.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects');
        
        data.projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'project';
            
            let html = '';
            
            // Add title and date
            const date = new Date(project.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
            html += `<h2>${project.title}</h2>`;
            html += `<p><small>${date}</small></p>`;
            
            // Tags removed for now
            // if (project.tags && project.tags.length > 0) {
            //     html += '<p class="tags"><small>';
            //     project.tags.forEach(tag => {
            //         html += `#${tag} `;
            //     });
            //     html += '</small></p>';
            // }
            
            // Add description
            html += `<p>${project.description}</p>`;
            
            // Add links
            html += '<p>';
            for (const [text, url] of Object.entries(project.links)) {
                const link = url.startsWith('http') ? url : `https://${url}`;
                html += `<a href="${link}" target="_blank">${text}</a> `;
            }
            html += '</p>';
            
            div.innerHTML = html;
            container.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error loading projects:', error);
        document.getElementById('projects').innerHTML = '<p>Failed to load projects.</p>';
    }); 