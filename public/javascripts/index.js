document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-post-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const postId = button.dataset.postId;
            
            // Confirm with the user before deleting the post
            const confirmDelete = confirm("Are you sure you want to delete this post?");
            
            if (confirmDelete) {
                fetch(`/posts/${postId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        // Update UI to remove the deleted post
                        button.closest('.post').remove();
                    } else {
                        // Handle error
                        console.error('Error:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    });
});
