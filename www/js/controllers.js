angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('newCtrl', function($scope, $http, $state, DBconnect) {
    var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
    var authData = ref.getAuth();

    $scope.name = DBconnect.getName(authData);

    var currentDate = new Date();
    var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());


    $scope.date = date;

    $scope.category = {
        available: {},
        selectedOption: {id: '10', name: 'Abs'}
    };

    $scope.equipment = {
        available: {},
        selectedOption: {id: '1', name: 'Barbell'}
    };

    $scope.exercise = {
        available: {},
        selectedOption: {},
        image: {}
    };

    $scope.e = {
        name: {},
        newDate: $scope.date,
        series: 1,
        repetitions : 5,
        frequence: "Une seul fois"
    };



    ionic.Platform.ready(function(){
        $http({
            method: 'GET',
            url: "https://wger.de/api/v2/exercise.json/?language=2&category=" + $scope.category.selectedOption.id + "&equipment="+ $scope.equipment.selectedOption.id,
            headers: {'Accept': 'application/json',
                'Authorization': 'Token ad78fdd67e0802f6eae06c02b406fbb1b51b558a'}
        }).then(function successCallback(response) {
            $scope.exercise.available = response.data.results;
            $scope.e.name = response.data.results[0];
            $scope.is_available = true;
        }, function errorCallback(response) {
            console.log("No data found..");
        });

        $http({
            method: 'GET',
            url: 'https://wger.de/api/v2/exercisecategory.json',
            headers: {'Accept': 'application/json',
                'Authorization': 'Token ad78fdd67e0802f6eae06c02b406fbb1b51b558a'}
        }).then(function successCallback(response) {
            $scope.category.available = response.data.results;
        }, function errorCallback(response) {
            console.log("No data found..");
        });

        $http({
            method: 'GET',
            url: 'https://wger.de/api/v2/equipment/',
            headers: {'Accept': 'application/json',
                'Authorization': 'Token ad78fdd67e0802f6eae06c02b406fbb1b51b558a'}
        }).then(function successCallback(response) {
            $scope.equipment.available = response.data.results;
        }, function errorCallback(response) {
            console.log("No data found..");
        });

        $http({
            method: 'GET',
            url: "https://wger.de/api/v2/exerciseimage/"+ $scope.exercise.selectedOption.id + "/",
            headers: {'Accept': 'application/json',
                'Authorization': 'Token ad78fdd67e0802f6eae06c02b406fbb1b51b558a'}
        }).then(function successCallback(response) {
            console.log(response.data.image);
            $scope.exercise.image = response.data.image;
        }, function errorCallback(response) {
            console.log("No data found..");
            $scope.exercise.image = 'https://wger.de/static/images/icons/image-placeholder.svg';
        });

        /* Enregistrement d'un evenement */

        $scope.addExo = function (e) {
            //console.log(e);
            DBconnect.addExo(e, ref, $scope.name);
            $state.go('dashboard');
        };

        /* Fin En */

    });


    $scope.newSearch = function () {
       $http({
           method: 'GET',
           url: "https://wger.de/api/v2/exercise.json/?language=2&category=" + $scope.category.selectedOption.id + "&equipment="+ $scope.equipment.selectedOption.id,
           headers: {'Accept': 'application/json',
               'Authorization': 'Token ad78fdd67e0802f6eae06c02b406fbb1b51b558a'}
       }).then(function successCallback(response) {
               if(response.data.count !== 0){
                   $scope.is_available = true;
               }else{
                   $scope.is_available = false;
               }
               $scope.exercise.available = response.data.results;
               $scope.e.name = response.data.results[0];

               console.log($scope.is_available);

       }, function errorCallback(response) {
           console.log("No data found..");
       });

    };

    $scope.updateExo = function () {
        $http({
            method: 'GET',
            url: "https://wger.de/api/v2/exerciseimage/"+ $scope.exercise.selectedOption.id + "/",
            headers: {'Accept': 'application/json',
                'Authorization': 'Token ad78fdd67e0802f6eae06c02b406fbb1b51b558a'}
        }).then(function successCallback(response) {
            console.log(response.data.image);
            $scope.exercise.image = response.data.image;
        }, function errorCallback(response) {
            console.log("No data found..");
            $scope.exercise.image = 'https://wger.de/static/images/icons/image-placeholder.svg';
        });
    }



})


.controller('AccountCtrl', function($scope, Events) {
  $scope.settings = {
    enableFriends: true
  };
})

/* Dashboard
*
* Variabe retournées et disponibles dans le $scope:
*   - name: (le nom de l'utilisateur)
*
*   - myExercices: (un tableau contenant tous les exercices du jour)
*      Pour chacun des exercices, sont disponibles, les varaibles suivante:
*
*       - id
*       - name
*       - frequence
*       - date
*       - repetitions
*       - series
*/


.controller('dashCtrl', function($scope, $state, $ionicSideMenuDelegate, DBconnect){
    var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
    var authData = ref.getAuth();

    if (authData){
        $scope.name = DBconnect.getName(authData, ref);
    }else {
        ref.unauth();
        $state.go('login');
    }

    var currentDate = new Date();
    var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    console.log(date);

    ref.child("exercices/"+name).orderByChild("date").equalTo(date.toJSON()).on("value", function(snapshot) {
        //console.log(snapshot.val());
        $scope.myExercices = snapshot.val();
        $scope.$apply();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    $scope.validateExo = function (ex) {
        DBconnect.validateExo(ex, ref, $scope.name)
    };

    /*$scope.deleteExo = function (ex) {
        DBconnect.deleteExo(ex, ref, $scope.name);
    };*/

    $scope.logout = function () {
        ref.unauth();
        $state.go('login');
    };

    $scope.new = function () {
      $state.go('new');
    };

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    
})

.controller('loginCtrl', function($scope, $state){

    $scope.isSomethingLoading = false;
    $scope.loginfb = function () {
        /*var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
*/

        var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
         ref.authWithOAuthPopup("facebook", function(error, authData) {
         if (error) {
         console.log("Authentication Failed!", error);
         } else {
         console.log("Authenticated successfully with payload:", authData);
         $state.go('dashboard');
         }
         });
    };

    $scope.login = function(user) {
        var isNewUser = true;
        var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");

        if (user === undefined) {
            $scope.error = 'Veuillez renseigner tous les champs';
            $state.go('login');
        } else {
            $scope.isSomethingLoading = true;

            ref.authWithPassword({
                email: user.email,
                password: user.password

            }, function testError(error, authData) {
                if (error) {
                    switch (error.code) {
                        case "INVALID_EMAIL":
                            console.log("The specified user account email is invalid.");
                            $scope.error = 'L\'email est incorrect';
                            $scope.isSomethingLoading = false;
                            $state.go('login');
                            break;
                        case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            $scope.error = 'Mot de passe incorrect';
                            $scope.isSomethingLoading = false;
                            $state.go('login');
                            break;
                        case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            $scope.error = 'Ce compte n\'existe pas';
                            $scope.isSomethingLoading = false;
                            $state.go('login');
                            break;
                        default:
                            console.log("Error logging user in:", error);
                            $scope.error = 'Veuillez réessayer';
                            $scope.isSomethingLoading = false;
                            $state.go('login');
                    }
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $scope.isSomethingLoading = false;
                    $state.go('dashboard');
                }

            });
        }





        ref.onAuth(function(authData) {
            if (authData && isNewUser) {
                // save the user's profile into the database so we can list users,
                // use them in Security and Firebase Rules, and show profiles
                ref.child("users").child(authData.uid).set({
                    provider: authData.provider,
                    name: getName(authData)
                });

                function getName(authData) {
                    switch(authData.provider) {
                        case 'password':
                            return authData.password.email.replace(/@.*/, '');
                        case 'twitter':
                            return authData.twitter.displayName;
                        case 'facebook':
                            return authData.facebook.displayName;
                    }
                }
            }
        });
    };
})

.controller('registerCtrl', function($scope, $state){
    $scope.register = function(user) {
        var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
        ref.createUser({
            email    : user.email,
            password : user.password
        }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                $state.go('login');
            }
        });
    }
})

.controller('videosCtrl', function($scope, $http){
    $scope.videos = [];

    $scope.youtubeParams = {
        key: 'AIzaSyDPqWEm9hP-GwzRAkVmbxi1cB7HYveEb4U',
        type: 'video',
        maxResults: '5',
        part: 'id,snippet',
        q: 'workout',
        order: 'date'
    }

    $http.get('https://www.googleapis.com/youtube/v3/search', {params:$scope.youtubeParams}).success(function(response){
        angular.forEach(response.items, function(child){
            $scope.videos.push(child);
        });
    });

    $scope.playerVars = {
        rel: 0,
        showinfo: 0,
        modestbranding: 0
    }
});



