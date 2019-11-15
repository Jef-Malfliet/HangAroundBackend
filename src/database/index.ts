import mongoose from 'mongoose';

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGOOSE_URI, {
      useNewUrlParser: true,
      dbName: process.env.MONGOOSE_NAME,
      config: { autoIndex: true },
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    return connection;
  } catch (e) {
    console.log(e);
  }
};

export default connect;
