<!-- MySQL Set up Commands -->
<!-- Database Creation -->
CREATE DATABASE laundry;

<!-- Table User -->
CREATE TABLE user (
  userID INT NOT NULL,
  bagNo VARCHAR(4),
  isCollected TINYINT(1) DEFAULT 1,
  email VARCHAR(255),
  name VARCHAR(100),
  PRIMARY KEY (userID)
);

<!-- Sample Data For User -->
INSERT into user(userID, bagNo, isCollected, email, name) VALUES 
