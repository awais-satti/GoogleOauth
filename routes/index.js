const expres = require('express')
const router = expres.Router();

router.get('/',(req,res)=>{
    res.render('login',{
        layout:'login'
    })
})



router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})















module.exports = router