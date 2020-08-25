const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectdb = require('./config/db')
const exphbs = require('express-handlebars')    
const app = express();
const path = require('path')
const passport = require('passport')
const sessions = require('express-session')
const cors  = require('cors');

app.use(cors());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// Load congig
dotenv.config({path:'./config/config.env'})
//passport config
const passportConfig= require('./config/passport');
passportConfig.google(passport);
passportConfig.facebook(passport);

connectdb();

//sessions
app.use(sessions({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false
}))
//passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname,'public')))
app.engine('.hbs', exphbs({defaultLayout: 'main',  extname: '.hbs'}));
app.set('view engine', '.hbs');
//routes

app.use('/auth',require('./routes/auth'))
app.use('/',require('./routes/index'))






const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`))