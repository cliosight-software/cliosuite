const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const passwordHash = require('password-hash');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.urlencoded({extended:false}));

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use('/static', express.static('public'))

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2','key3','key4'],
    maxAge:  3600 * 1000 // 1 hr.
}));

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('login-register');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('home');
    }
    next();
}

app.get('/', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT * FROM `cliosuite_registration` WHERE `email`=?",[req.session.email])
    .then(([rows]) => {
        res.render('home',{
        	first_name:rows[0].first_name,
        	email:rows[0].email,
        	userID:rows[0].user_id
        });
    });
    
});

app.get('/home', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT * FROM `cliosuite_registration` WHERE `email`=?",[req.session.email])
    .then(([rows]) => {
        res.render('home',{
        	first_name:rows[0].first_name,
        	email:rows[0].email,
        	userID:rows[0].user_id
        });
    });
    
});

function getTwoDigitRandom(){
	   var min = 11;
	   var max = 99;
	   let r = Math.random()* (max - min) + min; 
	   return Math.floor(r);
}


app.post('/register', ifLoggedin, 
[
    body('user_email','Enter a valid email address.').trim().isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `cliosuite_registration` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This email is already in use. Please login to check status.');
            }
            return true;
        });
    }),
    body('user_name','Your First Name is empty.').trim().not().isEmpty(),
    body('user_last_name','Your Last Name is empty.').trim().not().isEmpty(),
    body('user_pass','The Password must be of minimum 6 and maximum 10 characters in length').trim().isLength({ min: 6, max:20 }),
    body('user_mobile','Please mention your mobile number only in digits, without country code or \"-\"').trim().isNumeric(),
    body('user_mobile','Please mention a valid 10 digit mobile number.').trim().isLength({ min: 10, max:10}),
    body('user_mobile').custom((value) => {
        return dbConnection.execute('SELECT `mobile` FROM `cliosuite_registration` WHERE `mobile`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This mobile number is already in use. Please login to check status.');
            }
            return true;
        });
    }),
    body('user_zipcode','Please mention your numeric location zip code.').trim().isNumeric(),
],
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name,user_last_name,user_email,user_pass,user_country_std,user_mobile,user_business_name,user_business_identifier,user_business_address,user_zipcode,user_country_code,user_type, user_ticket_size} = req.body;
    if(validation_result.isEmpty()){
    	console.log(user_name,user_last_name,user_email,user_pass,user_country_std,user_mobile,user_business_name,user_business_identifier,user_business_address,user_zipcode,user_country_code,user_type, user_ticket_size);
        // password encryption (using password-hash)
    	const hash_pass = passwordHash.generate(user_pass);
    	try{
    		var user_id = user_name+getTwoDigitRandom();
            dbConnection.execute("INSERT INTO `cliosuite_registration`(`user_id`,`first_name`, `last_name`, `email`,`password`, `mobile_std_code`,`mobile`,`legal_business_name`, `business_identifier`, `legal_business_address`, `zip_code`,`country_code`, `user_type`, `average_item_price`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[user_id,user_name.trim(),user_last_name.trim(),user_email.trim(),hash_pass.trim(),user_country_std,user_mobile.trim(),user_business_name.trim(),user_business_identifier.trim(),user_business_address.trim(),user_zipcode.trim(),user_country_code,user_type,user_ticket_size.trim()])
            .then(result => {
                res.send(`<html>
                		<meta charset="UTF-8">
                		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=320, height=device-height, target-densitydpi=medium-dpi, shrink-to-fit=no">
                		<meta http-equiv="X-UA-Compatible" content="ie=edge">
                		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
                		<script type="text/javascript" src="//code.jquery.com/jquery-2.1.1.min.js"></script>
                		<script src="https://cdn.jsdelivr.net/momentjs/2.14.1/moment.min.js"></script>
                		<script src="https://smtpjs.com/v3/smtp.js"></script>  
                		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.min.js"></script>
                		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" media="screen">
                		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
                		integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
                		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
                		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>

<title>Cliosuite for MSME - Signup Success</title>

                		</head>
                		<style>
.form-large{
		    font-size: 30px;
		    font-family:optima;
		}
	
		.form-large .control-label{
		    padding-top: 20px;
		    padding-bottom: 20px;
		    line-height: normal;
		}
	
		.form-large input, .form-large  button, .form-large select{
		    font-size: 30px;
		    padding: 15px;
		    height: 65px;
		    line-height: normal;
		}
		
		.datalist, .select {
			font-size: 30px;
			height: auto;
	    	line-height: normal;
			background-color: white;
		}
		

div{
	color:grey;
	font-family:optima;
}
p{
	color:grey;
	font-family:optima;
}

  .footer_clio {
    
    left: 0;
    bottom: 0;
    width: 100%;
    float: bottom;
    text-align: center;
  }
  </style>
                		<body style=\"background-color: white; background-image: url('/static/bg1.jpg');\">
                		<br/>
                		<div class=\"container\" style=\"display: flex; justify-content: center;\" >
                		<a href="/"><img src="/static/newlogo.jpg" style="width:330px; height:100px; border-color:yellow; border-width:2px;"/></a>
                		</div>
                		<div class="container">
                		<div class="row justify-content-center">
                		<div class="col bg-default bg-default py-1" style="display: flex; justify-content: center; margin-bottom:0px;margin-left:0px;">
                		<h4><b>The One-Stop Solution for Micro, Small & Mid-Sized Enterprises</b></h4>
                		</div>
                		</div>
                		</div>
                		<div class=\"container p-5\">
                		<div class=\"card\">
                		<div class=\"card-body\">
                		<div class=\"row\" style=\"display: flex; justify-content: center; margin-top:0px;padding:30px;\">
                		<div class=\"col-lg-12 bg-white py-4\">
                		<h3>Thank you for signing up. You can now <a href="/"><u>LOGIN</u></a> into your tour account.<br/>Please note that this is only a temporary one, your official Cliosuite account credentials or source code will be shared with you at a later time. <br/><br/>Thank You!<br/>Team Cliosight.</h3>
                		</div></div></div></div>
                		<br/><br/>
                		<div class="row" style="display: flex; justify-content: center; ">
                		<div class="col-md-6" >
                		<button  onclick="window.open('https://cliosight.com/#3191a9c5-da31-45fd-8916-8a3d0bb06317')" style=" width:100%; height:80px; border-color: #2295db; border-width:3px;background-color:white;" class="btn btn-primary btn-lg btn-block btn-huge"><font color="#2295db" size="6"><b>WRITE TO US</b></font></button>
                		</div>
                		</div>
                		
                		</div>
                		    
    <div class="footer_clio row" id="footer_clio" name="footer_clio" style="display: flex; justify-content: center; background-color: #D1F2EB;margin-left:0px;margin-right:0px;padding-top:20px;padding-bottom:20px;">

<div class="col-md-3">
<h3>Social Media</h3>
<h4><a href="http://cliosight.com">Company Website</a></h4>
<h4><a href="https://www.linkedin.com/company/14571342">Linkedin</a></h4>

</div>
<div class="col-md-3">
<h3>Learn about the product</h3>
<h4><a href="/documentation">Documentation</a></h4>
<h4><a href="https://cliosight.com/cliosuite-articles-1">Cliosuite Articles</a></h4>
</div>
<div class="col-md-4">
<h3>Contact Us</h3>
<h4>Mobile: +91-6361789254</h4>
<h4><a>cliosight@gmail.com</a></h4>
<h4>Address: Bangalore-560076, Karnataka, India</h4>
</div>
</div>
<br/>

</div>      
</div>
  
  <div class="footer_clio" id="footer_clio" name="footer_clio" style="display: flex; justify-content: center; ">
    <button type="button" class="btn btn-link" onclick="window.open('/about')"><font size="4">About</font></button>
    <button type="button" class="btn btn-link" onclick="window.open('/policies')"><font size="4"> Policies & Terms </font></button>
    <br/>
  </div>
  
  <div class="container" style="display: flex; justify-content: center; ">
      <p><font size="4" color="grey">Copyright © 2020 Cliosight - All Rights Reserved.</font></p>
    </div>  
  <br/>
</body>
</html>`);
            
            }).catch(err => {
                if (err) throw err;
            });
        }catch(err){
            if (err) throw err;
        }
        
    } else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        res.render('login-register',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});


app.post('/login', ifLoggedin, [
    body('user_email').trim().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `cliosuite_registration` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
                
            }
            return Promise.reject('Invalid Email Address!');
            
        });
    }),
    body('user_pass','Password is Empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if(validation_result.isEmpty()){
        
        dbConnection.execute("SELECT * FROM `cliosuite_registration` WHERE `email`=?",[user_email])
        .then(([rows]) => {
        	var compare_result = passwordHash.verify(user_pass, rows[0].password);
        	try{
                if(compare_result === true){
                    req.session.isLoggedIn = true;
                    req.session.userID = rows[0].user_id;
                    req.session.first_name = rows[0].first_name;
                    req.session.email = rows[0].email;
                    res.redirect('/');
                }
                else{
                    res.render('login-register',{
                        login_errors:['Wrong Password!']
                    });
                }
            }catch(err){
                if (err) throw err;
            }

        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        res.render('login-register',{
            login_errors:allErrors
        });
    }
});

app.post('/survey', ifNotLoggedin, 
		
		[
			body('email','Enter a valid email address.').trim().isEmail().custom((value) => {
			return dbConnection.execute('SELECT `email` FROM `cliosuite_registration` WHERE `email`=?', [value])
			.then(([rows]) => {
            if(rows.length < 1){
                return Promise.reject('The email address is not registered with us.');
            }
            	return true;
			});
			}),
    		body('email').trim().custom((value) => {
    			return dbConnection.execute('SELECT `user_id`,`email` FROM `survey_response` WHERE `email`=?', [value])
    			.then(([rows]) => {
    				if(rows.length == 1){
    					return Promise.reject('You have already submitted this survey. Please submit a query if you wish to change any of your answers.');
    				}
    				return true;
    			});
    }),
    body('other_module','Please mention the other module names in upto 100 characters.').trim().isLength({ max:100 }),
    body('technologies','Please mention the tools and technologies that you use at work in upto 100 characters.').trim().isLength({ max:100 }),
    body('other_tech_stack','Please mention the other UI or backend technologies that you intend to use in upto 100 characters.').trim().isLength({ max:100 }),
    body('other_pricing','Please mention an alternate price with currency in upto 100 characters.').trim().isLength({ max:100 }),
    body('additional_feedback','Your comments and feedback must be of upto 200 characters').trim().isLength({max:200 }),
    ],
    (req,res,next) => {

    const validation_result = validationResult(req);
    const {email,profession,gender,module,other_module,technologies,js,other_tech_stack,contribute,devreq,comm,pricing,other_pricing,additional_feedback} = req.body;
    if(validation_result.isEmpty()){
    		// Just a demo of fraud check -- inputs can also be checked apart from this for deliberate junk characters
    		var email1 = String([email]);
    		var email2 = String([req.session.email]);
    		if(email1!=email2){
				dbConnection.execute("INSERT INTO `fraud_attempt` (`real_email`,`fake_email`) VALUES (?,?)",[email2,email1]);
				let msg = "The email id you have entered is not the one used for signing up.";
	        	res.render('surveyerr',{err_msg:msg});
    		}
    		//Conditional validation in a blunt way
    		var profession_ = String([profession]);
    		var errMessage = "";
    		if(profession_ === "os_dev" || profession_ === "prof_dev" || profession_ === "prof_dev_ue" 
    			|| profession_ === "freelancer" || profession_ === "uiux" || profession === "student"){
    			var tech = String([technologies]);
    			var JS = String([js]);
    			var contib_other_tech = String([contribute]);
    			var aicv = String([devreq]);
    			if(tech.trim() === ""||JS === ""||contib_other_tech === ""||aicv === "")
    				errMessage = "Kindly choose all your answers for a technical profile.";
    			
    			} else if(profession_ === "business" || profession_ === "entrepreneur"){
    			var commercial = String([comm]);
    			var plans = String([pricing]);
    			if(commercial === ""||plans === "")
    				errMessage = "Kindly choose all your answers for a business profile viz. Entrepreneur or a Business Professional.";
    		  } 
    			
    		  if(errMessage!=""){
    				res.render('surveyerr',{err_msg:errMessage});
    			}
    			else {
    			console.log("Parameters: "+email,profession,gender,module,other_module,technologies,js,other_tech_stack,contribute,devreq,comm,pricing,other_pricing,additional_feedback);
    			dbConnection.execute("INSERT INTO `survey_response` (`email`,`profession`,`gender`,`module`,`other_module`,`technologies`,`js`,`other_tech`,`contribute`,`devreq`,`comm`,`pricing`,`other_pricing`,`additional_feedback`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            		[email.trim(),profession,gender,module,other_module.trim(),technologies,js,other_tech_stack,
            			contribute,devreq,comm,pricing,other_pricing,additional_feedback])
            			.then(result => {
            				console.log("User Id:"+req.session.userID+" Session email: "+req.session.email);
            					dbConnection.execute("UPDATE `survey_response` SET `user_id`=?",[req.session.userID]," WHERE `email`=?",[req.session.email]);
            					res.render('surveyack',{first_name:req.session.first_name});
                
            }).catch(err => {
                if (err) throw err;
            });
        }
        
    } else {
        let allErrors = validation_result.errors.map((error) => {
        	res.render('surveyerr',{err_msg:error.msg});
            return error.msg;
        });
        res.render('home',{
            survey_error:allErrors,
            old_data:req.body,
            first_name:req.session.first_name,
            email:req.session.email,
            userID:req.session.userID
        });
       }
    
    });

app.get('/surveyack', ifNotLoggedin, (req, res)=>{
	res.render('surveyack', {first_name:req.session.first_name})
});

app.get('/surveyerr', ifNotLoggedin, (req, res)=>{
	res.render('surveyerr')
});

app.get('/prodsvc', (req, res)=>{ 
	
	res.render('prodsvc'); 
	
});

app.get('/pripromos', (req, res)=>{ 
	
	res.render('pripromos'); 
	
});

app.get('/websupport', (req, res)=>{ 
	
	res.render('websupport'); 
	
});

app.get('/cliobuilder', (req, res)=>{ 
	
	res.render('cliobuilder'); 
	
});

app.get('/invlog', (req, res)=>{ 
	
	res.render('invlog'); 
	
});

app.get('/marketing', (req, res)=>{ 
	
	res.render('marketing'); 
	
});

app.get('/reports', (req, res)=>{ 
	
	res.render('reports'); 
	
});

app.get('/stores', (req, res)=>{ 
	
	res.render('stores'); 
	
});

app.get('/files', (req, res)=>{ 
	
	res.render('files'); 
	
});

app.get('/documentation', (req, res)=>{ 
	
	res.render('documentation'); 
	
});

app.get('/about', (req, res)=>{ 
	
	res.render('about'); 
	
});

app.get('/policies', (req, res)=>{ 
	
	res.render('policies'); 
	
});


app.get('/logout',(req,res)=>{
    req.session = null;
    res.redirect('/');
});


app.use('/', (req,res) => {
    res.status(404).send('<h1>404 Page Not Found!</h1>');
});

app.listen(8080, () => console.log("Server is Running on Port:8080"));//for local testing

