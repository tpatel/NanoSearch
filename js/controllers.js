angular.module("NanoSearch", ['ngResource']).
    config(['$routeProvider', function($routeProvider) {
		$routeProvider.
		    when('/', {templateUrl: 'partials/search.html',   controller: SearchController}).
		    when('/about', {templateUrl: 'partials/about.html',   controller: SimpleSearchController}).
		    when('/v/:video', {templateUrl: 'partials/video.html',   controller: VideoController}).
		    otherwise({redirectTo: '/'});
	}]).
	directive('focus', function () {
		return function (scope, element) {
			element[0].select();
		}
	});

function SearchController($scope, $resource, $rootScope, $window, $location) {
	$scope.$on('$viewContentLoaded', function(event) {
		$window._gaq.push(['_trackPageview', $location.path()]);
	});
    $scope.youtube = $resource("https://gdata.youtube.com/feeds/api/videos",
        {'max-results':'6', orderby:'relevance', alt:'json-in-script', v:'2', callback:'JSON_CALLBACK'},
        {get:{method:'JSONP'}}
    );
    if($rootScope.q) {
    	$scope.margintop = 'off';
    	var q = $rootScope.q;
    	$scope.search(q);
    	$scope.q = q;
    	delete $rootScope.q;
    }
    $scope.search = function(query){
    	$scope.msg = '';
    	var q = query || $scope.q;
    	if(!q) {
    		$scope.msg = 'Empty search = No results !';
    		return;
    	}
        $scope.youtube.get(
    		{q:q},
    		function (data) {
				$scope.videos = data.feed.entry || [];
				if($scope.videos.length == 0) {
					$scope.msg = 'No results... Try again !';
				}
				$scope.margintop = 'off';
				//console.log($scope.videos);
		});
    }
}

function VideoController($scope, $resource, $routeParams, $location, $rootScope, $window) {
	$scope.$on('$viewContentLoaded', function(event) {
		$window._gaq.push(['_trackPageview', $location.path()]);
	});
	$scope.video = $routeParams.video;
	$scope.details = $resource('https://gdata.youtube.com/feeds/api/videos/:videoid/related',
        {videoid:$scope.video, alt:'json-in-script', v:'2', callback:'JSON_CALLBACK'},
        {get:{method:'JSONP'}}
    );
	$scope.search = function(){
		$rootScope.q = $scope.q;
        $location.path('/');
    };
    $scope.details.get(function(data) {
    	$scope.videos = [];
    	for(var i in data.feed.entry) {
    		if(i<3)
	    		$scope.videos.push(data.feed.entry[i]);
    	}
    });
}

function SimpleSearchController($scope, $location, $rootScope, $window) {
	$scope.$on('$viewContentLoaded', function(event) {
		$window._gaq.push(['_trackPageview', $location.path()]);
	});
	$scope.search = function(){
		$rootScope.q = $scope.q;
        $location.path('/');
    }
}
