import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();



// This is the entry point for the backend server of the electronics store application.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
