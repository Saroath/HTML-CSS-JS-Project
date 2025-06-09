// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  initApp()
})

/**
 * Initialize the application
 */
function initApp() {
  // Initialize navigation
  initNavigation()

  // Initialize product functionality
  initProducts()

  // Initialize cart functionality
  initCart()

  // Initialize account functionality
  initAccount()

  // Initialize promotions slider
  initPromotionsSlider()

  // Initialize form validation
  initFormValidation()
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !navToggle.contains(event.target) &&
        !navMenu.contains(event.target) &&
        navMenu.classList.contains("active")
      ) {
        navToggle.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })
  }
}

/**
 * Initialize products functionality
 */
function initProducts() {
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const productId = this.getAttribute("data-product-id")
      addToCart(productId)
    })
  })

  // Quick view buttons
  const quickViewButtons = document.querySelectorAll(".quick-view")
  quickViewButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const productId = this.getAttribute("data-product-id")
      showQuickView(productId)
    })
  })

  // Product filters (on products page)
  initProductFilters()
}

/**
 * Initialize product filters
 */
function initProductFilters() {
  const filterSelects = document.querySelectorAll(".filter-select")
  const clearFiltersBtn = document.getElementById("clear-filters")
  const productsGrid = document.getElementById("products-grid")
  const resultsCount = document.getElementById("results-count")

  if (filterSelects.length && productsGrid) {
    // Apply filters when select values change
    filterSelects.forEach((select) => {
      select.addEventListener("change", applyFilters)
    })

    // Clear filters button
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        filterSelects.forEach((select) => {
          select.selectedIndex = 0
        })
        applyFilters()
      })
    }

    // Function to apply all filters
    function applyFilters() {
      const category = document.getElementById("category-filter")?.value || ""
      const gender = document.getElementById("gender-filter")?.value || ""
      const size = document.getElementById("size-filter")?.value || ""
      const price = document.getElementById("price-filter")?.value || ""
      const sort = document.getElementById("sort-filter")?.value || "featured"

      const products = productsGrid.querySelectorAll(".product-card")
      let visibleCount = 0

      products.forEach((product) => {
        let shouldShow = true

        // Apply category filter
        if (category && !product.getAttribute("data-category")?.includes(category)) {
          shouldShow = false
        }

        // Apply gender filter
        if (gender && !product.getAttribute("data-gender")?.includes(gender)) {
          shouldShow = false
        }

        // Apply size filter
        if (size && !product.getAttribute("data-size")?.includes(size)) {
          shouldShow = false
        }

        // Apply price filter
        if (price) {
          const productPrice = Number.parseFloat(product.getAttribute("data-price") || "0")
          const [min, max] = price.split("-").map((p) => (p === "+" ? Number.POSITIVE_INFINITY : Number.parseFloat(p)))

          if (productPrice < min || (max !== Number.POSITIVE_INFINITY && productPrice > max)) {
            shouldShow = false
          }
        }

        // Show or hide the product
        if (shouldShow) {
          product.style.display = ""
          visibleCount++
        } else {
          product.style.display = "none"
        }
      })

      // Sort products
      sortProducts(sort)

      // Update results count
      if (resultsCount) {
        resultsCount.textContent = `Showing ${visibleCount} of ${products.length} products`
      }
    }

    // Function to sort products
    function sortProducts(sortBy) {
      const products = Array.from(productsGrid.querySelectorAll(".product-card"))

      products.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return (
              Number.parseFloat(a.getAttribute("data-price") || "0") -
              Number.parseFloat(b.getAttribute("data-price") || "0")
            )
          case "price-high":
            return (
              Number.parseFloat(b.getAttribute("data-price") || "0") -
              Number.parseFloat(a.getAttribute("data-price") || "0")
            )
          case "newest":
            // In a real app, you'd have a date attribute to sort by
            return 0
          case "popular":
            // In a real app, you'd have a popularity attribute to sort by
            return 0
          default:
            return 0
        }
      })

      // Reorder the products in the DOM
      products.forEach((product) => {
        productsGrid.appendChild(product)
      })
    }
  }

  // Initialize pagination
  initPagination()
}

/**
 * Initialize pagination
 */
function initPagination() {
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")
  const pageInfo = document.querySelector(".page-info")

  if (prevPageBtn && nextPageBtn && pageInfo) {
    let currentPage = 1
    const totalPages = 3 // In a real app, this would be calculated based on total products

    updatePagination()

    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        updatePagination()
        // In a real app, you'd fetch the products for the new page
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })

    nextPageBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        updatePagination()
        // In a real app, you'd fetch the products for the new page
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })

    function updatePagination() {
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
      prevPageBtn.disabled = currentPage === 1
      nextPageBtn.disabled = currentPage === totalPages
    }
  }
}

/**
 * Show quick view modal for a product
 * @param {string} productId - The ID of the product to show
 */
function showQuickView(productId) {
  // In a real app, you'd fetch the product details and show a modal
  alert(`Quick view for product ${productId} would show here`)
}

/**
 * Initialize cart functionality
 */
function initCart() {
  // Update cart count from localStorage
  updateCartCount()

  // Initialize cart page functionality if on cart page
  if (document.getElementById("cart-items")) {
    loadCartItems()

    // Clear cart button
    const clearCartBtn = document.getElementById("clear-cart")
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        clearCart()
        loadCartItems()
      })
    }

    // Promo code application
    const applyPromoBtn = document.getElementById("apply-promo")
    const promoInput = document.getElementById("promo-code")
    const promoMessage = document.getElementById("promo-message")

    if (applyPromoBtn && promoInput && promoMessage) {
      applyPromoBtn.addEventListener("click", () => {
        const promoCode = promoInput.value.trim()

        if (!promoCode) {
          promoMessage.textContent = "Please enter a promo code"
          promoMessage.className = "promo-message error"
          return
        }

        // In a real app, you'd validate the promo code with the server
        if (promoCode.toUpperCase() === "VELVET20") {
          promoMessage.textContent = "Promo code applied: 20% off"
          promoMessage.className = "promo-message success"

          // Show discount row
          const discountRow = document.getElementById("discount-row")
          const discountAmount = document.getElementById("discount")
          const subtotal = Number.parseFloat(document.getElementById("subtotal").textContent.replace("$", ""))

          if (discountRow && discountAmount) {
            const discount = subtotal * 0.2
            discountAmount.textContent = `-$${discount.toFixed(2)}`
            discountRow.style.display = "flex"

            // Update total
            updateCartTotal()
          }
        } else {
          promoMessage.textContent = "Invalid promo code"
          promoMessage.className = "promo-message error"
        }
      })
    }

    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn")
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        // In a real app, you'd redirect to a checkout page or show a checkout modal
        alert("Checkout functionality would be implemented here")
      })
    }
  }
}

/**
 * Add a product to the cart
 * @param {string} productId - The ID of the product to add
 */
function addToCart(productId) {
  // Get current cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product is already in cart
  const existingProduct = cart.find((item) => item.id === productId)

  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    // In a real app, you'd fetch the product details from the server
    // For now, we'll use placeholder data
    cart.push({
      id: productId,
      name: `Product ${productId}`,
      price: Math.floor(Math.random() * 50) + 20,
      image: `https://placehold.co/100x100/F5F5F5/4B0082?text=Product+${productId}`,
      quantity: 1,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Show confirmation message
  showToast("Product added to cart!")
}

/**
 * Update the cart count in the header
 */
function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count")
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Calculate total quantity
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0)

  // Update all cart count elements
  cartCountElements.forEach((element) => {
    element.textContent = totalQuantity
  })
}

/**
 * Load cart items on the cart page
 */
function loadCartItems() {
  const cartContent = document.getElementById("cart-content")
  const emptyCart = document.getElementById("empty-cart")
  const cartList = document.getElementById("cart-list")
  const cartSummary = document.getElementById("cart-summary")
  const recommendedProducts = document.getElementById("recommended-products")

  if (!cartContent || !emptyCart || !cartList || !cartSummary) return

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  if (cart.length === 0) {
    // Show empty cart message
    emptyCart.style.display = "block"
    cartContent.style.display = "none"
    cartSummary.style.display = "none"
    recommendedProducts.style.display = "none"
    return
  }

  // Show cart content
  emptyCart.style.display = "none"
  cartContent.style.display = "block"
  cartSummary.style.display = "block"
  recommendedProducts.style.display = "block"

  // Clear cart list
  cartList.innerHTML = ""

  // Add each item to the cart list
  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.setAttribute("data-product-id", item.id)

    cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-description">Product description would go here</p>
                <div class="item-options">
                    <span class="item-size">Size: M</span>
                    <span class="item-color">Color: Default</span>
                </div>
            </div>
            <div class="item-quantity">
                <label for="quantity-${item.id}" class="sr-only">Quantity</label>
                <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                <input type="number" id="quantity-${item.id}" class="quantity-input" value="${item.quantity}" min="1" max="10" data-product-id="${item.id}">
                <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
            </div>
            <div class="item-price">
                <span class="price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="item-actions">
                <button class="remove-item" data-product-id="${item.id}" aria-label="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

    cartList.appendChild(cartItem)
  })

  // Add event listeners for quantity buttons
  const minusButtons = cartList.querySelectorAll(".quantity-btn.minus")
  const plusButtons = cartList.querySelectorAll(".quantity-btn.plus")
  const quantityInputs = cartList.querySelectorAll(".quantity-input")
  const removeButtons = cartList.querySelectorAll(".remove-item")

  minusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id")
      updateCartItemQuantity(productId, -1)
    })
  })

  plusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id")
      updateCartItemQuantity(productId, 1)
    })
  })

  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const productId = this.getAttribute("data-product-id")
      const newQuantity = Number.parseInt(this.value)

      if (newQuantity < 1) {
        this.value = 1
        updateCartItemQuantity(productId, 0, 1)
      } else if (newQuantity > 10) {
        this.value = 10
        updateCartItemQuantity(productId, 0, 10)
      } else {
        updateCartItemQuantity(productId, 0, newQuantity)
      }
    })
  })

  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id")
      removeCartItem(productId)
    })
  })

  // Update cart summary
  updateCartTotal()
}

/**
 * Update the quantity of an item in the cart
 * @param {string} productId - The ID of the product to update
 * @param {number} change - The amount to change the quantity by
 * @param {number} [newQuantity] - The new quantity to set (optional)
 */
function updateCartItemQuantity(productId, change, newQuantity) {
  // Get current cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Find the product in the cart
  const productIndex = cart.findIndex((item) => item.id === productId)

  if (productIndex !== -1) {
    if (newQuantity !== undefined) {
      // Set to specific quantity
      cart[productIndex].quantity = newQuantity
    } else {
      // Change by specified amount
      cart[productIndex].quantity += change

      // Ensure quantity is between 1 and 10
      if (cart[productIndex].quantity < 1) {
        cart[productIndex].quantity = 1
      } else if (cart[productIndex].quantity > 10) {
        cart[productIndex].quantity = 10
      }
    }

    // Update quantity input
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`)
    if (quantityInput) {
      quantityInput.value = cart[productIndex].quantity
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count and total
    updateCartCount()
    updateCartTotal()
  }
}

/**
 * Remove an item from the cart
 * @param {string} productId - The ID of the product to remove
 */
function removeCartItem(productId) {
  // Get current cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  // Remove the product from the cart
  cart = cart.filter((item) => item.id !== productId)

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Reload cart items
  loadCartItems()
}

/**
 * Clear the entire cart
 */
function clearCart() {
  // Clear cart in localStorage
  localStorage.removeItem("cart")

  // Update cart count
  updateCartCount()
}

/**
 * Update the cart total in the summary
 */
function updateCartTotal() {
  const subtotalElement = document.getElementById("subtotal")
  const shippingElement = document.getElementById("shipping")
  const taxElement = document.getElementById("tax")
  const discountElement = document.getElementById("discount")
  const totalElement = document.getElementById("total")

  if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`

  // Set shipping cost
  const shipping = subtotal > 50 ? 0 : 5.99
  shippingElement.textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`

  // Calculate tax (e.g., 8%)
  const tax = subtotal * 0.08
  taxElement.textContent = `$${tax.toFixed(2)}`

  // Calculate discount if applicable
  let discount = 0
  if (discountElement && discountElement.textContent) {
    discount = Number.parseFloat(discountElement.textContent.replace("-$", "")) || 0
  }

  // Calculate total
  const total = subtotal + shipping + tax - discount
  totalElement.textContent = `$${total.toFixed(2)}`
}

/**
 * Initialize account functionality
 */
function initAccount() {
  // Auth tabs (login/register)
  const authTabs = document.querySelectorAll(".auth-tab")
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  if (authTabs.length && loginForm && registerForm) {
    authTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        authTabs.forEach((t) => t.classList.remove("active"))

        // Add active class to clicked tab
        this.classList.add("active")

        // Show corresponding form
        const tabName = this.getAttribute("data-tab")

        if (tabName === "login") {
          loginForm.style.display = "block"
          registerForm.style.display = "none"
        } else {
          loginForm.style.display = "none"
          registerForm.style.display = "block"
        }
      })
    })
  }

  // Password toggle
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target")
      const passwordInput = document.getElementById(targetId)

      if (passwordInput) {
        if (passwordInput.type === "password") {
          passwordInput.type = "text"
          this.innerHTML = '<i class="fas fa-eye-slash"></i>'
        } else {
          passwordInput.type = "password"
          this.innerHTML = '<i class="fas fa-eye"></i>'
        }
      }
    })
  })

  // Password strength meter
  const passwordInput = document.getElementById("register-password")
  const passwordStrength = document.getElementById("password-strength")

  if (passwordInput && passwordStrength) {
    passwordInput.addEventListener("input", function () {
      const password = this.value
      let strength = 0

      // Length check
      if (password.length >= 8) strength += 1

      // Uppercase check
      if (/[A-Z]/.test(password)) strength += 1

      // Lowercase check
      if (/[a-z]/.test(password)) strength += 1

      // Number check
      if (/[0-9]/.test(password)) strength += 1

      // Special character check
      if (/[^A-Za-z0-9]/.test(password)) strength += 1

      // Update strength indicator
      if (password.length === 0) {
        passwordStrength.textContent = ""
        passwordStrength.className = "password-strength"
      } else if (strength < 3) {
        passwordStrength.textContent = "Weak password"
        passwordStrength.className = "password-strength weak"
      } else if (strength < 5) {
        passwordStrength.textContent = "Medium password"
        passwordStrength.className = "password-strength medium"
      } else {
        passwordStrength.textContent = "Strong password"
        passwordStrength.className = "password-strength strong"
      }
    })
  }

  // Dashboard navigation
  const dashboardNavItems = document.querySelectorAll(".dashboard-nav .nav-item")
  const dashboardSections = document.querySelectorAll(".dashboard-section")

  if (dashboardNavItems.length && dashboardSections.length) {
    dashboardNavItems.forEach((item) => {
      if (item.classList.contains("logout")) return

      item.addEventListener("click", function (e) {
        e.preventDefault()

        // Remove active class from all items
        dashboardNavItems.forEach((i) => i.classList.remove("active"))

        // Add active class to clicked item
        this.classList.add("active")

        // Show corresponding section
        const sectionName = this.getAttribute("data-section")

        dashboardSections.forEach((section) => {
          if (section.id === `${sectionName}-section`) {
            section.classList.add("active")
          } else {
            section.classList.remove("active")
          }
        })
      })
    })
  }

  // Admin tabs
  const adminTabs = document.querySelectorAll(".admin-tab")
  const adminContents = document.querySelectorAll(".admin-content")

  if (adminTabs.length && adminContents.length) {
    adminTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        adminTabs.forEach((t) => t.classList.remove("active"))

        // Add active class to clicked tab
        this.classList.add("active")

        // Show corresponding content
        const tabName = this.getAttribute("data-admin-tab")

        adminContents.forEach((content) => {
          if (content.id === `admin-${tabName}`) {
            content.classList.add("active")
          } else {
            content.classList.remove("active")
          }
        })
      })
    })
  }

  // Login form submission
  const loginFormElement = document.getElementById("login-form-element")
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      // Validate form
      let isValid = true

      if (!validateEmail(email)) {
        showError("login-email", "Please enter a valid email address")
        isValid = false
      } else {
        hideError("login-email")
      }

      if (!password) {
        showError("login-password", "Please enter your password")
        isValid = false
      } else {
        hideError("login-password")
      }

      if (isValid) {
        // In a real app, you'd send the login request to the server
        // For demo purposes, we'll simulate a successful login
        simulateLogin(email)
      }
    })
  }

  // Register form submission
  const registerFormElement = document.getElementById("register-form-element")
  if (registerFormElement) {
    registerFormElement.addEventListener("submit", (e) => {
      e.preventDefault()

      const firstname = document.getElementById("register-firstname").value
      const lastname = document.getElementById("register-lastname").value
      const email = document.getElementById("register-email").value
      const password = document.getElementById("register-password").value
      const confirmPassword = document.getElementById("register-confirm-password").value
      const termsAgreement = document.getElementById("terms-agreement").checked

      // Validate form
      let isValid = true

      if (!firstname) {
        showError("register-firstname", "Please enter your first name")
        isValid = false
      } else {
        hideError("register-firstname")
      }

      if (!lastname) {
        showError("register-lastname", "Please enter your last name")
        isValid = false
      } else {
        hideError("register-lastname")
      }

      if (!validateEmail(email)) {
        showError("register-email", "Please enter a valid email address")
        isValid = false
      } else {
        hideError("register-email")
      }

      if (!password) {
        showError("register-password", "Please enter a password")
        isValid = false
      } else if (password.length < 8) {
        showError("register-password", "Password must be at least 8 characters")
        isValid = false
      } else {
        hideError("register-password")
      }

      if (!confirmPassword) {
        showError("register-confirm-password", "Please confirm your password")
        isValid = false
      } else if (password !== confirmPassword) {
        showError("register-confirm-password", "Passwords do not match")
        isValid = false
      } else {
        hideError("register-confirm-password")
      }

      if (!termsAgreement) {
        alert("Please agree to the Terms of Service and Privacy Policy")
        isValid = false
      }

      if (isValid) {
        // In a real app, you'd send the registration request to the server
        // For demo purposes, we'll simulate a successful registration
        simulateRegistration(firstname, lastname, email)
      }
    })
  }

  // Logout button
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // In a real app, you'd send a logout request to the server
      // For demo purposes, we'll just clear the user from localStorage
      localStorage.removeItem("user")

      // Redirect to account page
      window.location.href = "account.html"
    })
  }

  // Check if user is logged in
  checkUserLogin()
}

/**
 * Simulate a login
 * @param {string} email - The user's email
 */
function simulateLogin(email) {
  // Show loading state
  const loginBtn = document.querySelector('#login-form-element button[type="submit"]')
  loginBtn.innerHTML = '<span class="spinner"></span> Signing in...'
  loginBtn.disabled = true

  // Simulate API call delay
  setTimeout(() => {
    // Create user object
    const user = {
      email: email,
      name: email.split("@")[0],
      isAdmin: email.includes("admin"),
    }

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(user))

    // Show success message
    showToast("Login successful!")

    // Reload page to show dashboard
    window.location.reload()
  }, 1500)
}

/**
 * Simulate a registration
 * @param {string} firstname - The user's first name
 * @param {string} lastname - The user's last name
 * @param {string} email - The user's email
 */
function simulateRegistration(firstname, lastname, email) {
  // Show loading state
  const registerBtn = document.querySelector('#register-form-element button[type="submit"]')
  registerBtn.innerHTML = '<span class="spinner"></span> Creating account...'
  registerBtn.disabled = true

  // Simulate API call delay
  setTimeout(() => {
    // Create user object
    const user = {
      email: email,
      name: `${firstname} ${lastname}`,
      isAdmin: email.includes("admin"),
    }

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(user))

    // Show success message
    showToast("Registration successful!")

    // Reload page to show dashboard
    window.location.reload()
  }, 1500)
}

/**
 * Check if user is logged in and update UI accordingly
 */
function checkUserLogin() {
  const authContainer = document.getElementById("auth-container")
  const userDashboard = document.getElementById("user-dashboard")
  const adminNav = document.getElementById("admin-nav")

  if (!authContainer || !userDashboard) return

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"))

  if (user) {
    // User is logged in, show dashboard
    authContainer.style.display = "none"
    userDashboard.style.display = "grid"

    // Update user info
    const userName = document.getElementById("user-name")
    const userEmail = document.getElementById("user-email")

    if (userName && userEmail) {
      userName.textContent = user.name
      userEmail.textContent = user.email
    }

    // Show admin section if user is admin
    if (adminNav && user.isAdmin) {
      adminNav.style.display = "flex"
    }

    // Update profile form
    const profileFirstname = document.getElementById("profile-firstname")
    const profileLastname = document.getElementById("profile-lastname")
    const profileEmail = document.getElementById("profile-email")

    if (profileFirstname && profileLastname && profileEmail) {
      const nameParts = user.name.split(" ")
      profileFirstname.value = nameParts[0] || ""
      profileLastname.value = nameParts[1] || ""
      profileEmail.value = user.email
    }
  } else {
    // User is not logged in, show auth forms
    authContainer.style.display = "block"
    userDashboard.style.display = "none"
  }
}

/**
 * Initialize promotions slider
 */
function initPromotionsSlider() {
  const promoSlides = document.querySelectorAll(".promo-slide")

  if (promoSlides.length > 1) {
    let currentSlide = 0

    // Show first slide
    promoSlides[0].classList.add("active")

    // Set interval to rotate slides
    setInterval(() => {
      // Hide current slide
      promoSlides[currentSlide].classList.remove("active")

      // Move to next slide
      currentSlide = (currentSlide + 1) % promoSlides.length

      // Show new slide
      promoSlides[currentSlide].classList.add("active")
    }, 5000)
  }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
  // Newsletter form
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const emailInput = this.querySelector('input[type="email"]')
      const email = emailInput.value

      if (validateEmail(email)) {
        // In a real app, you'd send the subscription request to the server
        showToast("Thank you for subscribing!")
        emailInput.value = ""
      } else {
        showToast("Please enter a valid email address", "error")
      }
    })
  }
}

/**
 * Validate an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Show an error message for a form field
 * @param {string} fieldId - The ID of the field
 * @param {string} message - The error message to show
 */
function showError(fieldId, message) {
  const field = document.getElementById(fieldId)
  const errorElement = document.getElementById(`${fieldId}-error`)

  if (field && errorElement) {
    field.classList.add("error")
    errorElement.textContent = message
    errorElement.classList.add("show")
  }
}

/**
 * Hide the error message for a form field
 * @param {string} fieldId - The ID of the field
 */
function hideError(fieldId) {
  const field = document.getElementById(fieldId)
  const errorElement = document.getElementById(`${fieldId}-error`)

  if (field && errorElement) {
    field.classList.remove("error")
    errorElement.textContent = ""
    errorElement.classList.remove("show")
  }
}

/**
 * Show a toast notification
 * @param {string} message - The message to show
 * @param {string} [type='success'] - The type of toast (success, error, info)
 */
function showToast(message, type = "success") {
  // Create toast element
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.textContent = message

  // Add to document
  document.body.appendChild(toast)

  // Show toast
  setTimeout(() => {
    toast.classList.add("show")
  }, 10)

  // Hide and remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")

    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Add toast styles if not already in CSS
const toastStyles = document.createElement("style")
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background-color: #4B0082;
        color: white;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .toast.error {
        background-color: #dc3545;
    }
    
    .toast.info {
        background-color: #17a2b8;
    }
`
document.head.appendChild(toastStyles)
