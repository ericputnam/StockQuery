(function() {
  'use strict';
  
  angular
    .module('stockquery')
    .controller('ChartController', ChartController)
    ChartController.$inject = ['$cacheFactory', '$routeParams', 'photofactory'];

    function ChartController($cacheFactory, $routeParams, photofactory) {
      var vm = this;  

      vm.mySymbol = $routeParams.symbol;

      photofactory.getSymbols("me")
      .then(function(data) {
        vm.dropdown = data;
      });

      photofactory.getChartData($routeParams.symbol)
      .then(function(data) {
        vm.results = data;

        //console.log(vm.results[0].value.Quote.Date);
        var chartData = [];
        var chartDates = [];
        //console.log(vm.results[0].value.Quote.length);
        for(var i = 0; i < vm.results[0].value.Quote.length; i++){
          var quoteObj = vm.results[0].value.Quote[i];
          chartDates.push(quoteObj['Date']);
          chartData.push(quoteObj.Close);
        }
        //console.log(chartData);
        
        //sorting
        vm.order = {
          sortBy: 'data.created',
          reverse: false
        }

        var riceData = {
            labels : chartDates,
            //labels : vm.results[0].value.Quote.Date,
            datasets : [
                {
                    fillColor : "rgba(172,194,132,0.4)",
                    strokeColor : "#ACC26D",
                    pointColor : "#fff",
                    pointStrokeColor : "#9DB86D",
                    //data : [203000,15600,99000,25100,30500,24700]
                    data: chartData
                }
            ]
        }

        var stockChart = document.getElementById('stockChart').getContext('2d');
        new Chart(stockChart).Line(riceData);
      })
      .catch(function(error) {
        console.error(error);
      });

      



      

      /*var infoWindow    = new google.maps.InfoWindow();
      var tmpMarkers    = [];
      var numberOfCalls = 0;
      var photoData     = '';

      var mapOptions    = {
        zoom: 2,
        center: new google.maps.LatLng(10, 0),
        mapTypeId: google.maps.MapTypeId.ROAD
      };

      // caching
      var cache = $cacheFactory.get('$http');
      var dataCache = cache.get('/api');

      vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      var createMarker = function(photoData) {
        var binaryCache = cache.get('/api/imagedata/' + photoData.filename);
        var latitude  = photoData.location.coordinates[0];
        var longitude = photoData.location.coordinates[1];
        var title     = photoData.title || photoData.filename;
        var marker    = {
          map: vm.map,
          position: new google.maps.LatLng(latitude, longitude),
          id: photoData.filename,
          data: photoData,
          title: title
        };
        var point     = new google.maps.Marker(marker);
        vm.markers    = [];

        tmpMarkers.push(point);
        vm.markers = tmpMarkers;

        google.maps.event.addListener(point, 'click', function() {
          if (!binaryCache) {
            infoWindow.setContent('<div class="infoWindowHeader"><span class="title">' + marker.title + '</span> <span><a href="#/edit/' + marker.id + '" class="btn btn-warning btn-xs"><i class="glyphicon glyphicon-pencil"></i></a></span></div>' + '<div class="infoWindowContent"><img class="img-rounded" src="' + photoData.binary + '"></div>');
            infoWindow.open(vm.map, point);
          } else {
            var binaryData = JSON.parse(binaryCache[1]);
            infoWindow.setContent('<div class="infoWindowHeader"><span class="title">' + marker.title + '</span> <span><a href="#/edit/' + marker.id + '" class="btn btn-warning btn-xs"><i class="glyphicon glyphicon-pencil"></i></a></span></div>' + '<div class="infoWindowContent"><img class="img-rounded" src="' + photoData.binary + '"></div>');
            infoWindow.open(vm.map, point);
          }
        });
      };
      if (!dataCache) {
        photofactory.showAllPhotos()
        .then(function(data) {
          vm.photos = data;
          for (var i = 0, max = data.length; i < max; i++) {
              createMarker(data[i].content);
          }
        });
      } else {
        var data = JSON.parse(dataCache[1]);
        vm.photos = data;
        for (var i = 0, max = data.length; i < max; i++) {
            createMarker(data[i].content);
        }
      }

      vm.openInfoWindow = function(e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
      };*/
    }
  })();
