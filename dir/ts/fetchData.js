"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchData = void 0;
const $ = require("jquery");
function fetchData() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then((json) => {
        console.log('Fetched data:', json); // Логування отриманих даних
        const postsContainer = $('#posts-container');
        json.forEach(post => {
            const postHtml = `
                    <div class="post">
                        <h3>${post.title}</h3>
                        <p><strong>User ID:</strong> ${post.userId}</p>
                        <p><strong>ID:</strong> ${post.id}</p>
                        <p><strong>Body:</strong> ${post.body}</p>
                    </div>
                `;
            postsContainer.append(postHtml);
        });
    })
        .catch(error => {
        console.error('Error fetching data:', error);
    });
}
exports.fetchData = fetchData;
