var app = angular.module('myApp', []);
var createdDate;
var updatedDate;
var licenseName = "null";

app.controller('myCtrl', function($scope, $http) {
    $scope.showResult = false;
    $scope.mainName = "testing";
    
    //predefined arrays to be updated during API get
    $scope.generalArray1 = [
      {key: "Full name", value: "atom/atom1"},
      {key: "Description", value: ":atom: The hackable text editor"},
      {key: "URL", value: "https://github.com/atom/atom"},
      {key: "Language", value: "Javascript"},
    ];
    
    $scope.generalArray2 = [
      {key: "Private", value: "false"},
      {key: "Created at", value: "11/01/2000"},
      {key: "Updated at", value: "11/05/3000"},
    ];
    
    $scope.usageArray = [
      {src: "images/star.svg", key: "Starred by", value: "8888"},
      {src: "images/eye.svg", key: "Watched by", value: "9999"},
      {src: "images/repo-forked.svg", key: "Forked by", value: "9221"},
      {src: "images/law.svg", key: "License", value: "Yale"},
    ];
    
    $scope.ownerArray = [
      {key: "Owner", value: "atom"},
      {key: "OwnerID", value: "3228505"},
      {key: "Type", value: "Organisation"},
    ];
    
    $scope.avatar = "https://upload.wikimedia.org/wikipedia/commons/2/25/Info_icon-72a7cf.svg";
    
    $scope.runSearch = function(){ 
        //check for empty / undefined
        if ($scope.searchTerm){
            runSearchAPI();
        } else {
            //set no search words message
            $scope.feedbackMsg = "No seach entry detected. Please enter a valid search string.";
            $('#feedbackModalCenter').modal('show');
        }
    }

    function runSearchAPI(){
        $http({
            method : "GET",
                url : "https://api.github.com/search/repositories?q="+$scope.searchTerm
//            url:"search.json" //saved result for testing
//                url:"noResult.json" //saved result for testing
        }).then(function searchSuccess(response) {
            //confirm there is at least one valid result
            if(response.data.items.length>0){
                console.log(response);
                runSearch2API(response.data.items[0].url);
            } else {
                $scope.feedbackMsg = "No results for that search. Please try a different entry.";
                $('#feedbackModalCenter').modal('show');
            }

        }, function seachError(response) {
            //set search failed
            $scope.feedbackMsg = "Search failed. Please try again later.";
            $('#feedbackModalCenter').modal('show');
        }); 
    }

    function runSearch2API(firstURL){
        $http({
            method : "GET",
            url : firstURL
//            url:"atom.json" //saved result for testing
        }).then(function searchSuccess(response) {
            console.log(response);
            //populate arrays
            $scope.mainName = response.data.name;
            
            $scope.generalArray1 = [
              {key: "Full name", value: response.data.full_name},
              {key: "Description", value: response.data.description},
              {key: "URL", value: response.data.html_url},
              {key: "Language", value: response.data.language},
            ];
            
            createdDate = new Date(response.data.created_at);
            updatedDate = new Date(response.data.updated_at);
            
            $scope.generalArray2 = [
              {key: "Private", value: response.data.private},
              {key: "Created at", value: createdDate.toLocaleDateString()},
              {key: "Updated at", value: updatedDate.toLocaleDateString()},
            ];
            
            if(response.data.license){
                licenseName = response.data.license.spdx_id;
            } else {
                licenseName = "null";
            }
            
            $scope.usageArray = [
              {src: "images/star.svg", key: "Starred by", value: response.data.stargazers_count},
              {src: "images/eye.svg", key: "Watched by", value: response.data.watchers_count},
              {src: "images/repo-forked.svg", key: "Forked by", value: response.data.forks_count},
              {src: "images/law.svg", key: "License", value: licenseName},
            ];
            
            $scope.ownerArray = [
              {key: "Owner", value: response.data.owner.login},
              {key: "OwnerID", value: response.data.owner.id},
              {key: "Type", value: response.data.owner.type},
            ];
            
            $scope.avatar = response.data.owner.avatar_url;
            
            //make visible search results
            $scope.showResult = true;


        }, function seachError(response) {
            //set search failed
            $scope.feedbackMsg = "Search failed. Please try again later.";
            $('#feedbackModalCenter').modal('show');
        }); 
    }

});