class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      infowindow: null,
    };
  }

  componentDidMount() {
    var mapOptions = {
      center: this.getMapCenterLatLng(),
      zoom: this.props.initialZoom,
    };

    var map = new google.maps.Map(React.findDOMNode(this), mapOptions);

    this.setMarkers(map, this.props);

    this.setState({
      map: map
    });
  }

  componentWillReceiveProps(props) {
    var map = this.state.map;

    this.state.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.setMarkers(map, props);

    this.setState({
      map: map
    });
  }

  getMapCenterLatLng() {
    return new google.maps.LatLng(this.props.mapCenterLat, this.props.mapCenterLng);
  }

  setMarkers(map, props) {
    var locations = this.props.locations;
    var markers = [];

    if (locations.length == 0) {
      map.setCenter(this.getMapCenterLatLng());
    }

    this.props.locations.forEach((location, index) => {
      markers.push(this.createMarker(map, props, index));
    });

    this.setState({
      markers: markers
    });
  }

  createMarker(map, props, index) {
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
      `<p>${props.customLabel1}: ` + location.customField1 + '</p>' +
      `<p>${props.customLabel2}: ` + location.customField2 + '</p>';

    map.setCenter(marker.getPosition());

    google.maps.event.addListener(marker, 'click', () => {
      if (this.state.infowindow){
        this.state.infowindow.close();
      }

      var infowindow = new google.maps.InfoWindow({ content: content });
      infowindow.open(map, marker);

      this.setState({
        infowindow: infowindow,
      });
    });

    google.maps.event.addListener(marker, 'dragend', () => {
      var point = marker.getPosition();

      props.onDragMarker({
        index: index,
        lat: point.A,
        lng: point.F
      });
    });

    return marker;
  }

  render() {
    return (
      <div style={{
        height: `calc(${this.props.height})`
      }}></div>
    )
  }
}

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