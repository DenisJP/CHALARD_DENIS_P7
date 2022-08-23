# API
The current API use Express as an HTTP server on top of NodeJs   
For DATABASE the API use MongoDB Atlas and the library Mongoose

-----------
## routes

**user.route.js:** redirect user related api call to the user controller  

| routes           	| method 	| data required                    	| function    	|
|------------------	|--------	|----------------------------------	|-------------	|
| /user/addone     	| POST   	| req.body.username/email/password 	| addone()    	|
| /user/signin     	| POST   	| req.body.email/password          	| signin()    	|
| /user            	| GET    	|                                  	| getall()    	|
| /user/:id        	| GET    	| req.params.id                    	| getone()    	|
| /user/:id 	    | DELETE 	| req.params.id                    	| deleteone() 	|
| /user/:id        	| PUT    	| req.params.id                    	| updateone() 	|

**post.route.js:** redirect post related api call to the post controller  

| routes            	| method 	| data required                    	| function          	|
|------------------	    |--------	|----------------------------------	|-------------      	|
| /post/addone        	| POST   	| req.body.content/userId       	| addone()           	|
| /post               	| GET    	|                                  	| getall()          	|
| /post/:id           	| GET    	| req.params.id                    	| getone()          	|
| /post/:id 	        | DELETE 	| req.params.id                    	| deleteone()       	|
| /post/:id         	| PUT    	| req.params.id                    	| updateone() 	        |
| /post/:id/voteone   	| PUT    	| req.params.id, req.body.voteType  | voteone() 	        |

-----------
## controllers

**user.controller.js:** manage user data with CRUD function  
**post.controller.js:** manage post data with CRUD function


-----------
## models

**user.model.js:** contain the mongoose database schema for user    

| attribute 	| type   	| required 	| unique 	| default 	|
|-----------	|--------	|----------	|--------	|---------	|
| username  	| string 	| true     	| true   	| none    	|
| email     	| string 	| true     	| true   	| none    	|
| imageUrl      | string    | false    	| false  	| none     	|
| password  	| string 	| true     	| false   	| none    	|  
| role      	| string 	| true     	| false   	| 'USER'   	|  

**post.model.js:** contain the mongoose database schema for post  

| attribute     	| type          	| required 	| unique 	| default  	|
|---------------	|---------------	|----------	|--------	|----------	|
| userId        	| string        	| true     	| false  	| none     	|
| content       	| string        	| true     	| false  	| none     	|
| usersLiked    	| array[string] 	| true     	| false  	| none     	|
| usersDisliked 	| array[string] 	| false    	| false  	| none     	|
| imageUrl      	| string        	| false    	| false  	| none     	|
| date          	| Date          	| true     	| false  	| Date.now 	|  


-----------
## middlewares
**middleware.jwt.js** JWT is our token management system to secure our app  
**middleware.multer.js** Multer is our upload manager middleware
