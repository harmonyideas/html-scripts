var App = angular.module('App', ['ui.bootstrap']);

App.controller('MyCtrl', function($scope, $http) {

  $scope.filteredList = [],
    $scope.currentPage = 1,
    $scope.numPerPage = 10,
    $scope.maxSize = 5;

  $scope.sortType = 'population'; // set the default sort type
  $scope.sortReverse = true; // set the default sort order
  $scope.searchCountry = ''; // set the default search/filter term

  $http.get('data/worldpopulation.json')
    .then(function(res) {
      $scope.data = res.data;
      $scope.totalItems = $scope.data.length;
      angular.forEach($scope.data, function(country) {
        country.population = parseInt(country.population);
      });
      $scope.$watch("currentPage + numPerPage", function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filteredList = $scope.data.slice(begin, end);
      });
    });
});
