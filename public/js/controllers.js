myApp.controller('WelcomeController', [ function(){
    console.log("Welcome Controller started!");
}]);

myApp.controller('MoviesController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){
    console.log("Movies controller started!");

    let vm = this; //vm

    // Set the Content-Type 
    //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        
    // Delete the Requested With Header
    delete $http.defaults.headers.common['X-Requested-With'];

    const imbd = "http://omdbapi.com/";
    const api = "https://whispering-waters-61190.herokuapp.com/api/movies/";

    vm.types = ["Horror", "Romance", "Action", "Thriller", "Historical", "Family"];
    vm.fields = {};
    vm.index;
    vm.filter = {};
    vm.item = [];

    vm.listMovies = listMovies;
    vm.getImbdMovies = getImbdMovies;
    vm.loadUpdate = loadUpdate;
    vm.updateAll = updateAll;
    vm.deleteItem = deleteItem;
    vm.addRecommendedMovie = addRecommendedMovie;
    vm.submitForm = submitForm;
    vm.changeState = changeState;

    function init(){
        listMovies();
    }
    init();


    vm.imageSortableOptions = {
        'ui-floating': true,
        'update': function (event, ui) {
            // console.log('item is: ', vm.item);
            // console.log('ui is: ', ui);
            // console.log('event is: ', event);
            // $scope.$apply();
            // callApi(vm.item, 'update');
            //callApi(vm.item, 'update');
        }
    }
    
    function listMovies(){
        vm.filter = {};
        console.log('getting movies..');
        $http.get(api + 'list').then(results => {
            console.log('results are: ', results);
            vm.item = results.data;
        })
    }

    function callApi(items, state){
        let obj = angular.toJson(items);

        switch(state){
            case "delete":
            case "update": 
                call = { url: api, method: "PUT", data: obj };
                break;
            case "create": 
                call = { url: api, method: "POST", data: obj };
                break;
        }

        console.log('making call: ', call.data);

        if(call){
            console.log('updating...', items);
            $http(call).then(results => {
                console.log('items are updated: ', results);
                toastr.success("Items were " + state + "d Successfully!", "Success");
                listMovies();
            })
        } else {
            console.log('no item selected!');
            toastr.success("Items were not " + state + "ed...", "Oops!");
        }
    }

    let imbdTimer;
    function getImbdMovies(){
        clearTimeout(imbdTimer);
        vm.showImbd = false;
        imbdTimer = setTimeout(() => {
            $http.get(imbd, {
                params: {
                    apikey: "1e6cb687",
                    t: vm.fields.title,
                    plot: "full"
                }
            }).then(results => {
                vm.showImbd = true
                console.log('results are: ', results);
                vm.imbdMovies = results.data;
                
            });
        }, 1000);
    }

    function changeState(state){
        vm.state = state;
        vm.fields = {};
    }

    function loadUpdate(item, index){
        changeState('update');
        vm.fields = Object.assign({}, item);
        vm.index = index;
    }

    function deleteItem(index){
        vm.item.splice(index, 1);
        callApi(vm.item, 'delete');
    }

    function addRecommendedMovie(item){
        console.log('item is: ', item);
        let obj = {
            title: item.Title,
            director: item.Director.split(',')[0],
            releaseDate: item.Released,
            type: item.Genre.split(',')[0]
        }

        console.log('obj is: ', obj);

        vm.item.push(obj);
        callApi(obj, 'create');
    }

    function updateAll(){
        callApi(vm.item, 'update');
    }

    function submitForm(){
        console.log("fields form is: ", vm.fields);

        switch(vm.state){
            case 'search':
                vm.filter = Object.assign({}, vm.fields);
                break;
            case 'update':
                vm.item[vm.index] = Object.assign({}, vm.fields);
                console.log('vm item is: ', vm.item);
                callApi(vm.item, 'update');
                break;
            case 'create':
                vm.item.push(Object.assign({}, vm.fields));
                callApi(Object.assign({}, vm.fields), 'create');
                break;
            default:
        }
        changeState();
    }

}]);