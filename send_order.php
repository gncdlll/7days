<?php
header("Content-Type: application/json");

// Получение данных
$data = json_decode(file_get_contents("php://input"), true);

// Проверка
if (!$data || empty($data['name']) || empty($data['phone']) || empty($data['address']) || empty($data['cart'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Данные неполные."]);
    exit;
}

// Составляем письмо
$to = "hadizataaeva40@gmail.com";
$subject = "Новый заказ с сайта 7days";

$message = "Имя: " . $data['name'] . "\n";
$message .= "Телефон: " . $data['phone'] . "\n";
$message .= "Адрес: " . $data['address'] . "\n";
$message .= "\nТовары:\n";

foreach ($data['cart'] as $item) {
    $message .= "- " . $item['name'] . " (" . $item['price'] . "₽)\n";
}

$headers = "From: 7days <noreply@yourdomain.com>\r\n";

$sent = mail($to, $subject, $message, $headers);

echo json_encode(["success" => $sent]);
?>
