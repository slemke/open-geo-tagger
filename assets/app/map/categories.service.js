(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('CategoryService', CategoryService);

    CategoryService.$inject = [
        '$http'
    ];

    function CategoryService($http) {

        return {
            get : function(categoryID, name) {
                var parameter = '';
                if(categoryID !== undefined && categoryID !== null)
                    parameter += '/' + categoryID;

                if(name !== undefined && name !== null && parameter === '')
                    parameter += '/?name=' + name;


                return $http.get('/categories' + parameter)
                    .then(handleSuccess, handleError('Error getting category / categories'));

            },
            post : function(category) {
                return $http.post('/categories', category)
                    .then(handleSuccess, handleError('Error creating category'));

            },
            put : function(category) {
                return $http.put('/categories/' + category._id, category)
                    .then(handleSuccess, handleError('Error updating category'));

            },
            delete : function(id) {
                return $http.delete('/categories/' + id)
                    .then(handleSuccess, handleError('Error deleting category'));

            }
        };

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return { success: false, message: error };
        }
    }
})();
