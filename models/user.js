const mongoose = require('mongoose');
const crypto = require('crypto');

//User credentials and info for a user profile. 
//to generate unique strings
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, //to remove spaces 
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 32 //unique
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String,
    role: {// user 
        type: Number,
        default: 0
    }, 
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true});

// virtual field.. to encypt the pass.
userSchema.virtual('password') // sending pass from client side
.set(function(password) { 
    this._password = password;
    this.salt = uuidv1(); // to hash the pass
    this.hashed_password = this.encryptPassword(password) // not made yet
})
.get(function(){
    return this._password;
});

userSchema.methods = {
    // this is for signin ! if hashed password and the current pass match -> authenticated.
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    // function in the user schema to hash the pass comming from the user.
    // in plain text form to hash form.
    encryptPassword: function(password) {
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        }
        catch(err) {
            return '';
        }
    }
}

module.exports=mongoose.model("User", userSchema);