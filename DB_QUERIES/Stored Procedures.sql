USE railway;

-- SP 1: Get Monthly Summary
DELIMITER //
CREATE PROCEDURE GetMonthlySummary(IN p_userId INT, IN p_month INT, IN p_year INT)
BEGIN
  SELECT 
    c.name AS category,
    t.type,
    SUM(t.amount) AS totalAmount,
    b.monthlyLimit,
    ROUND((SUM(t.amount) / b.monthlyLimit) * 100, 2) AS percentageUsed
  FROM transactions t
  JOIN categories c ON t.categoryId = c.id
  LEFT JOIN budgets b ON b.categoryId = c.id 
    AND b.month = p_month AND b.year = p_year
  WHERE t.userId = p_userId
    AND MONTH(t.transactionDate) = p_month
    AND YEAR(t.transactionDate) = p_year
  GROUP BY c.name, t.type, b.monthlyLimit;
END //
DELIMITER ;

-- SP 2: Get Transaction History
DELIMITER //
CREATE PROCEDURE GetTransactionHistory(
  IN p_userId INT, 
  IN p_type VARCHAR(10), 
  IN p_startDate DATE,
  IN p_endDate DATE
)
BEGIN
  SELECT t.*, c.name AS categoryName
  FROM transactions t
  JOIN categories c ON t.categoryId = c.id
  WHERE t.userId = p_userId
    AND (p_type IS NULL OR t.type = p_type)
    AND (p_startDate IS NULL OR t.transactionDate >= p_startDate)
    AND (p_endDate IS NULL OR t.transactionDate <= p_endDate)
  ORDER BY t.transactionDate DESC;
END //
DELIMITER ;

-- SP 3: Get Dashboard Summary
DELIMITER //
CREATE PROCEDURE GetDashboardSummary(IN p_userId INT, IN p_month INT, IN p_year INT)
BEGIN
  SELECT 
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS totalIncome,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS totalExpense,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) AS netBalance
  FROM transactions t
  WHERE t.userId = p_userId
    AND MONTH(t.transactionDate) = p_month
    AND YEAR(t.transactionDate) = p_year;
END //
DELIMITER ;