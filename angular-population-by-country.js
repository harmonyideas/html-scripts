var App = angular.module('App', []);

App.controller('MyCtrl', function($scope, $http) {


    $scope.sortType = 'population'; // set the default sort type
    $scope.sortReverse = true; // set the default sort order
    $scope.searchCountry = ''; // set the default search/filter term

    $http.get('data/worldpopulation.json')
        .then(function(res) {
            $scope.data = res.data;
            angular.forEach($scope.data, function(country) {
                country.population = parseInt(country.population);
            });
        });
});
