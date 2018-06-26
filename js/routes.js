
myApp.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/welcome', {
            templateUrl: "view/welcome.html",
            data: { pageTitle: 'Welcome!' },
            controller: "WelcomeController",
            controllerAs: "vm",
        })

        .when('/list', {
            templateUrl: "view/list.html",
            data: { pageTitle: 'List of Movies' },
            controller: "MoviesController",
            controllerAs: "vm",
        })
        
        .otherwise("/welcome");

}])