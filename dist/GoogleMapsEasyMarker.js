var ____Class1=React.Component;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){GoogleMapsEasyMarker[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;GoogleMapsEasyMarker.prototype=Object.create(____SuperProtoOf____Class1);GoogleMapsEasyMarker.prototype.constructor=GoogleMapsEasyMarker;GoogleMapsEasyMarker.__superConstructor__=____Class1;
  function GoogleMapsEasyMarker(props) {"use strict";
    ____Class1.call(this,props);

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

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"componentDidUpdate",{writable:true,configurable:true,value:function() {"use strict";
    if (this.state.editCustomLabel1) {
      this.refs.customLabelText1.getDOMNode().focus();
    }

    if (this.state.editCustomLabel2) {
      this.refs.customLabelText2.getDOMNode().focus();
    }
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"handleMarkerAddClick",{writable:true,configurable:true,value:function(e) {"use strict";
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

    this.getGeoByAddress(customField2, function(results)  {
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
    }.bind(this));
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"handleMarkerChange",{writable:true,configurable:true,value:function(data) {"use strict";
    var locations = this.state.locations;
    locations[data.index]['latitude'] = data.lat.toFixed(7);
    locations[data.index]['longitude'] = data.lng.toFixed(7);

    this.setState({
      locations: locations
    });
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"handleMarkerRemoveClick",{writable:true,configurable:true,value:function(index, e) {"use strict";
    var locations = this.state.locations;
    locations.splice(index, 1);

    this.setState({
      locations: locations
    });
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"handleFlip",{writable:true,configurable:true,value:function() {"use strict";
    this.setState({
      flipped: !this.state.flipped
    });
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"handleCustomLabel1Click",{writable:true,configurable:true,value:function(e) {"use strict";
    var state = {
      editCustomLabel1: !this.state.editCustomLabel1
    };

    if (this.state.editCustomLabel1) {
      state['customLabel1'] = this.refs.customLabelText1.getDOMNode().value;
    }

    this.setState(state);
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"handleCustomLabel2Click",{writable:true,configurable:true,value:function(e) {"use strict";
    var state = {
      editCustomLabel2: !this.state.editCustomLabel2
    };

    if (this.state.editCustomLabel2) {
      state['customLabel2'] = this.refs.customLabelText2.getDOMNode().value;
    }

    this.setState(state);
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"getGeoByAddress",{writable:true,configurable:true,value:function(address, callback) {"use strict";
    $.ajax({
      url: "//maps.google.com/maps/api/geocode/json",
      type: 'get',
      dataType: 'json',
      data: {address: address},
    })
    .done(function(data, status, xhr)  {
      callback(data.results);
    })
    .fail(function(xhr, options, err)  {
    })
    .always(function(xhr, status)  {
    });
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"getHtmlSorceCode",{writable:true,configurable:true,value:function() {"use strict";
    var code =
      ("<!DOCTYPE html>\n      <html>\n        <head>\n          <title>Google Maps Easy Marker</title>\n          <meta name=\"viewport\" content=\"initial-scale=1.0, user-scalable=no\">\n          <meta charset=\"utf-8\">\n          <style>\n            html, body, #map-canvas { height: 100%; margin: 0; padding: 0; }\n          </style>\n          <script src=\"https://maps.googleapis.com/maps/api/js?v=3.exp\"></script>\n          <script>\n          " + 










this.getJavascriptSorceCode() + "\n          </script>\n        </head>\n        <body>\n          <div id=\"map-canvas\"></div>\n        </body>\n      </html>"





);

    code = html_beautify(code, { indent_size: 2 });

    return code;
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"getJavascriptSorceCode",{writable:true,configurable:true,value:function() {"use strict";
    var locationData = ("var locations = [") + '\n';

    this.state.locations.forEach(function(location)  {
      locationData += '{' + '\n';

      if (location.iconUrl) {
        locationData += ("iconUrl: \"" + location.iconUrl + "\",");
      }

      if (location.embedCode) {
        locationData += ("embedCode: \"" + location.embedCode + "\",");
      }

      locationData += ("customField1: \"" + location.customField1 + "\",");
      locationData += ("customField2: \"" + location.customField2 + "\",");
      locationData += ("latitude: " + location.latitude + ",");
      locationData += ("longitude: " + location.longitude + ",");
      locationData += '},';
    });
    locationData += '];';

    var code = ("\n      var infowindow;\n      (function () {\n        google.maps.Map.prototype.markers = new Array();\n\n        google.maps.Map.prototype.addMarker = function(marker) {\n          this.markers[this.markers.length] = marker;\n        };\n\n        google.maps.Map.prototype.getMarkers = function() {\n          return this.markers\n        };\n\n        google.maps.Map.prototype.clearMarkers = function() {\n          if(infowindow) {\n            infowindow.close();\n          }\n\n          this.markers.forEach(function(marker) {\n            marker.setMap(null);\n          });\n        };\n      })();\n\n      function initialize() {\n        var mapOptions = {\n          zoom: 16,\n          center: new google.maps.LatLng(25.0805793, 121.5227904),\n        };\n        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);\n\n        setMarkers(map, locations);\n      }\n\n      " + 

































locationData + "\n\n      function createMarker(map, location) {\n        var myLatLng = new google.maps.LatLng(location.latitude, location.longitude);\n        var icon, markerOptions = {\n          position: myLatLng,\n          map: map,\n          title: location.customField1,\n        };\n\n        if (location.iconUrl) {\n          markerOptions['icon'] = {\n            url: location.iconUrl,\n            size: new google.maps.Size(40, 40),\n          };\n        }\n\n        var marker = new google.maps.Marker(markerOptions);\n        var content = '';\n\n        if (location.embedCode) {\n          content += '<p>' + location.embedCode + '</p>';\n        }\n\n        content +=\n          '<p>" + 
























this.state.customLabel1 + "：' + location.customField1 + '</p>' +\n          '<p>" + 
this.state.customLabel2 + "：' + location.customField2 + '</p>';\n\n        map.setCenter(marker.getPosition());\n\n        google.maps.event.addListener(marker, 'click', function() {\n          if (infowindow) infowindow.close();\n          infowindow = new google.maps.InfoWindow({content: content});\n          infowindow.open(map, marker);\n        });\n\n        return marker;\n      }\n\n      function setMarkers(map, locations) {\n         locations.forEach(function(location) {\n          map.addMarker(createMarker(map, location));\n        });\n      }\n      google.maps.event.addDomListener(window, 'load', initialize);"

















);

    code = js_beautify(code, { indent_size: 2 });

    return code;
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"getMarkerFormComponent",{writable:true,configurable:true,value:function() {"use strict";
    return (
      React.createElement("div", {className: "form-horizontal"}, 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {htmlFor: "iconUrl", className: "col-sm-3 control-label"}, "Marker Icon URL"), 
          React.createElement("div", {className: "col-sm-9"}, 
            React.createElement("input", {type: "text", className: "form-control", id: "iconUrl", ref: "iconUrl"})
          )
        ), 

        React.createElement("div", {className: this.state.customFieldError1 ? 'form-group has-error' : 'form-group'}, 
           !this.state.editCustomLabel1 &&
            React.createElement("label", {className: "col-sm-3 control-label", onClick: this.handleCustomLabel1Click.bind(this)}, this.state.customLabel1), 
          
           this.state.editCustomLabel1 &&
            React.createElement("div", {className: "col-sm-3"}, 
              React.createElement("input", {type: "text", className: "form-control", id: "customLabelText1", ref: "customLabelText1", defaultValue: this.state.customLabel1, onBlur: this.handleCustomLabel1Click.bind(this)})
            ), 
          
          React.createElement("div", {className: "col-sm-9"}, 
            React.createElement("input", {type: "text", className: "form-control", id: "customField1", ref: "customField1"})
          )
        ), 

        React.createElement("div", {className: this.state.customFieldError2 ? 'form-group has-error' : 'form-group'}, 
           !this.state.editCustomLabel2 &&
            React.createElement("label", {className: "col-sm-3 control-label", onClick: this.handleCustomLabel2Click.bind(this)}, this.state.customLabel2), 
          
           this.state.editCustomLabel2 &&
            React.createElement("div", {className: "col-sm-3"}, 
              React.createElement("input", {type: "text", className: "form-control", id: "customLabelText2", ref: "customLabelText2", defaultValue: this.state.customLabel2, onBlur: this.handleCustomLabel2Click.bind(this)})
            ), 
          
          React.createElement("div", {className: "col-sm-9"}, 
            React.createElement("input", {type: "text", className: "form-control", id: "customField2", "data-toggle": "tooltip", "data-placement": "top", title: "Find lat and lng by this field", ref: "customField2"})
          )
        ), 

        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {htmlFor: "embedCode", className: "col-sm-3 control-label"}, "Embed Code"), 
          React.createElement("div", {className: "col-sm-9"}, 
            React.createElement("textarea", {rows: "6", className: "form-control", id: "embedCode", ref: "embedCode"})
          )
        ), 

        React.createElement("div", {className: "form-group"}, 
          React.createElement("div", {className: "col-sm-offset-3 col-sm-9"}, 
            React.createElement("button", {className: "btn btn-default", onClick: this.handleMarkerAddClick.bind(this)}, "Add"), 
            " ", 
            React.createElement("button", {className: "btn btn-success", onClick: this.handleFlip.bind(this)}, "Show Source Code")
          )
        )
      )
    )
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"getLocationListItemsComponent",{writable:true,configurable:true,value:function() {"use strict";
    var locations = this.state.locations.map(function(marker, index)  {
      var icon = '-',
          embedCode = '-';
      
      if (marker.iconUrl) {
        icon = React.createElement("img", {src: marker.iconUrl, className: "img-responsive"});
      }

      if (marker.embedCode) {
        embedCode = marker.embedCode;
      }

      return (
        React.createElement("tr", {key: index}, 
          React.createElement("td", null, icon), 
          React.createElement("td", null, marker.customField1), 
          React.createElement("td", null, marker.customField2), 
          React.createElement("td", null, embedCode), 
          React.createElement("td", null, marker.latitude), 
          React.createElement("td", null, marker.longitude), 
          React.createElement("td", null, 
            React.createElement("button", {className: "btn btn-danger btn-xs", onClick: this.handleMarkerRemoveClick.bind(this, index)}, 
              React.createElement("i", {className: "glyphicon glyphicon-trash"})
            )
          )
        )
      )
    }.bind(this));

    return (
      React.createElement("table", {className: "table table-striped"}, 
        React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", {className: "col-md-1"}, "Icon"), 
            React.createElement("th", null, this.state.customLabel1), 
            React.createElement("th", null, this.state.customLabel2), 
            React.createElement("th", null, "Embed Code"), 
            React.createElement("th", null, "Latitude"), 
            React.createElement("th", null, "Longitude"), 
            React.createElement("th", null)
          )
        ), 
        React.createElement("tbody", null, 
          locations
        )
      )
    )
  }});

  Object.defineProperty(GoogleMapsEasyMarker.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
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
      React.createElement("div", {style: {
        display: 'flex',
        width: ("calc(" + this.props.width + ")"),
        height: ("calc(" + this.props.height + ")"),
      }}, 
        React.createElement("div", {style: {width: '50%'}}, 
          React.createElement(GoogleMaps, {
            height: this.props.height, 
            locations: this.state.locations, 
            mapCenterLat: this.props.mapCenterLat, 
            mapCenterLng: this.props.mapCenterLng, 
            customLabel1: this.state.customLabel1, 
            customLabel2: this.state.customLabel2, 
            onDragMarker: this.handleMarkerChange.bind(this)}
          )
        ), 

        React.createElement("div", {style: {width: '50%', backgroundColor: '#eee'}}, 
          React.createElement("div", {
            className: "flip-container" + (this.state.flipped ? " flipped" : ""), 
            style: {
              perspective: 1000,
              width: '100%',
              height: ("calc(" + this.props.height + ")"),
            }
          }, 
            React.createElement("div", {className: "flipper", 
              style: {
                transition: '0.6s',
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                MozTransformStyle: 'preserve-3d',
                msTransformStyle: 'preserve-3d',
                position: 'relative',
                transform: (this.state.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'),
              }
            }, 
              React.createElement("div", {className: "front", 
                style: frontStyle
              }, 
                this.getMarkerFormComponent(), 
                this.getLocationListItemsComponent()
              ), 

              React.createElement("div", {className: "back", 
                style: backStyle
              }, 
                React.createElement("div", {className: "row"}, 
                  React.createElement("p", null, 
                    React.createElement("button", {className: "btn btn-default", onClick: this.handleFlip.bind(this)}, "Close")
                  )
                ), 

                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "panel panel-info"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                      React.createElement("h3", {className: "panel-title"}, "JAVASCRIPT")
                    ), 
                    React.createElement("div", {className: "panel-body", style: {height: '33vh', overflow: 'auto'}}, 
                      React.createElement(Highlight, {className: "javascript"}, 
                        this.getJavascriptSorceCode()
                      )
                    )
                  )
                ), 

                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "panel panel-info"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                      React.createElement("h3", {className: "panel-title"}, "JAVASCRIPT + HTML")
                    ), 
                    React.createElement("div", {className: "panel-body", style: {height: '33vh', overflow: 'auto'}}, 
                      React.createElement(Highlight, {className: "html"}, 
                        this.getHtmlSorceCode()
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  }});


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