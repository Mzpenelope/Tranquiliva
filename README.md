# Tranquiliva

![Tranquiliva Thumbnail]
A mental health-focused web application, where patients can purchase therapy sessions offered by therapists. Scalability to update their session details and perform a live chat session with their patients when they purchase a session in an e-commerce-based transaction process.

_Check out the live project [_here_](https://)._

## Table of Contents
* [Acknowledgements](#acknowledgements)
* [Technologies](#technologies)
* [Usage](#usage)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Variables Setup](#environment-variables-setup)
  * [Run The App](#run-the-app)
* [Features](#features)
  * [User Account Management](#user-account-management)
  * [Admin Dashboard](#admin-dashboard)
  * [Therapist Shopping Cart System](#therapist-shopping-cart-system)
  * [Live Chat Session](#live-chat-session)

## Acknowledgements

* Phillipa Aidoo [GitHub](https://github.com/Mzpenelope) [LinkedIn](https://www.linkedin.com/in/)
* Priscilla [GitHub](https://github.com/) [LinkedIn](https://www.linkedin.com/in/)
* Daniel [GitHub](https://github.com/) [LinkedIn](https://www.linkedin.com/in/)
* Hanson [GitHub](https://github.com/) [LinkedIn](https://www.linkedin.com/in/)

## Technologies

* HTML5
* CSS3
* Ajax
* JavaScript
* jQuery `v3.6.0`
* Node.js
* Express `v4.18.1`
* Express-Session `v1.17.2`
* MongoDB / Mongoose `v6.3.3`
* Multer `v1.4.4`
* Nodemailer `v6.7.5`
* Nodemon `v2.0.16`
* Socket.IO `v4.5.1`

## Usage

<details>
  <summary>Prerequisites</summary>

### Prerequisites

* [VSCode](https://code.visualstudio.com/download/)
* [Git](https://git-scm.com/downloads/)
* [Node.js](https://nodejs.org/en/download/)

</details>

<details>
  <summary>Installation</summary>

### Installation

1. Install the latest npm package version.

  ```sh
  npm install npm@latest -g
  ```

2. Clone the repository to your local machine.

  ```sh
  git clone
  ```

3. Installing required dependencies requires Node and npm.

  ```sh
  npm install
  ```

</details>

### Run The App

Running the application locally or in production is straightforward since both the frontend and backend are integrated into a single Node.js application running on port 8000.

Execute `npm start` to run locally in development mode or production mode.

</details>

## Features

### User Account Management

Our user account management system allows users to create and manage their accounts securely with ease. Whether they are therapists or patients, users have control over their profile information.

* __Account Creation__: Users can create therapist or patient accounts. Therapists are required to enter additional information regarding their session cost and professional experience.
* __Account Editing__: Users can edit their profile information, including profile picture, name, email, and phone number.
* __Account Deletion__: Users have the option to delete their accounts.

### Admin Dashboard

Our Admin Dashboard provides administrators with comprehensive tools to manage all users registered on the application. This feature ensures that administrators can maintain control over the platform's user base and perform various administrative tasks efficiently.

* __User Management__: View all users in a table format on the Admin Dashboard page. Administrators can also edit patient and therapist information, create new users including administrators, and delete user accounts if necessary.
* __Search and Filter__: Search users by keywords and filter the table accordingly.
* __Sorting Table__: Sort the user table by clicking on headings such as email or username in ascending or descending order.

### Therapist Shopping Cart System

Our application features a therapist shopping cart system, allowing users to browse and "purchase" live chat sessions with therapists. Although a payment integration system is not yet implemented, patients can simulate the process of adding therapists to their cart and checking out.

* __Therapist Listings__: Any user can view a list of available therapists for live chat sessions.
* __Shopping Cart__: Registered patients can add or remove therapists to their shopping cart and proceed to the Checkout page. The Checkout cart page also displays the total price including tax for the cart items.
* __Invoice Generation__: Patients can print an invoice PDF of their order from the Checkout page.
* __Order Confirmation__: After confirming their cart and checking out, patients are navigated to a Thank You page and receive an email confirmation. They can start a live chat session with the ordered therapist immediately.
* __Pricing Plans__: 4 different pricing plans are available for therapist sessions: Trial, 1 Month, 3 Months, and 1 Year (mocked up to reasonable timeframes in minutes).

### Live Chat Session

We enable real-time communication between therapists and patients using Socket.io. This feature allows for seamless live chat sessions, enhancing the user experience.

* __Real-Time Communication__: Bi-directional private communication for live therapist chat sessions.
* __Contact Information__: Both patient and therapist can access each other’s phone numbers during the live chat session for private communication via text or phone call.
* __Session Timer__: Display of remaining session time in real-time, with the chat ending automatically when time expires.

