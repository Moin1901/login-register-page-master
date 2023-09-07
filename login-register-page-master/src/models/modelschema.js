const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const employeeSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true

    } ,
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
  });
employeeSchema.methods.generateAuthToken=async function(){
    try{
            const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
            this.tokens=this.tokens.concat({token:token});
                await this.save();
                return token; 
            
        
        
    }
    catch(error){
        res.send("the error part "+error);
        console.log("the error part "+error);

    }
}

  employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,saltRounds);
        this.confirmpassword=await bcrypt.hash(this.confirmpassword,saltRounds);
    }
    next();
  })

  const Register = mongoose.model('Register', employeeSchema);

  
  module.exports=Register;