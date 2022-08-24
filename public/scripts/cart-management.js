const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElement = document.querySelector('.nav-items .badge');

async function addToCart() {
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;
    // sending post request to that route with data attached to it
    let response;
    try {
        response = await fetch("/cart/items", {
          method: "POST",
          // only post requests have body thats why we add here
          body: JSON.stringify({
            // Converts a JavaScript value to a JavaScript JSON string
            productId: productId,
            _csrf: csrfToken
          }),
          headers: {
        // this tells the backend that the data is json and needs to be parsed with appropriate middleware
            "Content-type": "application/json",
          },
        });
    } catch (error) {
        alert("Something went wrong!");
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    // extracting response data
    const responseData = await response.json(); // decode the response data from json to regular js object

    const newTotalQuantity = responseData.newTotalItems;

    // updating the badge for the navigation
    cartBadgeElement.textContent = newTotalQuantity;
};

addToCartButtonElement.addEventListener('click', addToCart);  