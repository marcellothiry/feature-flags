import mongoose from 'mongoose';

export const connectToDB = async () => {
  const uri = 'mongodb://fflags-user:1234@localhost:27017/fflags';
  const options = {
    directConnection: true,
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };
  await mongoose.connect(uri, options);
  console.log('Connected to Mongo');
};
