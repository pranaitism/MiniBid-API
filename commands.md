Project init
npm init

Install Dependencies
npm install express nodemon mongoose body-parser dotenv joi bcryptjs jsonwebtoken morgan moment @joi/date joi-oid

Create MongoDb Atlas instance and update .env file User-Name and DB-NAME with your details.
DB_CONNECTOR=mongodb+srv://<User-Name>.sifml.mongodb.net/<DB-NAME>?retryWrites=true&w=majority

In same .env file add TOKEN_SECRET= your chars for generating Jason web token

Start Server
npm run 
