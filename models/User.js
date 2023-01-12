import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        validate : {
            validator : function(email){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message : props => `${props.value} is not a valid  email!`
        }
    },
    password : {
        type : String,
        validate : {
            validator : function(pw){
                return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(pw);

            },
            message : props => `Password shuld be Minimum eight characters, at least one letter, one number and one special character: `
        },
        required : true
    },
    accountStatus : {
        type : String,
        enum : ["PENDING", "ACTIVE", "REJECTED","REVIEWING"],
        default : "PENDING",
        required : true
        
    }
   
})
 const User = model('Users', userSchema);

 export default User
