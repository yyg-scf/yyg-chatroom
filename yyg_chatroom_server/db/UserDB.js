const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yyg_chatroom');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const userSchema = mongoose.Schema({
  userId: String,
  userName: String,
  password: String,
  userImg: String
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users