document.getElementById('decodeButton').addEventListener('click', extractText);

function extractText() {
    const imageInput = document.getElementById('imageInput');
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
            const password = passwordInput.value;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let extractedText = '';
            let charCode = 0;
            let bitCount = 0;
            // Extract text
            for (let i = 0; i < imageData.length; i += 4) { // Skip every 4 to get one color value per pixel
                const bit = imageData[i] & 1; // Use the red channel for extraction
                charCode = (charCode << 1) | bit;
                bitCount++;
                if (bitCount === 8) {
                    if (charCode === 0) break; // stop when null character is encountered
                    extractedText += String.fromCharCode(charCode);
                    charCode = 0;
                    bitCount = 0;
                }
            }
            document.getElementById('output').innerHTML = `<p>Extracted Text: ${extractedText}</p>`;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

