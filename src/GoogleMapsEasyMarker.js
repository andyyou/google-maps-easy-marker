class GoogleMapsEasyMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      flipped: false,
      customLabel1: props.customLabel1,
      customLabel2: props.customLabel2,
      editCustomLabel1: false,
      editCustomLabel2: false,
      customFieldError1: false,
      customFieldError2: false,
    }
  }

  componentDidUpdate() {
    if (this.state.editCustomLabel1) {
      this.refs.customLabelText1.getDOMNode().focus();
    }

    if (this.state.editCustomLabel2) {
      this.refs.customLabelText2.getDOMNode().focus();
    }
  }

  handleMarkerAddClick(e) {
    var iconUrl = this.refs.iconUrl.getDOMNode().value,
        embedCode = this.refs.embedCode.getDOMNode().value,
        customField1 = this.refs.customField1.getDOMNode().value,
        customField2 = this.refs.customField2.getDOMNode().value,
        customFieldError1 = false,
        customFieldError2 = false;

    if (!customField1) {
      customFieldError1 = true;
    }

    if (!customField2) {
      customFieldError2 = true;
    }

    if (customFieldError1 || customFieldError2) {
      this.setState({
        customFieldError1: customFieldError1,
        customFieldError2: customFieldError2
      });

      return;
    }

    this.getGeoByAddress(customField2, (results) => {
      var latitude = this.props.mapCenterLat,
          longitude = this.props.mapCenterLng;

      if (results.length != 0) {
        latitude = results[0].geometry.location.lat;
        longitude = results[0].geometry.location.lng;
      }

      var location = {};
      location['customField1'] = customField1;
      location['customField2'] = customField2;
      location['latitude'] = latitude;
      location['longitude'] = longitude;

      if (iconUrl) {
        location['iconUrl'] = iconUrl;
      }
      if (embedCode) {
        location['embedCode'] = embedCode;
      }

      var locations = this.state.locations;
      locations.push(location);

      this.setState({
        locations: locations,
        customFieldError1: customFieldError1,
        customFieldError2: customFieldError2
      });

      // Clean up form
      this.refs.iconUrl.getDOMNode().value = "";
      this.refs.embedCode.getDOMNode().value = "";
      this.refs.customField1.getDOMNode().value = "";
      this.refs.customField2.getDOMNode().value = "";
    });
  }

  handleMarkerChange(data) {
    var locations = this.state.locations;
    locations[data.index]['latitude'] = data.lat.toFixed(7);
    locations[data.index]['longitude'] = data.lng.toFixed(7);

    this.setState({
      locations: locations
    });
  }

  handleMarkerRemoveClick(index, e) {
    var locations = this.state.locations;
    locations.splice(index, 1);

    this.setState({
      locations: locations
    });
  }

  handleFlip() {
    this.setState({
      flipped: !this.state.flipped
    });
  }

  handleCustomLabel1Click(e) {
    var state = {
      editCustomLabel1: !this.state.editCustomLabel1
    };

    if (this.state.editCustomLabel1) {
      state['customLabel1'] = this.refs.customLabelText1.getDOMNode().value;
    }

    this.setState(state);
  }

  handleCustomLabel2Click(e) {
    var state = {
      editCustomLabel2: !this.state.editCustomLabel2
    };

    if (this.state.editCustomLabel2) {
      state['customLabel2'] = this.refs.customLabelText2.getDOMNode().value;
    }

    this.setState(state);
  }

  getGeoByAddress(address, callback) {
    $.ajax({
      url: "//maps.google.com/maps/api/geocode/json",
      type: 'get',
      dataType: 'json',
      data: {address: address},
    })
    .done((data, status, xhr) => {
      callback(data.results);
    })
    .fail((xhr, options, err) => {
    })
    .always((xhr, status) => {
    });
  }

  getHtmlSorceCode() {
    var code =
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Google Maps Easy Marker</title>
          <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
          <meta charset="utf-8">
          <style>
            html, body, #map-canvas { height: 100%; margin: 0; padding: 0; }
          </style>
          <script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>
          <script>
          ${this.getJavascriptSorceCode()}
          </script>
        </head>
        <body>
          <div id="map-canvas"></div>
        </body>
      </html>`;

    code = html_beautify(code, { indent_size: 2 });

    return code;
  }

  getJavascriptSorceCode() {
    var locationData = `var locations = [` + '\n';

    this.state.locations.forEach(location => {
      locationData += '{' + '\n';

      if (location.iconUrl) {
        locationData += `iconUrl: "${location.iconUrl}",`;
      }

      if (location.embedCode) {
        locationData += `embedCode: "${location.embedCode}",`;
      }

      locationData += `customField1: "${location.customField1}",`;
      locationData += `customField2: "${location.customField2}",`;
      locationData += `latitude: ${location.latitude},`;
      locationData += `longitude: ${location.longitude},`;
      locationData += '},';
    });
    locationData += '];';

    var code = `
      var infowindow;
      (function () {
        google.maps.Map.prototype.markers = new Array();

        google.maps.Map.prototype.addMarker = function(marker) {
          this.markers[this.markers.length] = marker;
        };

        google.maps.Map.prototype.getMarkers = function() {
          return this.markers
        };

        google.maps.Map.prototype.clearMarkers = function() {
          if(infowindow) {
            infowindow.close();
          }

          this.markers.forEach(function(marker) {
            marker.setMap(null);
          });
        };
      })();

      function initialize() {
        var mapOptions = {
          zoom: 16,
          center: new google.maps.LatLng(25.0805793, 121.5227904),
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        setMarkers(map, locations);
      }

      ${locationData}

      function createMarker(map, location) {
        var myLatLng = new google.maps.LatLng(location.latitude, location.longitude);
        var icon, markerOptions = {
          position: myLatLng,
          map: map,
          title: location.customField1,
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
          '<p>${this.state.customLabel1}：' + location.customField1 + '</p>' +
          '<p>${this.state.customLabel2}：' + location.customField2 + '</p>';

        map.setCenter(marker.getPosition());

        google.maps.event.addListener(marker, 'click', function() {
          if (infowindow) infowindow.close();
          infowindow = new google.maps.InfoWindow({content: content});
          infowindow.open(map, marker);
        });

        return marker;
      }

      function setMarkers(map, locations) {
         locations.forEach(function(location) {
          map.addMarker(createMarker(map, location));
        });
      }
      google.maps.event.addDomListener(window, 'load', initialize);`;

    code = js_beautify(code, { indent_size: 2 });

    return code;
  }

  getMarkerFormComponent() {
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label htmlFor="iconUrl" className="col-sm-3 control-label">Marker Icon URL</label>
          <div className="col-sm-9">
            <input type="text" className="form-control" id="iconUrl" ref="iconUrl" />
          </div>
        </div>

        <div className={this.state.customFieldError1 ? 'form-group has-error' : 'form-group'}>
          { !this.state.editCustomLabel1 &&
            <label className="col-sm-3 control-label" onClick={this.handleCustomLabel1Click.bind(this)}>{this.state.customLabel1}</label>
          }
          { this.state.editCustomLabel1 &&
            <div className="col-sm-3">
              <input type="text" className="form-control" id="customLabelText1" ref="customLabelText1" defaultValue={this.state.customLabel1} onBlur={this.handleCustomLabel1Click.bind(this)} />
            </div>
          }
          <div className="col-sm-9">
            <input type="text" className="form-control" id="customField1" ref="customField1" />
          </div>
        </div>

        <div className={this.state.customFieldError2 ? 'form-group has-error' : 'form-group'}>
          { !this.state.editCustomLabel2 &&
            <label className="col-sm-3 control-label" onClick={this.handleCustomLabel2Click.bind(this)}>{this.state.customLabel2}</label>
          }
          { this.state.editCustomLabel2 &&
            <div className="col-sm-3">
              <input type="text" className="form-control" id="customLabelText2" ref="customLabelText2" defaultValue={this.state.customLabel2} onBlur={this.handleCustomLabel2Click.bind(this)} />
            </div>
          }
          <div className="col-sm-9">
            <input type="text" className="form-control" id="customField2" data-toggle="tooltip" data-placement="top" title="Find lat and lng by this field" ref="customField2" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="embedCode" className="col-sm-3 control-label">Embed Code</label>
          <div className="col-sm-9">
            <textarea rows="6" className="form-control" id="embedCode" ref="embedCode" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-3 col-sm-9">
            <button className="btn btn-default" onClick={this.handleMarkerAddClick.bind(this)}>Add</button>
            &nbsp;
            <button className="btn btn-success" onClick={this.handleFlip.bind(this)}>Show Source Code</button>
          </div>
        </div>
      </div>
    )
  }

  getLocationListItemsComponent() {
    var locations = this.state.locations.map((marker, index) => {
      var icon = '-',
          embedCode = '-';
      
      if (marker.iconUrl) {
        icon = <img src={marker.iconUrl} className="img-responsive" />;
      }

      if (marker.embedCode) {
        embedCode = marker.embedCode;
      }

      return (
        <tr key={index}>
          <td>{icon}</td>
          <td>{marker.customField1}</td>
          <td>{marker.customField2}</td>
          <td>{embedCode}</td>
          <td>{marker.latitude}</td>
          <td>{marker.longitude}</td>
          <td>
            <button className="btn btn-danger btn-xs" onClick={this.handleMarkerRemoveClick.bind(this, index)}>
              <i className="glyphicon glyphicon-trash"></i>
            </button>
          </td>
        </tr>
      )
    });

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="col-md-1">Icon</th>
            <th>{this.state.customLabel1}</th>
            <th>{this.state.customLabel2}</th>
            <th>Embed Code</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {locations}
        </tbody>
      </table>
    )
  }

  render() {
    var frontBackCommonStyle = {
      overflow: 'auto',
      width: '100%',
      padding: '20px',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      MozBackfaceVisibility: 'hidden',
      msBackfaceVisibility: 'hidden',
      position: 'absolute',
      top: '0',
      left: '0',
    };

    var frontStyle = $.extend(true, {}, frontBackCommonStyle);
    frontStyle['zIndex'] = '2';
    frontStyle['transform'] = 'rotateY(0deg)';
    frontStyle['WebkitTransform'] = 'rotateY(0deg)';
    frontStyle['MozTransform'] = 'rotateY(0deg)';
    frontStyle['msTransform'] = 'rotateY(0deg)';

    var backStyle = $.extend(true, {}, frontBackCommonStyle);
    backStyle['transform'] = 'rotateY(180deg)';
    backStyle['WebkitTransform'] = 'rotateY(180deg)';
    backStyle['MozTransform'] = 'rotateY(180deg)';
    backStyle['msTransform'] = 'rotateY(180deg)';

    return (
      <div style={{
        display: 'flex',
        width: `calc(${this.props.width})`,
        height: `calc(${this.props.height})`,
      }}>
        <div style={{width: '50%'}}>
          <GoogleMaps
            height={this.props.height}
            locations={this.state.locations}
            mapCenterLat={this.props.mapCenterLat}
            mapCenterLng={this.props.mapCenterLng}
            customLabel1={this.state.customLabel1}
            customLabel2={this.state.customLabel2}
            onDragMarker={this.handleMarkerChange.bind(this)}
          />
        </div>

        <div style={{width: '50%', backgroundColor: '#eee'}}>
          <div
            className={"flip-container" + (this.state.flipped ? " flipped" : "")}
            style={{
              perspective: 1000,
              width: '100%',
              height: `calc(${this.props.height})`,
            }}
          >
            <div className="flipper"
              style={{
                transition: '0.6s',
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                MozTransformStyle: 'preserve-3d',
                msTransformStyle: 'preserve-3d',
                position: 'relative',
                transform: (this.state.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'),
              }}
            >
              <div className="front"
                style={frontStyle}
              >
                {this.getMarkerFormComponent()}
                {this.getLocationListItemsComponent()}
              </div>

              <div className="back"
                style={backStyle}
              >
                <div className="row">
                  <p>
                    <button className="btn btn-default" onClick={this.handleFlip.bind(this)}>Close</button>
                  </p>
                </div>

                <div className="row">
                  <div className="panel panel-info">
                    <div className="panel-heading">
                      <h3 className="panel-title">JAVASCRIPT</h3>
                    </div>
                    <div className="panel-body" style={{height: '33vh', overflow: 'auto'}}>
                      <Highlight className='javascript'>
                        {this.getJavascriptSorceCode()}
                      </Highlight>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="panel panel-info">
                    <div className="panel-heading">
                      <h3 className="panel-title">JAVASCRIPT + HTML</h3>
                    </div>
                    <div className="panel-body" style={{height: '33vh', overflow: 'auto'}}>
                      <Highlight className='html'>
                        {this.getHtmlSorceCode()}
                      </Highlight>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

GoogleMapsEasyMarker.propTypes = {
  width: React.PropTypes.string,
  height: React.PropTypes.string,
  mapCenterLat: React.PropTypes.number,
  mapCenterLng: React.PropTypes.number,
  customLabel1: React.PropTypes.string,
  customLabel2: React.PropTypes.string,
}

GoogleMapsEasyMarker.defaultProps = {
  width: '100vw',
  height: '100vh',
  mapCenterLat: 25.0805793,
  mapCenterLng: 121.5227904,
  customLabel1: 'Title',
  customLabel2: 'Address',
}