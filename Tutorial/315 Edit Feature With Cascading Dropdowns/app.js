var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.edit']);

app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.gridOptions = {};

  $scope.gridOptions.columnDefs = [
    { name: 'name', displayName: 'Name', width: '20%' },
    { name: 'gender', displayName: 'Gender', editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
      cellFilter: 'mapGender', editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
        { id: 1, gender: 'male' },
        { id: 2, gender: 'female' }
      ] 
    },
    { name: 'company', displayName: 'Company', width: '30%' },
    { name: 'size', displayName: 'Clothes Size', width: '20%', editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapSize', editDropdownValueLabel: 'size', editDropdownRowEntityOptionsArrayPath: 'sizeOptions' }
  ];
  
  $scope.maleSizeDropdownOptions = [
    { id: 1, size: 'SM' },
    { id: 2, size: 'M' },
    { id: 3, size: 'L' },
    { id: 4, size: 'XL' },
    { id: 5, size: 'XXL' }
  ];

  $scope.femaleSizeDropdownOptions = [
    { id: 6, size: '8' },
    { id: 7, size: '10' },
    { id: 8, size: '12' },
    { id: 9, size: '14' },
    { id: 10, size: '16' }
  ];

 $scope.gridOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
      if( colDef.name === 'gender' ){
        if( newValue === 1 ){
          rowEntity.sizeOptions = $scope.maleSizeDropdownOptions;
        } else {
          rowEntity.sizeOptions = $scope.femaleSizeDropdownOptions;
        }
      }
    });
  };

  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/100.json')
  .success(function(data) {
    // massage the default data to give us a coded gender and a size
    for(i = 0; i < data.length; i++){
      if ( data[i].gender === 'male' ) {
        data[i].gender = 1;
        data[i].size = Math.floor(Math.random() * (5 - 1)) + 1;
        data[i].sizeOptions = $scope.maleSizeDropdownOptions;
      } else {
        data[i].gender = 2;
        data[i].size = Math.floor(Math.random() * (10 - 5)) + 5;
        data[i].sizeOptions = $scope.femaleSizeDropdownOptions;
      }
    }
    $scope.gridOptions.data = data;
  });
}])

.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };

  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})

.filter('mapSize', function() {
  var sizeHash = {
    1: 'SM',
    2: 'M',
    3: 'L',
    4: 'XL',
    5: 'XXL',
    6: '8',
    7: '10',
    8: '12',
    9: '14',
    10: '16'
  };

  return function(input) {
    if (!input){
      return '';
    } else {
      return sizeHash[input];
    }
  };
})
;
