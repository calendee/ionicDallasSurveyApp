# What is Firebase
- https://www.firebase.com
- https://www.firebase.com/pricing.html (Dirt Cheap API/Database in one)
- https://www.firebase.com/docs/web/
- http://angularfire.com

# Quick Demo
- Show live updates in Forge


# Start An Ionic App
```
ionic start surveyapp sidemenu
cd surveyapp
```

# Create a Survey App
- Download Firebase and AngularFire
- Add script tags for Firebase and AngularFire
- ... Do some coding 

# Secure It!

```
"surveyApp" : {
  ".read" : false,
  ".write" : "root.child('surveyApp').child('users').child(auth.uid).child('admin').val() === true",
  "questions" : {
    ".read" : true,
    "results" : {
      ".write" : true
    }
  }
},
```	

# Make it a real app
```
ionic platform add ios
ionic platform add android
```


# Sample App
http://development.surveyapp.divshot.io
http://play.ionic.io/app/6a02321a35c5