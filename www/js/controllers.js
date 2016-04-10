angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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

.controller('newCtrl', function($scope, $http) {
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
        selectedOption: {id: '362', name: 'Deadlifts'},
        image: {}
    };

    $http({
        method: 'GET',
        url: "https://wger.de/api/v2/exercise.json/?language=2&category=" + $scope.category.selectedOption.id + "&equipment="+ $scope.equipment.selectedOption.id,
        headers: {'Accept': 'application/json',
            'Authorization': 'Token b241e3fbaaa41243c9076d174dfd072b076bbaa9'}
    }).then(function successCallback(response) {
        $scope.exercise.available = response.data.results;
        $scope.exercise.selectedOption = response.data.results[0];
    }, function errorCallback(response) {
        console.log("No data found..");
    });

    $http({
        method: 'GET',
        url: 'https://wger.de/api/v2/exercisecategory.json',
        headers: {'Accept': 'application/json',
                  'Authorization': 'Token b241e3fbaaa41243c9076d174dfd072b076bbaa9'}
    }).then(function successCallback(response) {
        $scope.category.available = response.data.results;
    }, function errorCallback(response) {
        console.log("No data found..");
    });

    $http({
        method: 'GET',
        url: 'https://wger.de/api/v2/equipment/',
        headers: {'Accept': 'application/json',
            'Authorization': 'Token b241e3fbaaa41243c9076d174dfd072b076bbaa9'}
    }).then(function successCallback(response) {
        $scope.equipment.available = response.data.results;
    }, function errorCallback(response) {
        console.log("No data found..");
    });

    $http({
        method: 'GET',
        url: "https://wger.de/api/v2/exerciseimage/"+ $scope.exercise.selectedOption.id + "/",
        headers: {'Accept': 'application/json',
            'Authorization': 'Token b241e3fbaaa41243c9076d174dfd072b076bbaa9'}
    }).then(function successCallback(response) {
        console.log(response.data.image);
        $scope.exercise.image = response.data.image;
    }, function errorCallback(response) {
        console.log("No data found..");
        $scope.exercise.image = 'https://wger.de/static/images/icons/image-placeholder.svg';
    });

    $scope.newSearch = function () {
       $http({
           method: 'GET',
           url: "https://wger.de/api/v2/exercise.json/?language=2&category=" + $scope.category.selectedOption.id + "&equipment="+ $scope.equipment.selectedOption.id,
           headers: {'Accept': 'application/json',
               'Authorization': 'Token b241e3fbaaa41243c9076d174dfd072b076bbaa9'}
       }).then(function successCallback(response) {
           $scope.exercise.available = response.data.results;
           $scope.exercise.selectedOption = response.data.results[0];
       }, function errorCallback(response) {
           console.log("No data found..");
       });
    };

    $scope.updateExo = function () {
        $http({
            method: 'GET',
            url: "https://wger.de/api/v2/exerciseimage/"+ $scope.exercise.selectedOption.id + "/",
            headers: {'Accept': 'application/json',
                'Authorization': 'Token b241e3fbaaa41243c9076d174dfd072b076bbaa9'}
        }).then(function successCallback(response) {
            console.log(response.data.image);
            $scope.exercise.image = response.data.image;
        }, function errorCallback(response) {
            console.log("No data found..");
            $scope.exercise.image = 'https://wger.de/static/images/icons/image-placeholder.svg';
        });
    }



})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('dashCtrl', function($scope, $state){
    var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
    // find a suitable name based on the meta info given by each provider
    var authData = ref.getAuth();
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
    $scope.name = getName(authData);
    $scope.new = function () {
      $state.go('dash-new');
    };

/*
    function setExos() {
        var usersRef = ref.child("users");
        usersRef.set({
            alanisawesome: {
                date_of_birth: "June 23, 1912",
                full_name: "Alan Turing"
            },
            gracehop: {
                date_of_birth: "December 9, 1906",
                full_name: "Grace Hopper"
            }
        });
    }
    
    //$scope.exercices = getExos();
    $scope.setExo = function (newExo) {
      /!**!/
    };
*/
    $scope.name = getName(authData);
})


.controller('loginCtrl', function($scope, $state){
    $scope.login = function(user) {
        var isNewUser = true;
        var ref = new Firebase("https://crackling-inferno-6605.firebaseio.com");
        ref.authWithPassword({
            email    : user.email,
            password : user.password
        }, function(error, authData) {
            if (error) {
                switch (error.code) {
                    case "INVALID_EMAIL":
                        console.log("The specified user account email is invalid.");
                        break;
                    case "INVALID_PASSWORD":
                        console.log("The specified user account password is incorrect.");
                        break;
                    case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        console.log("Error logging user in:", error);
                }
            } else {
                console.log("Authenticated successfully with payload:", authData);
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

/*.controller('loginCtrl', function($scope, $http, $state, $cookieStore){
    var user = {};
    $scope.update = function (user) {

        //console.log(user.email);

        $http({
            method: "post",
            url: "http://localhost/coachsportif/www/php/login.php",
            crossDomain: true,
            data: {
                email: user.email,
                password: user.password
            }
        } ).then(function(resp) {
            console.log(resp.data);

            if (resp.data.success === "true"){
                $state.go('tab.dash');
            } else {
                $scope.error = resp.data.error;
            }
            // For JSON responses, resp.data contains the result
        }, function(err) {
            console.error('ERR', err);
            // err.status will contain the status code
        })
    }
})


.controller('registerCtrl', function ($scope, $http, $state){
    var user = {};
    $scope.register = function (user) {
        console.log(user);

        $http({
            method: "post",
            url: "http://localhost/coachsportif/www/php/register.php",
            crossDomain: true,
            data: {
                email: user.email,
                name: user.name,
                password: user.password,
                password2: user.password2
            }
        } ).then(function(resp) {
            console.log(resp.data);

            if (resp.data.success === "true"){
                $state.go('tab.dash');
            } else {
                $scope.error = resp.data.error;
            }
            // For JSON responses, resp.data contains the result
        }, function(err) {
            console.error('ERR', err);
            // err.status will contain the status code
        })
    }
});*/


