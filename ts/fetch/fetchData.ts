import * as $ from 'jquery';

export function fetchData(): void {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then((json: Array<{ userId: number, id: number, title: string, body: string }>) => {
            console.log('Fetched data:', json); // Логування отриманих даних

            const postsContainer: JQuery<HTMLElement> = $('#posts-container');

            json.forEach(post => {
                const postHtml: string = `
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
