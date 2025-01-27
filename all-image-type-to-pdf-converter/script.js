document.getElementById('imageUpload').addEventListener('change', previewImages);
document.getElementById('convertBtn').addEventListener('click', convertToPDF);

function previewImages() {
    const previewSection = document.getElementById('previewSection');
    previewSection.innerHTML = ''; // Clear previous previews
    const files = document.getElementById('imageUpload').files;

    Array.from(files).forEach(file => {
        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(file);
        previewSection.appendChild(imgElement);
    });
}

function convertToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const files = document.getElementById('imageUpload').files;

    if (files.length === 0) {
        alert("Please upload some images first.");
        return;
    }

    Array.from(files).forEach((file, index) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            doc.addImage(img, 'JPEG', 10, 10, 180, 160);
            if (index < files.length - 1) {
                doc.addPage();
            }
            if (index === files.length - 1) {
                const downloadSection = document.getElementById('downloadSection');
                const downloadLink = document.createElement('a');
                downloadLink.href = doc.output('bloburl');
                downloadLink.download = 'images.pdf';
                downloadLink.textContent = 'Download PDF';
                downloadSection.innerHTML = '';
                downloadSection.appendChild(downloadLink);
            }
        };
    });
}