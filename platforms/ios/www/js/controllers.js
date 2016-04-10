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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('dashCtrl', function($scope, $localstorage){
   $scope
})

.controller('loginCtrl', function($scope, $http, $state, $cookieStore){
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
});


