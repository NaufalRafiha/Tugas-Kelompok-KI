function hideText() {
    const imageInput = document.getElementById('imageInput');
    const textInput = document.getElementById('textInput');
    const passwordInput = document.getElementById('passwordInput');
    const file = imageInput.files[0];
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const text = textInput.value;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Hide text
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i);
                for (let j = 0; j < 8; j++) {
                    const bit = (charCode >> (7 - j)) & 1;
                    const colorIndex = (i * 8 + j) * 4; // Calculate the index of the color channel
                    data[colorIndex] = (data[colorIndex] & ~1) | bit; // Modify the least significant bit of the red channel
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Convert canvas to image and create download link
            const hiddenImageDataURL = canvas.toDataURL('image/png'); // Use PNG to avoid compression
            const hiddenImageDownloadLink = document.createElement('a');
            hiddenImageDownloadLink.href = hiddenImageDataURL;
            hiddenImageDownloadLink.download = 'hidden_image.png'; // Change the file extension to .png
            hiddenImageDownloadLink.textContent = 'Download Hidden Image';
            document.getElementById('output').innerHTML = '';
            document.getElementById('output').appendChild(hiddenImageDownloadLink);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}
