const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;

    console.log(buttonElement);

    const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    // we use dom travers technique to move to the element we want, in that case we move up
    // here we use buildin method that exists in js dom elements to remove the element
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
};

for (const deleteProductButtonElement of deleteProductButtonElements) {
    deleteProductButtonElement.addEventListener("click", deleteProduct);
};