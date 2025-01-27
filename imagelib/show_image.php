<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Manager</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        .upload-container, .search-container {
            text-align: center;
            margin-bottom: 20px;
        }
        .upload-container input, .search-container input {
            margin-right: 10px;
        }
        .gallery {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
        }
        .card {
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: white;
            width: 150px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }
        .card:hover {
            transform: scale(1.05);
        }
        .card img {
            width: 100%;
            height: auto;
            border-bottom: 1px solid #ccc;
            border-radius: 5px 5px 0 0;
            cursor: pointer;
        }
        .card button {
            margin: auto 0 0 0;
  padding: 2px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
        }
        .card button:hover {
            background-color: darkred;
        }
        .message {
            text-align: center;
            margin-bottom: 20px;
            color: red;
            font-weight: bold;
        }
        .info {
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
            color: #555;
        }
        /* Popup styles */
        .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            display: none; /* Hidden by default */
        }
        .popup-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
            max-width: 90%;
            max-height: 90%;
        }
        .popup-content img {
            max-width: 100%;
            max-height: 500px;
            border-radius: 5px;
        }
        .popup-content button {
            margin-top: 10px;
            padding: 10px 20px;
            background-color: gray;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        p {
  overflow: hidden;
}
    </style>
</head>
<body>

<h1>Image Manager</h1>

<div class="message" id="message"></div>

<div class="info" id="imageCount">Total Images: 0</div>

<div style="display: flex;" class="search-container">
    <input class="form-control" type="text" id="searchInput" placeholder="Search by image name">
    <button class="btn btn-primary ms-2" onclick="searchImages()">Search</button>
    <button class="btn btn-primary ms-2" onclick="resetSearch()">Reset</button>
</div>

<div style="display: flex;" class="upload-container">
    <input class="form-control mb-3" type="file" id="uploadInput" />
    <button style="height: 38px;" class="btn btn-primary ms-2" onclick="uploadImage()">Upload</button>
</div>

<div class="gallery" id="gallery"></div>

<!-- Popup for image view -->
<div class="popup" id="imagePopup">
    <div class="popup-content">
        <img id="popupImage" src="" alt="Popup Image">
        <button style="position: absolute;padding: 10px 15px 10px 15px;background-color: black;" onclick="closeImagePopup()">X</button>
    </div>
</div>

<!-- Popup for delete confirmation -->
<div class="popup" id="deletePopup">
    <div class="popup-content">
        <p id="deleteMessage" style="white-space: pre-wrap;">Are you sure you want to delete this image?</p>
        <button class="confirm" id="confirmDelete">Yes</button>
        <button class="cancel" id="cancelDelete">No</button>
    </div>
</div>

<script>
    let imageToDelete = null; // Store the image to be deleted
    let allImages = []; // Store all images for search functionality

    // تحميل الصور وعرضها
    function loadImages() {
        fetch('get_images.php')
            .then(response => response.json())
            .then(images => {
                allImages = images;
                displayImages(images);
                updateImageCount(images.length);
            })
            .catch(error => console.error('Error loading images:', error));
    }

    // تحديث عدد الصور
    function updateImageCount(count) {
        const imageCountDiv = document.getElementById('imageCount');
        imageCountDiv.textContent = `Total Images: ${count}`;
    }

    // عرض الصور
    function displayImages(images) {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        if (images.length === 0) {
            gallery.innerHTML = '<p>No images found!</p>';
            return;
        }

        images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="files/${image}" alt="${image}" onclick="showImagePopup('files/${image}')">
                <p>${image}</p>
                <button onclick="showDeletePopup('${image}')">Delete</button>
            `;
            gallery.appendChild(card);
        });
    }

    // رفع صورة
    function uploadImage() {
        const fileInput = document.getElementById('uploadInput');
        const file = fileInput.files[0];
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = '';

        if (!file) {
            messageDiv.textContent = 'Please select a file to upload.';
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        fetch('upload_image.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.textContent = 'Image uploaded successfully!';
                    messageDiv.style.color = 'green';
                    fileInput.value = ''; // تفريغ الحقل
                    loadImages();
                } else if (data.error === 'duplicate') {
                    messageDiv.textContent = 'Image already exists.';
                } else if (data.error === 'invalid') {
                    messageDiv.textContent = 'Invalid file type. Please upload an image.';
                } else {
                    messageDiv.textContent = 'Failed to upload image.';
                }
            });
    }

    // عرض نافذة الحذف
    function showDeletePopup(imageName) {
        imageToDelete = imageName;
        document.getElementById('deleteMessage').textContent = `Are you sure you want to delete \n"${imageName}"?`;
        document.getElementById('deletePopup').style.display = 'flex';
    }

    // إغلاق نافذة الحذف
    function closeDeletePopup() {
        imageToDelete = null;
        document.getElementById('deletePopup').style.display = 'none';
    }

    // تأكيد الحذف
    document.getElementById('confirmDelete').onclick = function() {
        if (!imageToDelete) return;

        fetch('delete_image.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageToDelete }),
        })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('message');
                if (data.success) {
                    messageDiv.textContent = 'Image deleted successfully!';
                    messageDiv.style.color = 'green';
                    loadImages();
                } else {
                    messageDiv.textContent = 'Failed to delete image.';
                }
            });

        closeDeletePopup(); // إغلاق النافذة
    };

    // إلغاء الحذف
    document.getElementById('cancelDelete').onclick = closeDeletePopup;

    // البحث عن الصور
    function searchImages() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const filteredImages = allImages.filter(image =>
            image.toLowerCase().includes(searchInput)
        );
        displayImages(filteredImages);
        updateImageCount(filteredImages.length);
    }

    // إعادة تعيين البحث
    function resetSearch() {
        document.getElementById('searchInput').value = '';
        displayImages(allImages);
        updateImageCount(allImages.length);
    }

    // عرض نافذة الصورة
    function showImagePopup(imageUrl) {
        const popup = document.getElementById('imagePopup');
        const popupImage = document.getElementById('popupImage');
        popupImage.src = imageUrl;
        popup.style.display = 'flex';
    }

    // إغلاق نافذة الصورة
    function closeImagePopup() {
        const popup = document.getElementById('imagePopup');
        popup.style.display = 'none';
    }

    // تحميل الصور عند فتح الصفحة
    window.onload = loadImages;
</script>

</body>
</html>
