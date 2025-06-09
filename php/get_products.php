<?php
// Database connection
$host = "localhost";
$username = "username";
$password = "password";
$database = "velvet_vogue";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set headers for JSON response
header('Content-Type: application/json');

// Get query parameters
$category = isset($_GET['category']) ? $_GET['category'] : '';
$gender = isset($_GET['gender']) ? $_GET['gender'] : '';
$size = isset($_GET['size']) ? $_GET['size'] : '';
$price_min = isset($_GET['price_min']) ? floatval($_GET['price_min']) : 0;
$price_max = isset($_GET['price_max']) ? floatval($_GET['price_max']) : 1000;
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'featured';
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 12;
$offset = ($page - 1) * $limit;

// Build query
$query = "SELECT * FROM products WHERE 1=1";

// Add filters
if (!empty($category)) {
    $query .= " AND category = '" . $conn->real_escape_string($category) . "'";
}

if (!empty($gender)) {
    $query .= " AND gender = '" . $conn->real_escape_string($gender) . "'";
}

if (!empty($size)) {
    $query .= " AND FIND_IN_SET('" . $conn->real_escape_string($size) . "', sizes) > 0";
}

$query .= " AND price BETWEEN $price_min AND $price_max";

// Add sorting
switch ($sort) {
    case 'price-low':
        $query .= " ORDER BY price ASC";
        break;
    case 'price-high':
        $query .= " ORDER BY price DESC";
        break;
    case 'newest':
        $query .= " ORDER BY created_at DESC";
        break;
    case 'popular':
        $query .= " ORDER BY popularity DESC";
        break;
    default:
        $query .= " ORDER BY featured DESC, id ASC";
}

// Add pagination
$query .= " LIMIT $limit OFFSET $offset";

// Execute query
$result = $conn->query($query);

// Get total count for pagination
$count_query = "SELECT COUNT(*) as total FROM products WHERE 1=1";

// Add filters to count query
if (!empty($category)) {
    $count_query .= " AND category = '" . $conn->real_escape_string($category) . "'";
}

if (!empty($gender)) {
    $count_query .= " AND gender = '" . $conn->real_escape_string($gender) . "'";
}

if (!empty($size)) {
    $count_query .= " AND FIND_IN_SET('" . $conn->real_escape_string($size) . "', sizes) > 0";
}

$count_query .= " AND price BETWEEN $price_min AND $price_max";

$count_result = $conn->query($count_query);
$count_row = $count_result->fetch_assoc();
$total = $count_row['total'];
$total_pages = ceil($total / $limit);

// Prepare response
$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Get product images
        $images_query = "SELECT * FROM product_images WHERE product_id = " . $row['id'] . " ORDER BY is_primary DESC";
        $images_result = $conn->query($images_query);
        
        $images = [];
        if ($images_result->num_rows > 0) {
            while ($image_row = $images_result->fetch_assoc()) {
                $images[] = $image_row['image_url'];
            }
        }
        
        // Get product colors
        $colors_query = "SELECT * FROM product_colors WHERE product_id = " . $row['id'];
        $colors_result = $conn->query($colors_query);
        
        $colors = [];
        if ($colors_result->num_rows > 0) {
            while ($color_row = $colors_result->fetch_assoc()) {
                $colors[] = [
                    'name' => $color_row['name'],
                    'hex' => $color_row['hex_code']
                ];
            }
        }
        
        // Add product to array
        $products[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => floatval($row['price']),
            'sale_price' => $row['sale_price'] ? floatval($row['sale_price']) : null,
            'category' => $row['category'],
            'gender' => $row['gender'],
            'sizes' => explode(',', $row['sizes']),
            'colors' => $colors,
            'images' => $images,
            'is_new' => (bool)$row['is_new'],
            'is_sale' => (bool)$row['is_sale'],
            'is_featured' => (bool)$row['is_featured'],
            'stock' => intval($row['stock']),
            'created_at' => $row['created_at']
        ];
    }
}

// Return response
echo json_encode([
    'products' => $products,
    'pagination' => [
        'total' => $total,
        'per_page' => $limit,
        'current_page' => $page,
        'last_page' => $total_pages
    ]
]);

// Close connection
$conn->close();
?>
