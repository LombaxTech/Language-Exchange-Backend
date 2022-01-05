<!-- Banner -->
<div align="middle">
    <img src="images/banner.png" />
    <br>
    <br>
    <p>
        This is the backend repository for <a href="https://rk-languages.netlify.app/">RKLanguages
        </a>. (For the frontend repository, <a href="https://github.com/LombaxTech/Language-Exchange-Frontend"> click here</a>)
    </p>
    <br>

</div>

## Getting Started

Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

1. Clone the repository

   ```
   git clone https://github.com/LombaxTech/Language-Exchange-Backend.git
   ```

2. Install your dependencies

   ```
   npm install
   ```

3. Start your app

   ```
   npm start
   ```

## Directory Structure

- config
  - default.json - contains mongodb link + port details
- src
  - app.js - code for sockets
  - models - contains files for database models
  - middleware
    - index.js - contains routes
    - controller.js - contains logic for routes

## Built With

- [Node.js](https://nodejs.org/en/)
- [Feathers.js](https://feathersjs.com/)
- [Mongoose.js](https://mongoosejs.com/)
- [Socket.io](https://socket.io/)
