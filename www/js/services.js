angular.module('starter.services', ['firebase'])

.factory('Questions', ['$firebaseArray', 'FBREF', function($firebaseArray, FBREF) {
	
	return $firebaseArray(FBREF.child('questions'));
	
}]);