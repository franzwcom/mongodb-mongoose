/*
 *	user model
 *	--------------------------------------------------------
 *	Source: http://mongoosejs.com/docs/index.html & mean machine
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// pass hashing
var bcrypt = require('bcrypt-nodejs')

/*-----------------------------------------------------------
	user schema
-----------------------------------------------------------*/
var UserSchema = new Schema({
    name: String,
    // username
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    // password
    password: {
        type: String,
        required: true,
        select: false
    }
});


UserSchema.pre('save', function() {
    var user = this;
    if (!user.isModified('password')) return next();

    /*
     * making the hash
     */
                      // holy shiet !!!!!! here  !!!!!!!
    bcrypt.hash(user.password, null, null,  function(err, hash) {
        if (err) return next(err);
        // hashing this
        user.password = hash;
        //
        next();
    }); // end bcrypt
});

//  compare the hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

// exporting ...

module.exports = mongoose.model('User', UserSchema);

