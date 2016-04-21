angular.module('starter.services', [])

.filter('searchFor', function(){
  return function(arr, searchString){
    if(!searchString){
      return arr;
    }
    var result = [];
    searchString = searchString.toLowerCase();
    angular.forEach(arr, function(item){
      if(item.name.toLowerCase().indexOf(searchString) !== -1){
        result.push(item);
      }
    });
    return result;
  };
});


/*.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//crackling-inferno-6605.firebaseapp.com/users");
  return $firebaseAuth(usersRef);
});*/
