const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.error('Please make sure your .env file contains MONGODB_URI');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(mongoURI, {
      // These options are no longer needed in Mongoose 6+, but included for clarity
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Provide helpful error messages
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('💡 This looks like an authentication error. Please check:');
      console.error('   - Your MongoDB username and password in the connection string');
      console.error('   - Your database user permissions');
    } else if (error.name === 'MongoNetworkError') {
      console.error('💡 This looks like a network error. Please check:');
      console.error('   - Your internet connection');
      console.error('   - MongoDB Atlas cluster availability');
      console.error('   - IP whitelist settings in MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Gracefully closing MongoDB connection...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Gracefully closing MongoDB connection...');
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB
};
