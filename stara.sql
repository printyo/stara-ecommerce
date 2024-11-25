-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 23, 2024 at 12:03 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stara`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `userID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `quantity` int(3) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `categoryID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`categoryID`, `name`, `description`) VALUES
(1, 'T-Shirts', 'T-shirts are a basic cotton tees to graphic prints and performance fabrics, they offer comfort and endless styling options for any occasion.'),
(2, 'Hoodie', 'Hoodies are comfortable, casual outerwear featuring a hood and often a front pocket. Made from soft fabrics, they offer warmth and versatility.\r\n\r\n'),
(3, 'Dresses', 'Dresses are one-piece solution for any occasion. Available in various styles, dresses can be making a go-to choice for both day and evening wear.\r\n\r\n\r\n'),
(4, 'Pants', 'Pants suit different occasions and preferences. From casual jeans and activewear, pants offer comfort and functionality for everyday wear.'),
(5, 'Shorts', 'Shorts available in various styles, from athletic and cargo to denim and tailored, they are perfect for outdoor activities.'),
(6, 'Coats', 'Coats are essential outerwear designed to provide warmth and style during colder months. Perfect for layering over outfits in cooler weather.');

-- --------------------------------------------------------

--
-- Table structure for table `devChat`
--

CREATE TABLE `devChat` (
  `devChatID` int(11) NOT NULL,
  `chat` varchar(255) NOT NULL COMMENT 'Discuss Problems with Developer',
  `dateTime` timestamp NOT NULL DEFAULT current_timestamp(),
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `devChat`
--

INSERT INTO `devChat` (`devChatID`, `chat`, `dateTime`, `userID`) VALUES
(5, 'Hey, we’ve had some issues with the checkout process. A few users reported that after adding items to their cart and proceeding to checkout, they’re getting a blank page. Can you take a look at it?', '2024-11-22 22:55:36', 2),
(6, 'Sure! I’ll check it out right away. Are they getting any error message on the page, or is it just a blank screen?', '2024-11-22 22:56:23', 3),
(7, 'No error message, just a blank page after they hit “Proceed to Checkout.” It seems to happen sometimes, but we’re not sure of the cause yet. I’ve also noticed it affects both desktop and mobile users.', '2024-11-22 22:57:21', 2),
(8, 'Got it. I’ll go through the recent changes and see if anything\'s conflicting with the checkout page. It might also be related to the new payment gateway integration. I’ll need to check the API responses as well.', '2024-11-22 22:58:32', 3),
(9, 'That sounds like a good place to start. In the meantime, I’ve had a few customers call in about this issue. It’s getting a bit frustrating for them, so we need to fix it ASAP.', '2024-11-22 22:59:24', 2),
(10, 'Understood! I’ll prioritize this and keep you updated. I’ll also run some tests on the payment integration to ensure it’s working correctly. I’ll let you know if I find anything.', '2024-11-22 23:01:36', 3);

-- --------------------------------------------------------

--
-- Table structure for table `orderDetails`
--

CREATE TABLE `orderDetails` (
  `orderID` int(11) NOT NULL,
  `Total` decimal(11,2) NOT NULL,
  `AddressID` int(11) NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderDetails`
--

INSERT INTO `orderDetails` (`orderID`, `Total`, `AddressID`, `userID`) VALUES
(1, 2880.00, 2, 2),
(2, 3880.00, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `orderItems`
--

CREATE TABLE `orderItems` (
  `orderID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `quantity` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderItems`
--

INSERT INTO `orderItems` (`orderID`, `productID`, `quantity`) VALUES
(1, 2, 1),
(1, 14, 1),
(2, 7, 1),
(2, 30, 1);

-- --------------------------------------------------------

--
-- Table structure for table `orderStatusHistory`
--

CREATE TABLE `orderStatusHistory` (
  `orderStatusID` int(11) NOT NULL,
  `dateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=pending,2=payment confirmed, 3=processing, 4=shipped, 5=delivered, 6=payment failed',
  `remark` varchar(255) DEFAULT NULL,
  `orderID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderStatusHistory`
--

INSERT INTO `orderStatusHistory` (`orderStatusID`, `dateTime`, `status`, `remark`, `orderID`) VALUES
(1, '2024-11-16 23:29:26', 1, NULL, 1),
(2, '2024-11-16 23:29:46', 2, 'Let\'s go', 1),
(3, '2024-11-16 23:31:35', 1, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `paymentID` int(11) NOT NULL,
  `fileURL` varchar(255) NOT NULL DEFAULT 'n-a.jpg' COMMENT 'store payment-slips path',
  `dateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `orderID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`paymentID`, `fileURL`, `dateTime`, `orderID`) VALUES
(1, '1731774566070.png', '2024-11-16 23:29:26', 1),
(2, '1731774695905.png', '2024-11-16 23:31:35', 2);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL,
  `price` decimal(11,2) NOT NULL,
  `imageURL` varchar(255) NOT NULL DEFAULT 'n-a.jpg' COMMENT 'image path eg. t-shirt.jpg',
  `categoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `name`, `description`, `stock`, `price`, `imageURL`, `categoryID`) VALUES
(1, 'Basic T-Shirt', '100% Organic Cotton: Soft, breathable, and hypoallergenic, perfect for all-day wear. Organic cotton is grown without harmful chemicals, making it an eco-friendly choice.', 100, 1190.00, 'basict-shirts.jpg', 1),
(2, 'The Stara Linen Pants', 'Linen and cotton from eco-friendly practices aligns with STARA’s commitment to sustainable fashion. Lightweight, durable, and has a unique texture that becomes softer with each wash. It also has a natural luster and drapes beautifully.\r\n', 100, 1590.00, 'linenpant.jpg', 4),
(3, 'The Stara Gold Short', 'Silk Blend: A luxurious blend that provides a smooth, shiny finish while remaining lightweight and breathable.\r\n', 100, 2590.00, 'goldshort.jpg', 5),
(4, 'Basic Hoodie', 'Organic Cotton Blend: A mix that provides softness, breathability, and durability while being eco-friendly.\r\n', 100, 1590.00, 'basichoodie.jpg', 2),
(5, 'Wool  Brown Coat', 'a sophisticated yet casual brown coat designed for both style and warmth. It features a tailored silhouette with subtle modern touches.\r\n', 100, 1890.00, 'coat-1.jpg', 6),
(6, 'Cinnamon Fur-Lined Trench Coat', 'High-quality wool blend outer fabric with a super-soft faux fur lining for added warmth. A versatile choice for work, casual weekends, or more elegant outings.', 100, 2390.00, 'coat-2.jpg', 6),
(7, 'Onyx & Mocha Leather Long Coat', 'Luxurious, high-quality brown leather with a smooth texture that provides both comfort and durability. Perfect for transitional weather, travel, business, or a night out.', 100, 2590.00, 'coat-3.jpg', 6),
(8, 'Sandstone Serenity Coat', 'an elegant and timeless outerwear piece designed for the woman who loves classic beauty with a modern edge. Made from soft beige fabric, neutral tone that pairs well with any wardrobe.', 100, 1990.00, 'coat-4.jpg', 6),
(9, 'Shadow Luxe Fur Coat', 'The understated grey fabric serves as a perfect backdrop to the bold black fur collar and cuffs, adding a touch of drama and sophistication.', 100, 1790.00, 'coat-5.jpg', 6),
(10, 'Pleated Jersey Dress', 'Ankle-length dress in pleated jersey designed with an A-line silhouette. Loose fit with a deep and spaghetti shoulder straps.', 100, 890.00, 'dress-1.jpg', 3),
(11, 'Smock-topped Dress', 'Calf-length grey dress in a cotton weave with detachable and a smocked bodice featuring a frill-trimmed sweetheart neckline and an elasticated seam at the centre of the bust.', 100, 990.00, 'dress-2.jpg', 3),
(12, 'The White Lace Dress', 'Layered Trim Crew Neck Dress with elegant short sleeve dress for spring and summer', 100, 1190.00, 'dress-3.jpg', 3),
(13, 'Sage Green Tiered Mini Dress', 'A stylish and feminine piece that combines a soft, muted green hue with a playful and layered silhouette. The tiered design making a versatile and eye-catching', 100, 1390.00, 'dress-4.jpg', 3),
(14, 'Floral Pink Maxi Dress', 'Elevate your summer wardrobe with this stunning multi-layered chiffon maxi dress, designed to turn heads wherever you go. Adorned with an eye-catching pink floral ', 100, 1290.00, 'dress-5.jpg', 3),
(15, 'Black Zip-Through Hoodie', 'Short, fitted zip-through hoodie in sweatshirt fabric made from a cotton blend with a soft brushed inside. Jersey-lined, drawstring hood, a zip down the front, gently dropped shoulders and long sleeves. ', 100, 1550.00, 'hoodie-2.jpg', 2),
(16, 'Gray Loose Fit Hoodie', 'Hoodie in midweight sweatshirt fabric made from a cotton blend with a soft brushed inside and a print motif. Double-layered, wrapover hood, dropped shoulders and long sleeves.', 100, 1159.00, 'hoodie-3.jpg', 2),
(17, 'Beige Boxy Fit Washed Hoodie', 'Boxy fit hoodie sweatshirt. Collar with adjustable hood and long sleeves. Front pouch pocket. Washed effect. Rib trim.', 100, 1999.00, 'hoodie-4.jpg', 2),
(18, 'Yellow Hoodie', 'Long-sleeved top in sweatshirt fabric made from a cotton blend with a hood, kangaroo pocket and ribbing at the cuffs and hem. Soft brushed inside.', 100, 1299.00, 'hoodie-5.jpg', 2),
(19, 'White Regular Shorts', '5-pocket shorts in rigid cotton denim. Straight leg and a regular fit from the waist to the hem with a comfortable, looser feel around the thigh. Regular waist with a zip fly and button.', 100, 1390.00, 'short-2.jpg', 5),
(20, 'White Low-Waisted Denim Shorts', '5-pocket shorts in sturdy cotton denim with a low waist and a zip fly and button.', 100, 990.00, 'short-3.jpg', 5),
(21, 'Gray Dense Jogger Shorts', 'Shorts with adjustable elastic drawstring waistband. Front pockets and back patch pocket.', 100, 1390.00, 'short-4.jpg', 5),
(22, 'Blue Striped Shorts', 'Mid-waist Bermuda shorts with 6 buttons detail. Featuring front pockets and false welt pockets at the back. Zip fly and inner button and hook.', 100, 1190.00, 'short-5.jpg', 5),
(23, 'Blue Linen Pants', 'Blue Wide-Leg, Linen-Blend, high-waist trousers made of a linen blend. Matching fabric tie belt.', 100, 890.00, 'pants-2.jpg', 4),
(24, 'Straight-Fit Jean Pants', 'High-waist and long length jeans with a five-pocket design with straight-leg fit.', 100, 1290.00, 'pants-3.jpg', 4),
(25, 'Gray Fly Seam Pants', 'Gray Fly Seam Front Crop Tapered Pants made from high-quality fabric that stretches and moves with you, these pants are perfect for all-day wear.', 100, 1490.00, 'pants-4.jpg', 4),
(26, 'Blue-Plaid Ankle Pants', 'Comfortable 2-way stretch fabric. Wrinkle-resistant for easy care. Comfortable elastic waistband looks great with a top tucked in. Sleek, slim tapered cut.', 100, 990.00, 'pants-5.jpg', 4),
(27, 'Dark Geen Printed T-Shirt', 'Relaxed-fit dark green T-shirt featuring a round neck, short sleeves and contrast prints on the front.', 100, 890.00, 't-shirt2.jpg', 1),
(28, 'White Contrast Printed T-Shirt', 'Relaxed-fit white T-shirt featuring a round neck, short sleeves and contrast prints on the front.', 100, 790.00, 't-shirt3.jpg', 1),
(29, 'Pink Stretch Slim T-Shirt', 'This crew-neck tee is cut to a slim silhouette, with plenty of stretch to ensure a comfortable, close fit.', 100, 1190.00, 't-shirt4.jpg', 1),
(30, 'White Slouchy T-shirt', 'A relaxed, almost \"slouchy\" style T-shirt with a loose, draped fit. Often featuring a wider neckline or dropped shoulders, it has a very effortless, cool vibe.', 100, 1290.00, 't-shirt5.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varbinary(500) NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=customer,2=admin,3=developer',
  `phoneNumber` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `firstName`, `lastName`, `email`, `password`, `role`, `phoneNumber`) VALUES
(1, 'Customer', 'Account', 'c@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '099999999'),
(2, 'Admin', 'Acc', 'a@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 2, '1234567891'),
(3, 'Dev', 'eloper', 'd@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 3, '0123456789'),
(4, 'John', 'Walker', 'john@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '0987678990'),
(5, 'Abby', 'Abigail', 'abby@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '0900990877'),
(6, 'Brittany', 'Brogan', 'brit@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '0879890453'),
(7, 'Calvin', 'Claudie', 'calvin@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '0987678987'),
(8, 'Dulcie', 'Dozier', 'dulcie@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '0989990989'),
(9, 'Ella', 'Eleanore', 'ella@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '0974647378'),
(10, 'Fred', 'Fitzhugh', 'fred@gmail.com', 0xf6aaf044606fa3f847c93baa7ce50aba, 1, '0909088789');

-- --------------------------------------------------------

--
-- Table structure for table `userAddress`
--

CREATE TABLE `userAddress` (
  `addressID` int(11) NOT NULL,
  `addressLine1` varchar(255) NOT NULL,
  `addressLine2` varchar(255) NOT NULL,
  `postcode` char(5) NOT NULL COMMENT 'must be 5 number long',
  `city` varchar(20) NOT NULL,
  `phoneNumber` varchar(13) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1 COMMENT '0=inactive,1=active',
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userAddress`
--

INSERT INTO `userAddress` (`addressID`, `addressLine1`, `addressLine2`, `postcode`, `city`, `phoneNumber`, `isActive`, `userID`) VALUES
(2, 'Hello Kitty', 'Sanrio, Japan', '12212', 'Bangkok', '1234567890', 0, 2),
(3, '123/4 Soi Sukhumvit 21', 'Khlong Toei Nuea, Watthana', '10110', 'Bangkok', '1234567891', 1, 2),
(4, '56/12 Moo 3', 'Taling Chan', '30000', 'Nakhon Ratchasima', '1234567891', 1, 2),
(5, '89/15 Soi 18, Ratchadapisek Road', 'Dindaeng', '10400', 'Bangkok', '0123456789', 1, 3),
(6, '22/9 Moo 7', 'Ban Phaeo', '74120', 'Samut Sakhon', '099999999', 1, 1),
(7, '57/3 Soi Phahonyothin 32', 'Chatuchak', '10900', 'Bangkok', '0900990877', 1, 5),
(8, '48/5 Moo 9, Chiang Mai Road', 'Hang Dong', '50230', 'Chiang Mai', '0900990877', 1, 5),
(9, '110/8 Soi Phetchaburi 12', 'Ratchathewi', '10400', 'Bangkok', '0879890453', 1, 6),
(10, '34/11 Moo 2, Kaeseamsuk', 'Tha Mai', '22000', 'Chanthaburi', '0987678987', 1, 7),
(11, '75/8 Soi Charoen Krung 23', 'Bang Rak', '10500', 'Bangkok', '0987678987', 1, 7),
(12, '21/6 Moo 4', 'Mae Rim', '50180', 'Chiang Mai ', '0987678987', 1, 7),
(13, '60/10 Soi Bangna-Trad 14', 'Bang Na', '10260', 'Bangkok', '0989990989', 1, 8),
(14, '72/13 Soi Rama 2', 'Samae Dam, Bang Khun Thian', '10150', 'Bangkok', '0909088789', 1, 10),
(15, '19/7 Moo 6, Phitsanulok Road', 'Ao Nang', '65000', 'Phitsanulok', '0909088789', 1, 10),
(16, '103/20 Soi Pradit Manutham 12', 'Lat Phrao', '10230', 'Bangkok', '0974647378', 1, 9),
(17, '81/2 Soi Phaya Thai 24', 'Phaya Thai', '10400', 'Bangkok', '0974647378', 1, 9),
(18, '124/7 Soi Nakhon In', 'Phutthamonthon', '73170', 'Nakhon Pathom', '0974647378', 1, 9);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`userID`,`productID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `devChat`
--
ALTER TABLE `devChat`
  ADD PRIMARY KEY (`devChatID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `orderDetails`
--
ALTER TABLE `orderDetails`
  ADD PRIMARY KEY (`orderID`),
  ADD KEY `addressID` (`AddressID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `orderItems`
--
ALTER TABLE `orderItems`
  ADD PRIMARY KEY (`orderID`,`productID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `orderStatusHistory`
--
ALTER TABLE `orderStatusHistory`
  ADD PRIMARY KEY (`orderStatusID`),
  ADD KEY `orderID` (`orderID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`paymentID`),
  ADD KEY `orderID` (`orderID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `userAddress`
--
ALTER TABLE `userAddress`
  ADD PRIMARY KEY (`addressID`),
  ADD KEY `userID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `categoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `devChat`
--
ALTER TABLE `devChat`
  MODIFY `devChatID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orderDetails`
--
ALTER TABLE `orderDetails`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orderStatusHistory`
--
ALTER TABLE `orderStatusHistory`
  MODIFY `orderStatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `paymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `userAddress`
--
ALTER TABLE `userAddress`
  MODIFY `addressID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `devChat`
--
ALTER TABLE `devChat`
  ADD CONSTRAINT `devchat_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `orderDetails`
--
ALTER TABLE `orderDetails`
  ADD CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`AddressID`) REFERENCES `userAddress` (`addressID`);

--
-- Constraints for table `orderItems`
--
ALTER TABLE `orderItems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`orderID`) REFERENCES `orderDetails` (`orderID`);

--
-- Constraints for table `orderStatusHistory`
--
ALTER TABLE `orderStatusHistory`
  ADD CONSTRAINT `orderstatushistory_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `orderDetails` (`orderID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `orderDetails` (`orderID`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userAddress`
--
ALTER TABLE `userAddress`
  ADD CONSTRAINT `useraddress_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
