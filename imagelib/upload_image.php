<?php
$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = 'files/';
    $fileName = basename($_FILES['file']['name']);
    $targetFilePath = $uploadDir . $fileName;

    if (file_exists($targetFilePath)) {
        $response['error'] = 'duplicate'; // اسم الصورة موجود بالفعل
    } else {
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
            $response['success'] = true;
        }
    }
}

echo json_encode($response);
?>
