var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){GoogleMaps[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;GoogleMaps.prototype=Object.create(____SuperProtoOf____Class0);GoogleMaps.prototype.constructor=GoogleMaps;GoogleMaps.__superConstructor__=____Class0;
  function GoogleMaps(props) {"use strict";
    ____Class0.call(this,props);

    this.state = {
      markers: [],
      infowindow: null,
    };
  }

  Object.defineProperty(GoogleMaps.prototype,"componentDidMount",{writable:true,configurable:true,value:function() {"use strict";
    var mapOptions = {
      center: this.getMapCenterLatLng(),
      zoom: this.props.initialZoom,
    };

    var map = new google.maps.Map(React.findDOMNode(this), mapOptions);

    this.setMarkers(map, this.props);

    this.setState({
      map: map
    });
  }});

  Object.defineProperty(GoogleMaps.prototype,"componentWillReceiveProps",{writable:true,configurable:true,value:function(props) {"use strict";
    var map = this.state.map;

    this.state.markers.forEach(function(marker)  {
      marker.setMap(null);
    });

    this.setMarkers(map, props);

    this.setState({
      map: map
    });
  }});

  Object.defineProperty(GoogleMaps.prototype,"getMapCenterLatLng",{writable:true,configurable:true,value:function() {"use strict";
    return new google.maps.LatLng(this.props.mapCenterLat, this.props.mapCenterLng);
  }});

  Object.defineProperty(GoogleMaps.prototype,"setMarkers",{writable:true,configurable:true,value:function(map, props) {"use strict";
    var locations = this.props.locations;
    var markers = [];

    if (locations.length == 0) {
      map.setCenter(this.getMapCenterLatLng());
    }

    this.props.locations.forEach(function(location, index)  {
      markers.push(this.createMarker(map, props, index));
    }.bind(this));

    this.setState({
      markers: markers
    });
  }});

  Object.defineProperty(GoogleMaps.prototype,"createMarker",{writable:true,configurable:true,value:function(map, props, index) {"use strict";
    var location = props.locations[index];
    var myLatLng = new google.maps.LatLng(location.latitude, location.longitude);
    var icon, markerOptions = {
      position: myLatLng,
      map: map,
      title: location.customField1,
      draggable: true,
      animation: google.maps.Animation.DROP,
    };

    if (location.iconUrl) {
      markerOptions['icon'] = {
        url: location.iconUrl,
        size: new google.maps.Size(40, 40),
      };
    }

    var marker = new google.maps.Marker(markerOptions);

    var content = '';

    if (location.embedCode) {
      content += '<p>' + location.embedCode + '</p>';
    }
      
    content +=
      ("<p>" + props.customLabel1 + ": ") + location.customField1 + '</p>' +
      ("<p>" + props.customLabel2 + ": ") + location.customField2 + '</p>';

    map.setCenter(marker.getPosition());

    google.maps.event.addListener(marker, 'click', function()  {
      if (this.state.infowindow){
        this.state.infowindow.close();
      }

      var infowindow = new google.maps.InfoWindow({ content: content });
      infowindow.open(map, marker);

      this.setState({
        infowindow: infowindow,
      });
    }.bind(this));

    google.maps.event.addListener(marker, 'dragend', function()  {
      var point = marker.getPosition();

      props.onDragMarker({
        index: index,
        lat: point.A,
        lng: point.F
      });
    });

    return marker;
  }});

  Object.defineProperty(GoogleMaps.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
    return (
      React.createElement("div", {style: {
        height: ("calc(" + this.props.height + ")")
      }})
    )
  }});


GoogleMaps.propTypes = {
  height: React.PropTypes.string,
  initialZoom: React.PropTypes.number,
  locations: React.PropTypes.array,
  mapCenterLat: React.PropTypes.number.isRequired,
  mapCenterLng: React.PropTypes.number.isRequired,
  customLabel1: React.PropTypes.string.isRequired,
  customLabel2: React.PropTypes.string.isRequired,
}

GoogleMaps.defaultProps = {
  height: '100vh',
  initialZoom: 16,
  locations: [],
}