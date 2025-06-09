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

// Determine action (login, register, logout)
$action = isset($data['action']) ? $data['action'] : '';

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

// Handle login
if ($action === 'login') {
    // Validate request data
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];
    
    // Get user from database
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($query);
    
    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit;
    }
    
    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];
    
    // Return response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['first_name'] . ' ' . $user['last_name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
}
// Handle registration
else if ($action === 'register') {
    // Validate request data
    if (!isset($data['first_name']) || !isset($data['last_name']) || !isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    $first_name = $conn->real_escape_string($data['first_name']);
    $last_name = $conn->real_escape_string($data['last_name']);
    $email = $conn->real_escape_string($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $newsletter = isset($data['newsletter']) && $data['newsletter'] ? 1 : 0;
    
    // Check if email already exists
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($query);
    
    if ($result->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already in use']);
        exit;
    }
    
    // Insert user into database
    $query = "INSERT INTO users (first_name, last_name, email, password, newsletter, role, created_at) 
              VALUES ('$first_name', '$last_name', '$email', '$password', $newsletter, 'customer', NOW())";
    
    if ($conn->query($query) === TRUE) {
        $user_id = $conn->insert_id;
        
        // Create session
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $first_name . ' ' . $last_name;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_role'] = 'customer';
        
        // Return response
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'user' => [
                'id' => $user_id,
                'name' => $first_name . ' ' . $last_name,
                'email' => $email,
                'role' => 'customer'
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed']);
    }
}
// Handle logout
else if ($action === 'logout') {
    // Destroy session
    session_unset();
    session_destroy();
    
    // Return response
    echo json_encode([
        'success' => true,
        'message' => 'Logout successful'
    ]);
}
// Invalid action
else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
}

// Close connection
$conn->close();
?>
