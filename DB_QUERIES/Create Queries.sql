USE PersonalFinanceTracker;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL,
    isVerified BOOLEAN DEFAULT FALSE,
    verificationToken VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
	id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    name VARCHAR(100) NOT NULL,
    type ENUM('expense', 'income') NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
	id INT AUTO_INCREMENT PRIMARY KEY,
	userId INT NOT NULL,
	categoryId INT,
	type ENUM('expense', 'income') NOT NULL,
	amount DECIMAL(10,2) NOT NULL,
	description VARCHAR(255),
	frequency ENUM('one-time','weekly','monthly') DEFAULT 'one-time',
	transactionDate DATE NOT NULL,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE budgets (
	id INT AUTO_INCREMENT PRIMARY KEY,
	userId INT NOT NULL,
	categoryId INT NOT NULL,
	monthlyLimit DECIMAL(10,2) NOT NULL,
	month INT NOT NULL,
	year INT NOT NULL,	
	FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);