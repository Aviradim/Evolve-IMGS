const center_x = 117.7;
const center_y = 238.8;
const scale_x = 0.0285;
const scale_y = 0.02844;

var map;
var grid;

function getGridCellIndex(currentLatLng) {
  const northwest = L.latLng(8396.62, -4129.82);
  const southeast = L.latLng(-5105.48, 4851.53);
  const offset = 115;

  const latIndex = Math.floor((northwest.lat - currentLatLng.lat) / offset);
  const lngIndex = Math.floor((currentLatLng.lng - northwest.lng) / offset);

  const numRows = Math.ceil((northwest.lat - southeast.lat) / offset);
  const numCols = Math.ceil((southeast.lng - northwest.lng) / offset);

  const cellIndex = latIndex * numCols + lngIndex;

  return cellIndex;
}

function generateLatLngGrid() {
  let grid = [];
  const northwest = L.latLng(8396.62, -4129.82);
  const southeast = L.latLng(-5105.48, 4851.53);


  let currentLat = northwest.lat;
  while (currentLat > southeast.lat) {
    let currentLng = northwest.lng;
    while (currentLng < southeast.lng) {
      grid.push(L.latLng(currentLat, currentLng));
      currentLng += 115;
    }
    currentLat -= 115;
  }

  return grid;
}

CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
  projection: L.Projection.LonLat,
  scale: function (zoom) {

    return Math.pow(2, zoom);
  },
  zoom: function (sc) {

    return Math.log(sc) / 0.6931471805599453;
  },
  distance: function (pos1, pos2) {
    const x_difference = pos2.lng - pos1.lng;
    const y_difference = pos2.lat - pos1.lat;
    return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
  },
  transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
  infinite: true
});

var BlackStyle = L.tileLayer('mapStyles/styleBlack/{z}/{x}/{y}.png', { minZoom: 0, maxZoom: 5, noWrap: true, continuousWorld: false, attribution: 'Gang Map', id: 'styleBlack map', });

var ExampleGroup = L.layerGroup();

var Icons = {
};

map = L.map('map', {
  crs: CUSTOM_CRS,
  minZoom: 4,
  maxZoom: 5,
  Zoom: 5,
  maxNativeZoom: 5,
  preferCanvas: true,
  layers: [BlackStyle],
  center: [0, 0],
  zoom: 4,
  attributionControl: false
});

var layersControl = L.control.layers({ "Black": BlackStyle }, Icons).addTo(map);

var PlayerLocation = L.Layer.extend({
  initialize: function (latLng) {
    this._latLng = latLng;
  },

  onAdd: function (map) {
    this._map = map;

    let base = `<div class="player-location">
                  <div class="pulse-dot"></div>
                </div>`;

    let locationDiv = $('<div></div>')
      .addClass('player')
      .html(base)
      .get(0);

    this._container = locationDiv;
    map.getPanes().overlayPane.appendChild(this._container);

    map.on('moveend zoomend', this._update, this);
    this._update();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._container);
    map.off('moveend zoomend', this._update, this);
  },

  _update: function () {
    this._updatePosition();
  },

  _updatePosition: function () {
    let position = this._map.latLngToLayerPoint(this._latLng);
    L.DomUtil.setPosition(this._container, position);
  },
});


var zoneElement = L.Layer.extend({
  initialize: function (zoneType, zone, color, label) {
    this._latLng = grid[zone];
    this._zone = zone;
    this._color = color;
    this._label = label;
    this._zoneType = zoneType;
  },
  onAdd: function (map) {
    this._map = map;

    let base;

    if (this._zoneType == "multiplier") {


      base = '<div class="fight-zone" style="background-color: ' + hexToRgbCssVariable(this._color, 0.7) + ';cursor:pointer;" onclick="openZoneMenu(' + this._zone + ')">' +
        '      <svg viewBox="0 0 1024 1024" class="fight-icon" >' +
        '        <path' +
        '          d="M810 128q34 0 60 26t26 60v170h-86v-170h-170v-86h170zM810 810v-170h86v170q0 34-26 60t-60 26h-170v-86h170zM214 640v170h170v86h-170q-34 0-60-26t-26-60v-170h86zM128 214q0-34 26-60t60-26h170v86h-170v170h-86v-170z"' +
        '        ></path>' +
        '      </svg>' +
        '      <span class="fight-text">' + this._label + '</span>' +
        '    </div>';

    } else if (this._zoneType == "value") {


      base = '<div class="fight-zone visible" style="background-color: ' + hexToRgbCssVariable(this._color, 0.7) + ';cursor:pointer;" onclick="openZoneMenu(' + this._zone + ')">' +
        '      <svg viewBox="0 0 1024 1024" class="fight-icon04" style="fill: ' + hexToRgbCssVariable(this._color, 1.0) + '">' +
        '        <path' +
        '          d="M598 362q26 0 45 19t19 45-19 45-45 19-45-19-19-45 19-45 45-19zM598 534q26 0 45 19t19 45-19 45-45 19-45-19-19-45 19-45 45-19zM426 726q18 0 31 12t13 30-13 30-31 12-30-12-12-30 12-30 30-12zM426 362q26 0 45 19t19 45-19 45-45 19-45-19-19-45 19-45 45-19zM598 874q20 0 20 22t-20 22q-22 0-22-22t22-22zM598 726q18 0 30 12t12 30-12 30-30 12-31-12-13-30 13-30 31-12zM896 576q22 0 22 22 0 20-22 20t-22-20q0-22 22-22zM768 214q18 0 30 12t12 30-12 30-30 12-30-12-12-30 12-30 30-12zM768 384q18 0 30 12t12 30-12 31-30 13-30-13-12-31 12-30 30-12zM768 726q18 0 30 12t12 30-12 30-30 12-30-12-12-30 12-30 30-12zM768 554q18 0 30 13t12 31-12 30-30 12-30-12-12-30 12-31 30-13zM426 534q26 0 45 19t19 45-19 45-45 19-45-19-19-45 19-45 45-19zM426 298q-18 0-30-12t-12-30 12-30 30-12 31 12 13 30-13 30-31 12zM426 150q-20 0-20-22t20-22q22 0 22 22t-22 22zM426 874q22 0 22 22t-22 22q-20 0-20-22t20-22zM128 576q22 0 22 22 0 20-22 20t-22-20q0-22 22-22zM598 150q-22 0-22-22t22-22q20 0 20 22t-20 22zM598 298q-18 0-31-12t-13-30 13-30 31-12 30 12 12 30-12 30-30 12zM896 448q-22 0-22-22 0-20 22-20t22 20q0 22-22 22zM256 214q18 0 30 12t12 30-12 30-30 12-30-12-12-30 12-30 30-12zM128 406q22 0 22 20 0 22-22 22t-22-22q0-20 22-20zM256 384q18 0 30 12t12 30-12 31-30 13-30-13-12-31 12-30 30-12zM256 726q18 0 30 12t12 30-12 30-30 12-30-12-12-30 12-30 30-12zM256 554q18 0 30 13t12 31-12 30-30 12-30-12-12-30 12-31 30-13z"' +
        '        ></path>' +
        '      </svg>' +
        '      <svg viewBox="0 0 1024 1024" class="fight-icon02">' +
        '        <path' +
        '          d="M504 466q44 12 73 24t61 33 49 53 17 76q0 62-41 101t-109 51v92h-128v-92q-66-14-109-56t-47-108h94q8 90 126 90 62 0 89-23t27-53q0-72-128-104-200-46-200-176 0-58 42-99t106-55v-92h128v94q66 16 101 60t37 102h-94q-4-90-108-90-52 0-83 22t-31 58q0 58 128 92z"' +
        '        ></path></svg>' +
        '    </div>';

    } else if (this._zoneType == "house") {

      base = '<div class="fight-zone visible" style="background-color: ' + hexToRgbCssVariable(this._color, 0.7) + ';cursor:pointer;" onclick="openZoneMenu(' + this._zone + ')">' +
        '      <svg viewBox="0 0 1024 1024" class="fight-icon06" style="fill: ' + hexToRgbCssVariable(this._color, 1.0) + '">' +
        '        <path' +
        '          d="M396 896l500-500v122l-378 378h-122zM896 810q0 34-26 60t-60 26h-84l170-170v84zM214 128h84l-170 170v-84q0-34 26-60t60-26zM506 128h122l-500 500v-122zM832 132q50 14 62 60l-702 700q-46-14-60-60z"' +
        '        ></path></svg' +
        '      ><svg viewBox="0 0 1024 1024" class="fight-icon08">' +
        '        <path' +
        '          d="M426 854h-212v-342h-128l426-384 426 384h-128v342h-212v-256h-172v256z"' +
        '        ></path>' +
        '      </svg>' +
        '    </div>';

    } else if (this._zoneType == "continental") {

      base = '<div class="fight-zone visible" style="background-color: ' + hexToRgbCssVariable(this._color, 0.7) + ';cursor:pointer;" onclick="openZoneMenu(' + this._zone + ')">' +
        '      <svg viewBox="0 0 1024 1024" class="fight-icon10" style="fill: ' + hexToRgbCssVariable(this._color, 1.0) + '">' +
        '        <path' +
        '          d="M384 384v256h256v-256h-256zM298 726v-428h428v428h-428zM640 214v-86h86v86h-86zM640 896v-86h86v86h-86zM810 726v-86h86v86h-86zM810 384v-86h86v86h-86zM810 896v-86h86q0 34-26 60t-60 26zM810 554v-84h86v84h-86zM470 896v-86h84v86h-84zM384 128v86h-86v-86h86zM128 726v-86h86v86h-86zM214 896q-34 0-60-26t-26-60h86v86zM810 128q34 0 60 26t26 60h-86v-86zM554 128v86h-84v-86h84zM128 384v-86h86v86h-86zM298 896v-86h86v86h-86zM128 554v-84h86v84h-86zM128 214q0-34 26-60t60-26v86h-86z"' +
        '        ></path></svg' +
        '      ><svg viewBox="0 0 1024 1024" class="fight-icon12">' +
        '        <path' +
        '          d="M764 742q90-96 90-230 0-106-59-192t-155-124v18q0 34-26 59t-60 25h-84v86q0 18-13 30t-31 12h-84v86h256q18 0 30 12t12 30v128h42q60 0 82 60zM470 850v-82q-34 0-60-26t-26-60v-42l-204-204q-10 40-10 76 0 130 87 226t213 112zM512 86q176 0 301 125t125 301-125 301-301 125-301-125-125-301 125-301 301-125z"' +
        '        ></path>' +
        '      </svg>' +
        '    </div>';
    }

    let zoneDiv = $('<div></div>')
      .addClass('zone')
      .attr('zone', this._zone)
      .html(base)
      .get(0);

    this._container = zoneDiv;
    map.getPanes().overlayPane.appendChild(this._container);


    map.on('moveend zoomend', this._update, this);
    this._update();
  },
  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._container);
    map.off('moveend zoomend', this._update, this);
  },
  _update: function () {
    this._updatePosition();
    this._updateSize();
  },
  _updatePosition: function () {
    let position = this._map.latLngToLayerPoint(this._latLng);
    L.DomUtil.setPosition(this._container, position);
  },
  _updateSize: function () {
    let zoom = this._map.getZoom();
    let size = 100;
    let border = 20;

    if (zoom == 4) {
      size = 50;
      border = 10;
      $(this._container).find('.fight-wartime').css('font-size', '0px');
      $(this._container).find('.fight-icon').hide();
      $(this._container).find('.fight-text').css('font-size', '10px');
    }
    if (zoom == 5) {
      size = 100;
      border = 20;
      $(this._container).find('.fight-wartime').css('font-size', '15px');
      $(this._container).find('.fight-icon').show();
      $(this._container).find('.fight-text').css('font-size', '18px');
    }
    $(this._container).css({
      'width': size + 'px',
      'height': size + 'px',
      'border-radius': border + 'px',
    });
  }
});

grid = generateLatLngGrid();
