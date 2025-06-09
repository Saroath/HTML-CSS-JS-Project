<?php
// Start session
session_start();

// Set headers for JSON response
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate request data
if (!isset($data['product_id']) || !isset($data['quantity'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$product_id = intval($data['product_id']);
$quantity = intval($data['quantity']);
$size = isset($data['size']) ? $data['size'] : null;
$color = isset($data['color']) ? $data['color'] : null;

// Validate quantity
if ($quantity < 1) {
    http_response_code(400);
    echo json_encode(['error' => 'Quantity must be at least 1']);
    exit;
}

// Database connection
$host = "localhost";
$username = "username";
$password = "password";
$database = "velvet_vogue";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get product details
$query = "SELECT * FROM products WHERE id = $product_id";
$result = $conn->query($query);

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found']);
    exit;
}

$product = $result->fetch_assoc();

// Check if product is in stock
if ($product['stock'] < $quantity) {
    http_response_code(400);
    echo json_encode(['error' => 'Not enough stock available']);
    exit;
}

// Get product image
$image_query = "SELECT image_url FROM product_images WHERE product_id = $product_id AND is_primary = 1 LIMIT 1";
$image_result = $conn->query($image_query);
$image_url = $image_result->num_rows > 0 ? $image_result->fetch_assoc()['image_url'] : null;

// Initialize cart if it doesn't exist
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Generate a unique cart item ID based on product ID, size, and color
$cart_item_id = $product_id;
if ($size) $cart_item_id .= '_' . $size;
if ($color) $cart_item_id .= '_' . $color;

// Check if product is already in cart
$product_in_cart = false;
foreach ($_SESSION['cart'] as &$item) {
    if ($item['cart_item_id'] === $cart_item_id) {
        // Update quantity
        $item['quantity'] += $quantity;
        $product_in_cart = true;
        break;
    }
}

// Add product to cart if not already in cart
if (!$product_in_cart) {
    $_SESSION['cart'][] = [
        'cart_item_id' => $cart_item_id,
        'product_id' => $product_id,
        'name' => $product['name'],
        'price' => floatval($product['price']),
        'sale_price' => $product['sale_price'] ? floatval($product['sale_price']) : null,
        'quantity' => $quantity,
        'size' => $size,
        'color' => $color,
        'image' => $image_url
    ];
}

// Calculate cart totals
$subtotal = 0;
$item_count = 0;

foreach ($_SESSION['cart'] as $item) {
    $price = $item['sale_price'] ?? $item['price'];
    $subtotal += $price * $item['quantity'];
    $item_count += $item['quantity'];
}

// Return response
echo json_encode([
    'success' => true,
    'message' => 'Product added to cart',
    'cart' => [
        'items' => $_SESSION['cart'],
        'subtotal' => $subtotal,
        'item_count' => $item_count
    ]
]);

// Close connection
$conn->close();
?>
