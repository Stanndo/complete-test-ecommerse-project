const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector("#image-upload-control img");

function updateImagePreview() {
    // here if user picked some files in the input we get them with that const files as array
    const files = imagePickerElement.files;

    // here we check if user actually picked files
    if (!files || files.length === 0) {
        imagePreviewElement.style.display = 'none';
        return;
    }

    // here if file is actually picked we got them from the first element of array files
    const pickedFile = files[0];

    // we construct url to that file which lives on the computer of the visitor/user/client
    // javascript provide as with ways of constucting urls to locals files with help of buildin 
    // URL class
    imagePreviewElement.src = URL.createObjectURL(pickedFile); // this will generate url
    imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);