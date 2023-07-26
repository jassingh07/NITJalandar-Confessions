# Confessions Web App for NIT Jalandhar

Welcome to the Confessions Web App, a platform designed exclusively for the students of NIT Jalandhar to share their college confessions. This README file provides essential information to help you understand, use, and contribute to this open-source project.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Authentication](#authentication)
- [Database](#database)
- [Contributing](#contributing)

## Introduction

The Confessions Web App is a platform where current students of NIT Jalandhar can anonymously share their confessions from their college experiences. Whether it's a funny incident, a heartfelt moment, or a life lesson learned, this app allows users to express themselves without revealing their identities.

## Features

- **Anonymous Confessions:** Users can submit their confessions without revealing their identity.
- **View Confessions:** All confessions are visible to anyone with an account on the platform.
- **Secure Authentication:** Two options for authentication are available:
  - Registered Username and Password: Users can create an account with a unique username and password.
  - Google LDAP Credentials: Users can log in using their NIT Jalandhar email accounts with the nit.edu domain name.
- **User-friendly Interface:** The web app provides an intuitive and easy-to-navigate interface for a seamless user experience.

## Authentication

To maintain the anonymity of users while ensuring security, the Confessions Web App offers two authentication methods:

1. **Registered Username and Password:**
   - Users can sign up with a unique username and password during their initial visit to the platform.
   - Subsequent logins require the user to enter their registered credentials to access their account and submit confessions.

2. **Google LDAP Credentials with nitj.ac.in Domain:**
   - Users can also choose to authenticate using their NIT Jalandhar email accounts.
   - The app leverages the Google LDAP service to verify the user's credentials while ensuring secure access with the nitj.ac.in domain.

## Database

The Confessions Web App utilizes MongoDB to store and manage the confessions submitted by users. MongoDB is a NoSQL database that allows for flexible and scalable data storage. 
Each confession is associated with a unique identifier in the database, ensuring efficient retrieval and updates.

## Contributing

We welcome contributions from anyone interested in improving the Confessions Web App. If you'd like to contribute, please follow these steps:

1. Fork the repository to your GitHub account.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your branch on GitHub.
5. Create a pull request from your branch to the main repository's `main` branch.
6. Your pull request will be reviewed, and once approved, your changes will be merged into the main repository.

Please ensure that your contributions align with the project's coding standards and follow the best practices.

---

Thank you for your interest in the Confessions Web App project. We hope this README file provides a clear understanding of the app's purpose, features, and how to contribute. If you have any questions or suggestions, feel free to reach out to the project maintainers.

Happy confessing!
