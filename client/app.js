var app = angular.module('ngApp', []);

app.controller('aliasController', function($scope, $http) {

  $http({
    method: 'GET',
    url: '/names'
  }).then(function(response) {
    $scope.generatedNames = response.data;
  });

  $scope.adjList = window.adjList;
  $scope.nounList = window.nounList;
  $scope.currentName = '';
  $scope.clickedName = {};
  $scope.newName = {};

  var picReqUrl = 'https://api.500px.com/v1/photos/search?rpp=100&consumer_key=zooQGE9KlZlXTRSK1aBnKm69BQx17OpGoREecjhO&term=landscape';
  var quoteReqUrl = 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous';

  var existsInGenerated = function(name, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].originalName === name) {
        return true;
      }
    }

    return false;
  };

  $scope.generateAndAddName = function(name) {
    var capitalize = function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };

    var firstNameIndex = Math.floor( Math.random() * $scope.adjList.length );
    var lastNameIndex = Math.floor( Math.random() * $scope.nounList.length );
    var genName = capitalize($scope.adjList[firstNameIndex]) + ' ' + capitalize($scope.nounList[lastNameIndex]);

    $scope.newName = {
      originalName: name,
      generatedName: genName,
      imageUrl: '',
      albumTitle: ''
    };

    $http.post('/names', $scope.newName);
    $http({
      method: 'GET',
      url: '/names'
    }).then(function(response) {
      $scope.generatedNames = response.data;
    });

    $scope.nameOfUser = '';
  };

  $scope.generateAlbum = function() {
    $scope.clickedName = $scope.generatedNames[this.$index];
    $scope.currentName = {};
    var nameOfClicked = $scope.clickedName.originalName;

    // API call to 500px to get random image
    $http.get(picReqUrl).then(function(urlResponse) {
      var randomIndex = Math.floor(Math.random() * urlResponse.data.photos.length);
      var fetchedUrl = urlResponse.data.photos[randomIndex].image_url;

      // API call to andrux to get random quote
      $http({
        method: 'POST', 
        url: quoteReqUrl,
        headers: {
          'X-Mashape-Key': 'SC9tol3zkAmshUQqfW5b2DTQGLnXp1b1GZljsntMj0SOdJ2rCC'
        }
      }).then(function(quoteResponse) {
        var fetchedQuote = quoteResponse.data.quote;
        var quoteArr = fetchedQuote.split(' ');
        var finishedQuote = quoteArr.splice(quoteArr.length - 4).join(' ');
        finishedQuote = finishedQuote.substring(0, finishedQuote.length - 1);

        var resObj = {
          name: $scope.clickedName.originalName,
          url: fetchedUrl,
          quote: finishedQuote
        };

        $http.post('/album', resObj);

        $http({
          method: 'GET',
          url: '/names'
        }).then(function(response) {
          var namesArray = response.data;
          namesArray.forEach(function(element) {
            if (element.originalName === nameOfClicked) {
              $scope.currentName = element;
            }
          });
        });

      }, function(err) {
        throw err;
      });

    }, function(error) {
      throw err;
    });

  };

});