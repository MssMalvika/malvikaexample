 'use strict';

var myapp=angular.module('myapp',[]);

myapp.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
	$routeProvider.when('/login', { templateUrl: 'partials/login.html', controller: 'logincontroller'}).
                   when('/register', { templateUrl: 'partials/register.html', controller: 'registercontroller'}).
                   when('/profile',{ templateUrl: 'partials/profile.html', controller: 'profilecontroller' }).
                   when('/:id', { templateUrl: 'partials/login.html', controller: 'logincontroller'}).
    otherwise({
                   redirectTo: '/login'
             });

	$locationProvider.html5Mode({  
	     enabled: true,
	    //requireBase: false
	 });
}]);

myapp.controller('registercontroller',['$http', '$scope' , '$location' , function($http , $scope , $location){
	$scope.register=function(){
			var fullname = $scope.fullname;
			var username = $scope.username;
			var password = $scope.password;
			console.log(fullname);

			$http.post('/login',{fullname:fullname , username:username , password:password}).success(function(data){
					console.log("welcome",data);
					$location.path('/login');
			});
	 };
}]);  

myapp.controller('logincontroller', ['$http','$scope','$rootScope','$location' , function($http , $scope, $rootScope, $location){
		$scope.login=function(){
			  var username = $scope.username;
			  var password =$scope.password;
	            
			  $http.post('/profile',{ username:username, password: password } ).success(function(data) {
                
	                console.log("data=",username);
	                if(data!='')
	        		 {
			        		 	
			        		 	if(data.username!=username || data.password!=password)
			        		 	{
				        		 		alert("you have entered : " + data);
				        		 		$location.path("/login");
				        		}
			        		 	else
			        		 	{
					                    $rootScope.fullname=data.fullname;
					                    $rootScope.username=data.username;
					                    $rootScope.password=data.password;
			                    }  
					 }

			        else 
			        {
			                    alert('user not found');
			                    $location.path("/register");
			        }
         	    });
		 };
 }]);    


myapp.controller('profilecontroller', ['$http', '$scope',function($http,$scope){

}]);
