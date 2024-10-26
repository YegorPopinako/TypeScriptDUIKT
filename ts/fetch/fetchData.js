"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchData = fetchData;
var $ = require("jquery");
function fetchData() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var postsContainer = $('#posts-container');
        data.forEach(function (post) {
            postsContainer.append("\n                    <div class=\"post\">\n                        <h2>".concat(post.title, "</h2>\n                        <p>").concat(post.body, "</p>\n                    </div>\n                "));
        });
    })
        .catch(function (error) { return console.error('Error fetching data:', error); });
}
