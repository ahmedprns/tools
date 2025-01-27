<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Selector</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        .image-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .image-item {
            width: 100px;
            cursor: pointer;
            text-align: center;
        }
        .image-item img {
            max-width: 100%;
            border: 2px solid transparent;
            border-radius: 5px;
        }
        .image-item.selected img {
            border-color: blue;
        }
    </style>
</head>
<body>
    <form class="container mt-5">
        <div class="mb-3">
            <input type="text" id="imageInput1" class="form-control" readonly placeholder="اضغط على زر اختيار الصورة" value="img5.jpg">
            <input type="text" id="imageInput2" class="form-control" readonly placeholder="اضغط على زر اختيار الصورة" value="img5.jpg">
        </div>
    </form>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="imageSelector.js"></script>
    <script>
        // تفعيل الإضافة على الحقل النصي
        new ImageSelector('imageInput1');
        new ImageSelector('imageInput2');
    </script>
</body>
</html>
