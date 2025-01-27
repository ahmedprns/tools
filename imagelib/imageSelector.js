class ImageSelector {
    constructor(inputId) {
        this.input = document.getElementById(inputId);
        if (!this.input) {
            console.error(`No input element found with id: ${inputId}`);
            return;
        }
        this.allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // الامتدادات المسموحة
        this.lastUploadedImage = ''; // تخزين اسم آخر صورة مرفوعة
        this.init();
    }

    init() {
        // إنشاء الزر وإرفاقه
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'اختيار صورة';
        btn.className = 'btn btn-primary ms-2';
        btn.addEventListener('click', () => this.openPopup());
        this.input.insertAdjacentElement('afterend', btn);

        // إضافة div لعرض الصورة بعد التكست
        this.imagePreview = document.createElement('div');
        this.imagePreview.id = `${this.input.id}-imagePreview`;
        this.input.insertAdjacentElement('afterend', this.imagePreview);

        // إنشاء النافذة المنبثقة
        this.createModal();
        this.applyStyles();

        // الاستماع لتغير النص في التكست
        this.input.addEventListener('input', () => this.updateImagePreview());

        // إذا كان التكست يحتوي على قيمة عند تحميل الصفحة، تحميل الصورة المعروضة
        window.addEventListener('load', () => this.updateImagePreview());
    }

    createModal() {
        const modalId = `imageModal-${this.input.id}`;
        this.modal = document.createElement('div');
        this.modal.id = modalId;
        this.modal.className = 'modal fade';
        this.modal.setAttribute('tabindex', '-1');
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">اختر صورة</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="uploadSection">
                            <input type="file" id="uploadInput" class="form-control mb-3">
                            <button class="btn btn-success" id="uploadButton">رفع الصورة</button>
                            <div class="progress mt-2" style="display: none;" id="progressContainer">
                                <div class="progress-bar" role="progressbar" style="width: 0%;" id="progressBar"></div>
                            </div>
                            <small class="text-muted d-block mt-2" id="uploadMessage"></small>
                        </div>
                        <hr>
                        <input type="text" id="searchInput" class="form-control mb-3" placeholder="بحث باسم الصورة">
                        <div class="image-container" id="imageContainer"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                        <button class="btn btn-primary" id="confirmSelection">موافق</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // المراجع للعناصر
        this.imageContainer = this.modal.querySelector('#imageContainer');
        this.confirmBtn = this.modal.querySelector('#confirmSelection');
        this.uploadInput = this.modal.querySelector('#uploadInput');
        this.uploadBtn = this.modal.querySelector('#uploadButton');
        this.progressBar = this.modal.querySelector('#progressBar');
        this.progressContainer = this.modal.querySelector('#progressContainer');
        this.uploadMessage = this.modal.querySelector('#uploadMessage');
        this.searchInput = this.modal.querySelector('#searchInput');

        // إنشاء كائن الـ Modal
        this.bootstrapModal = new bootstrap.Modal(this.modal);

        // أحداث
        this.selectedImage = '';
        this.confirmBtn.addEventListener('click', () => this.confirmSelection());
        this.uploadBtn.addEventListener('click', () => this.uploadImage());
        this.searchInput.addEventListener('input', () => this.filterImages());
    }

    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .modal-dialog {
                max-width: 80%; /* عرض أكبر للنافذة */
            }
            .image-preview {
                width: 150px;
                margin-top: 5px;
                margin-bottom: 5px;
            }
            .image-container {
                max-height: 400px;
                overflow-y: auto;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .image-item {
                flex: 0 0 calc(12.5% - 10px);
                text-align: center;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px;
                transition: transform 0.3s ease, border-color 0.3s ease;
            }
            .image-item img {
                max-width: 100%;
                height: auto;
                border-radius: 3px;
            }
            .image-item.selected {
                border-color: #007bff;
                transform: scale(1.05);
            }
            /* تقليص حجم الصورة المعروضة */
            .image-preview img {
                max-width: 150px; /* يمكنك تغيير هذا الرقم حسب الحجم المطلوب */
                height: auto;
            }
                p {
  overflow: hidden;
}
        `;
        document.head.appendChild(style);
    }

    openPopup() {
        this.fetchImages();
        this.bootstrapModal.show();
        this.uploadInput.value = ''; // تفريغ حقل اختيار الملف
        this.uploadMessage.textContent = ''; // إخفاء الرسائل السابقة
        this.searchInput.value = ''; // تفريغ حقل البحث
    }

    fetchImages() {
        fetch('get_images.php')
            .then(response => response.json())
            .then(images => {
                this.imageContainer.innerHTML = '';
                images.forEach(image => {
                    const div = document.createElement('div');
                    div.className = 'image-item';
                    div.innerHTML = `
                        <img src="files/${image}" alt="${image}">
                        <p>${image}</p>
                    `;
                    div.addEventListener('click', () => {
                        document.querySelectorAll('.image-item').forEach(item => item.classList.remove('selected'));
                        div.classList.add('selected');
                        this.selectedImage = image;
                    });
                    this.imageContainer.appendChild(div);

                    // اختيار الصورة المرفوعة حديثًا
                    if (image === this.lastUploadedImage) {
                        div.click();
                    }
                });
            })
            .catch(err => console.error('Error fetching images:', err));
    }

    confirmSelection() {
        if (this.selectedImage) {
            this.input.value = this.selectedImage;
            this.bootstrapModal.hide();
            this.updateImagePreview(); // تحديث عرض الصورة بعد اختيارها
        }
    }

    uploadImage() {
        const file = this.uploadInput.files[0];
        if (!file) {
            this.displayMessage('يرجى اختيار ملف قبل رفعه.', 'text-danger');
            return;
        }

        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.allowedExtensions.includes(extension)) {
            this.displayMessage('نوع الملف غير مسموح. يرجى اختيار صورة.', 'text-danger');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        this.progressContainer.style.display = 'block';
        this.progressBar.style.width = '0%';

        fetch('upload_image.php', {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
            .then(result => {
                if (result.success) {
                    this.displayMessage('تم رفع الصورة بنجاح.', 'text-success');
                    this.lastUploadedImage = result.fileName; // تخزين اسم الصورة المرفوعة
                    this.fetchImages(); // تحديث قائمة الصور
                } else if (result.error === 'duplicate') {
                    this.displayMessage('اسم الصورة موجود بالفعل.', 'text-danger');
                } else {
                    this.displayMessage('حدث خطأ أثناء رفع الصورة.', 'text-danger');
                }
            })
            .catch(err => {
                this.displayMessage('فشل الاتصال بالخادم.', 'text-danger');
                console.error('Error uploading image:', err);
            })
            .finally(() => {
                this.progressContainer.style.display = 'none';
            });
    }

    filterImages() {
        const query = this.searchInput.value.toLowerCase();
        document.querySelectorAll('.image-item').forEach(item => {
            const name = item.querySelector('p').textContent.toLowerCase();
            item.style.display = name.includes(query) ? 'block' : 'none';
        });
    }

    updateImagePreview() {
        const imageName = this.input.value.trim();
        if (imageName) {
            this.imagePreview.innerHTML = `<img src="files/${imageName}" alt="${imageName}" class="image-preview">`;
        } else {
            this.imagePreview.innerHTML = ''; // إذا كان النص فارغًا، إخفاء الصورة
        }
    }

    displayMessage(message, className) {
        this.uploadMessage.textContent = message;
        this.uploadMessage.className = className;
    }
}

// استخدام الكلاس
new ImageSelector('imageText');
