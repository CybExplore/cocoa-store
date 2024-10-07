import React from 'react';
import '../styles/Home.css'; // Import your styles

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to Cocoa Store</h1>
            <p>Your one-stop shop for all things chocolate!</p>

            <div className="project-details">
                <h2>About This Project</h2>
                <p>
                    This project is my final project for the ND Computer Science program.
                    <br />
                    <strong>Student Name:</strong> Robert Kingsley
                </p>
            </div>

            <div className="technologies">
                <h2>Technologies Used</h2>
                <ul>
                    <li>Frontend: HTML, CSS, React.js</li>
                    <li>Backend: Django, Django Rest Framework</li>
                    <li>Database: MariaDB (MySQL Framework)</li>
                </ul>
            </div>

            <div className="features">
                <h2>Key Features</h2>
                <ul>
                    <li>User Authentication (Login/Signup)</li>
                    <li>Product Catalog and Shopping Cart</li>
                    <li>Admin Dashboard for Managing Products</li>
                    <li>User Profile Management</li>
                </ul>
            </div>

            <div className="contact">
                <h2>Contact Me</h2>
                <p>If you have any questions, feel free to reach out!</p>
                <p>Email: <a href="mailto:robert.kingsley@example.com">robert.kingsley@example.com</a></p>
            </div>
        </div>
    );
};

export default Home;
