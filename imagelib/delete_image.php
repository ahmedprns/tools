<?php
$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $image = $data['image'] ?? null;

    if ($image) {
        $filePath = 'files/' . $image;
        if (file_exists($filePath)) {
            if (unlink($filePath)) {
                $response['success'] = true;
            }
        }
    }
}

echo json_encode($response);
?>
