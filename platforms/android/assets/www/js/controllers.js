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
            $state.go('tab.dash');
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


.controller('dashCtrl', function($scope, $state, DBconnect){
    var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
    var authData = ref.getAuth();

    if (authData){
        $scope.name = DBconnect.getName(authData, ref);
    }else {
        ref.unauth();
        $state.go('login');
    }

    var date =  new Date();
    var toDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var test = toDay.toJSON;
    console.log(test);

    ref.child("exercices/"+name).on("value", function(snapshot) {
        //console.log(snapshot.val());
        $scope.myExercices = snapshot.val();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    $scope.deleteExo = function (ex) {
        DBconnect.deleteExo(ex, ref, $scope.name);
    };

    $scope.new = function () {
      $state.go('dash-new');
    };

    
})


.controller('loginCtrl', function($scope, $state){

    $scope.isSomethingLoading = false;

    $scope.login = function(user) {
        $scope.isSomethingLoading = true;
        var isNewUser = true;
        var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
        ref.authWithPassword({
            email: user.email,
            password: user.password
        }, function (error, authData) {
            if (error) {
                switch (error.code) {
                    case "INVALID_EMAIL":
                        console.log("The specified user account email is invalid.");
                        $scope.isSomethingLoading = false;
                        break;
                    case "INVALID_PASSWORD":
                        console.log("The specified user account password is incorrect.");
                        $scope.isSomethingLoading = false;
                        break;
                    case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        $scope.isSomethingLoading = false;
                        break;
                    default:
                        console.log("Error logging user in:", error);
                        $scope.isSomethingLoading = false;
                }
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $scope.isSomethingLoading = false;
                $state.go('tab.dash');
            }
        });

        $scope.loginfb = function () {
            var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
            ref.authWithOAuthPopup("facebook", function(error, authData) {
                if (error) {
                    console.log("Authentication Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $state.go('tab.dash');
                }
            });
        };

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
});



