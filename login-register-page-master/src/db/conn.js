const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/employeeRegisteration',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(function() {
    console.log('Connected!');
}).catch(function(err){
    console.log("no connection");
  })