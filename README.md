# Cocoa Store

Welcome to the Cocoa Store! This is a simple e-commerce application where users can browse products, add them to their cart, and proceed to checkout.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- User authentication (login/logout)
- Product browsing with details
- Add products to the cart
- View cart and remove items
- Checkout process
- Responsive design

## Technologies Used

- **Frontend**: React, React Router, Axios
- **Backend**: Django REST Framework
- **Database**: SQLite/PostgreSQL (depending on your setup)
- **Styling**: CSS

## Installation

### Prerequisites

- Node.js (version >= 14.x)
- npm (Node package manager)
- Python (version >= 3.x)
- Django (version >= 3.x)
- Django REST Framework

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/CybExplore/cocoa-store.git
   cd cocoa-store
   ```
2. Install the required npm packages:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to your backend directory (if applicable):

   ```bash
   cd backend
   ```
2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install required packages:

   ```bash
   pip install -r requirements.txt
   ```
5. Run the migrations:

   ```bash
   python manage.py migrate
   ```
6. Start the Django server:

   ```bash
   python manage.py runserver
   ```

## Usage

1. Visit `http://localhost:3000` to view the application.
2. Browse products and add them to your cart.
3. View your cart, remove items if necessary, and proceed to checkout.

## API Endpoints

- **GET /api/products/**: Fetch all products.
- **GET /api/products/{slug}/**: Fetch product details by slug.
- **GET /api/cart/**: Get cart items for the authenticated user.
- **POST /api/cart/add_to_cart/**: Add an item to the cart.
- **POST /api/cart/remove_from_cart/**: Remove an item from the cart.
- **POST /api/cart/clear_cart/**: Clear all items from the cart.
- **POST /api/orders/**: Create a new order.

## Contributing

Contributions are welcome! If you have suggestions for improvements or features, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Author

Developed by **Nurudeen O.A**

---

Thank you for checking out the Cocoa Store! We hope you enjoy using the application. If you have any questions, feel free to reach out.

GitHub Repository: [Cocoa Store](https://github.com/CybExplore/cocoa-store)
