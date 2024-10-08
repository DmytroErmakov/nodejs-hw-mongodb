import mongoose from 'mongoose';

let isConnected; // Змінна для зберігання статусу з’єднання

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }
  try {
    await mongoose.connect('mongodb://localhost:27017/yourdbname', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true; // Оновлюємо статус з’єднання
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Завершити процес, якщо з’єднання не вдалося
  }
};

export default connectDB;
