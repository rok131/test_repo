# Rocks Service Prototype

This repository contains a small prototype for a group subscription matching service called **Rocks**. It uses Node.js with Express to implement a few core features.  The code is organized under the `src/` directory using ES modules:

- User registration and login
- Creating a party for a subscription service
- Listing parties and joining an existing party

The server stores data in memory and is intended for demonstration purposes only.
Additional sample features include:

- Updating a user's profile
- Simple wallet deposit handling
- Tracking party membership history

## Requirements

- Node.js 16 or later

## Installation

```bash
npm install
```

## Running the server

```bash
npm start
```

The server listens on `http://localhost:3000`.

## Running tests

```bash
npm test
```

The tests perform a simple registration, login, party creation and join flow to verify that the endpoints work as expected.
