var App = angular.module('myApp', ['ui.bootstrap']);

App.filter('startFrom', function() {
  return function(input, start) {
    if (input) {
      start = +start;
      return input.slice(start);
    }
    return [];
  }
});
App.controller('controller', function($scope, $http, $timeout) {
  $http.get('data/worldpopulation.json').then(function(response) {
    // Default Settings
    $scope.data = response.data;
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.filter_data = $scope.data.length;
    $scope.totalItems = $scope.data.length;
  });
  $scope.page_position = function(page_number) {
    $scope.currentPageat = page_number;
  };
  $scope.filter = function() {
    $timeout(function() {
      $scope.filter_data = $scope.searched.length;
    }, 20);
  };
  $scope.sort_with = function(base) {
    $scope.base = base;
    $scope.reverse = !$scope.reverse;
  };
});
