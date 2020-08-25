const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook')
const mongoose = require('mongoose');
const User = require('../models/User');
const passport = require('passport');





module.exports = {
// google strategy
    google:((passport)=>{
        passport.use(new GoogleStrategy({
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:'/auth/google/callback'
        },
        async(accessToken , refreshToken , profile , cb)=>{
            console.log(profile)
            const newUser = {
                googleId:profile.id,
                displayName:profile.displayName,
                firstName:profile.name.givenName,
                lastName:profile.name.familyName,
                image:profile.photos[0].value
            }
            try{
                let user = await User.findOne({googleId:profile.id})
                if(user){
                    cb(null,user)
                }
                else{
                    user = await User.create(newUser);
                    cb (null,user)
                }
            }
            catch(err){
                console.log(err)
            }
        }
        ))

    passport.serializeUser((user,cb)=>{
        cb(null,user.id)
    })
    passport.deserializeUser((id,cb)=>{
        User.findById(id,(err,user)=>{
            cb(err,user)
        })
    })
    
    }),
    //facebook strategy
    facebook:((passport)=>{
        passport.use(new FacebookStrategy({
            clientID:process.env.FACEBOOK_CLIENT_ID,
            clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL:'/auth/facebook/callback'
        
            
        },
        (accessToken,refreshToken,profile,cb)=>{
            console.log(profile)
            return cb(null,profile)
        }
        
        
        ))
        passport.serializeUser((user,cb)=>{
            cb(null,user.id)
        })
        passport.deserializeUser((id,cb)=>{
            User.findById(id,(err,user)=>{
                cb(err,user)
            })
        })
    })
} 