# potrckoServer

#Login
/users/authenticate
method POST
```javascript
Send
{ 
	email: mail@mail.com
	passwort: pass
}
Respons
{
	 success: true,
     message: 'Enjoy your token!',
     token: token,
     user: user
}
```
#Register
/users/singup
method POST
```javascript
Send
{ 
	firstname: 'ime', 
    lastname: 'prezime',
    email: 'mail@mail.com',
    birthday: 'Thu Dec 29 2011 20:14:56 GMT-0600 (CST)',
    password: 'password',
    mob_num: '066/666-666',
    potrcko: 'true/false'
    busy: 'true/false'
}
Respons
{
	 success: true,
     message: 'Enjoy your token!',
     token: token,
     user: user
}
user: { 
    firstname, 
    lastname,
    email,
    birthday,
    reg_date,
    image,
    mob_num
    potrcko
    busy
}
```

#Upload image
/upload?token=TOKEN
method POST multipart/form-data
```javascript
Send
{
	avatar: image;
}
Respons
{
	success: true,
    message: 'Upload success!',
}
```
#Get Image
GET
/image/UserID
Return image

#*DeleteImage 
GET
/detele/UserID

#Update user
/users/update?token=TOKEN
POST
```javascript
Send
{
    //What want to change like this
    firstname: 'Name',
    lastname: 'Last'
}
Respons
{
    success: true,
    user: oldUser
}
or
{
    success: false,
    message: errMessage
}
```

#All ranks
Get
/ranks/

#Ranked
POST
/ranks/ranks?token=TOKEN
```javascript
Send
{
    email: mail@mail.com
}
Respons
```
#Rated
POST
/ranks/rated?token=TOKEN

#Socket
```javascript
#emite changeLocation
#to other clinet on changeLocation
{
    userId: String, 
    mail: String,
    username: String,
    longitude: String, 
    latitude: String,
    busy: Boolean
    radius: Number //in km
}
```
#emit allLocation on location
```javascript
{
    location:
    [
        {
            userId: String, 
            mail: String,
            username: String,
            longitude: String, 
            latitude: String,
            busy: Boolean
            radius: Number //in km
        }, ...
    ]
}
```
#emit disconect
#to other clinet on diconected
```javascript
Disconetded user
{
    userId: String, 
    mail: String,
    username: String,
    longitude: String, 
    latitude: String,
    busy: Boolean
    radius: Number //in km
}
```
#emit myLocation
only Potrcko in Service


#emit search
data like
```javascript
{
    furstname: name
}
{
    email: mail
}
```
#emit array of users;