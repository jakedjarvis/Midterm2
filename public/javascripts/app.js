angular.module('app', [])
    .controller('adminCtrl',[
    '$scope',
    '$http',
    function($scope, $http) {
        $http.get("/admin")
        .success(function(response) {
            console.log(response);

            $scope.products = response;
        });
        $scope.addProduct = function() {
            var product = {Name:$scope.name, Price:$scope.price, Amount:0, URL:$scope.pic}
            $http.post("/admin",product)
                .success(function(response) {
                    console.log("Product Posted");
                });
        };

        $scope.deleteProduct = function(product) {
            $http.delete("/admin/" + product._id)
                .success(function(response) {
                    console.log(response);
                });
        };

    }])
    .controller('voterCtrl',[
    '$scope',
    '$http',
    function($scope, $http) {
        $http.get("/voter")
        .success(function(response) {
            console.log(response);

            $scope.products = response;

            for (var i = 0; i < $scope.products.length; i++)
            {
                $scope.products[i].checked = false;
            }
        })

        $scope.incrementOrdered = function() {
            console.log($scope.products);

            angular.forEach($scope.products, function(product,key){
                if (product.checked == true){
                    $http.put("/admin/" + product._id + '/incrementAmount')
                        .success(function(response) {
                            console.log(response);
                        });
                    $http.get("/voter/" + product._id)
                        .success(function(response) {
                            console.log(response);

                            $scope.purchased = response;
                        });
                }
            })

        };

    }])
