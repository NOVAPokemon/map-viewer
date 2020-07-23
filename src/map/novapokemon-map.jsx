import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import DeckGL from '@deck.gl/react';
import { InteractiveMap, StaticMap } from 'react-map-gl';
import { S2 } from 's2-geometry';
import { MapboxLayer } from '@deck.gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMarkers, getPolygonsForServerBoundaries, getActiveCellsLayer, getLabelsForServerConfigs } from './utils.js';
import { MapView, FirstPersonView } from '@deck.gl/core';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoibm1tb3JhaXMiLCJhIjoiY2tjb2tyMm5kMG0ycDJ0cXk5ZnMzN2xtdCJ9.yJU5AQ73pA6zdxaBht0wgQ'

const trainerCellLevel = 17

function NovapokemonMap() {

  // DeckGL and mapbox will both draw into this WebGL context
  const [glContext, setGLContext] = useState();
  const deckRef = useRef(null);
  const mapRef = useRef(null);
  const [activeCells, setActiveCells] = useState([]);
  const [activePokemons, setActivePokemons] = useState([]);
  const [serverBoundaries, setServerBoundaries] = useState([]);
  const [viewport, setViewport] = useState({
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 17,
    pitch: 0,
    bearing: 0
  });


  useEffect(() => {
    async function fetchActiveCells() {
      axios(
        'http://localhost:30002/location/location/active/cells/all',
      ).then(promise => {
        if (!!promise.data) {
          if (promise.data.length > 0) {
            setActiveCells(promise.data);
            let latLng = S2.idToLatLng(promise.data[0].cell_id)
            setViewport({ ...viewport, latitude: latLng.lat, longitude: latLng.lng })
            alert("loaded " + promise.data.length + " active cells")
          }
        } else {
          alert("No active tiles")
        }
      })
        .catch(e => {
          alert(e)
        })
    }

    async function fetchActivePokemons() {
      axios(
        'http://localhost:30002/location/location/active/pokemons/all',
      ).then(promise => {
        if (!!promise.data) {
          if (promise.data.length > 0) {
            setActivePokemons(promise.data)
            alert("loaded " + promise.data.length + " pokemons")
          }
        } else {
          alert("No active tiles")
        }
      })
        .catch(e => {
          alert(e)
        })
    }

    async function fetchServerConfigs() {
      axios(
        'http://localhost:30002/location/location/configs',
      ).then(promise => {
        if (!!promise.data) {
          setServerBoundaries(promise.data);
        } else {
          alert("Could not load server boundaries")
        }
      })
        .catch(e => {
          alert(e)
        })
    }

    //fetchActivePokemons();
    fetchActiveCells();
    fetchServerConfigs();
  }, []);


  const layers = [
    getActiveCellsLayer(activeCells),
    getPolygonsForServerBoundaries(serverBoundaries, 0),
    getLabelsForServerConfigs(serverBoundaries, 0)
  ];

  return (
    <DeckGL
      ref={deckRef}
      initialViewState={viewport}
      layers={layers}
      controller={true}
      onWebGLInitialized={(gl) => setGLContext(gl)}
      glOptions={{
        stencil: true
      }}
    >
      <MapView id="map" width="100%" controller={true}>
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </MapView>
    </DeckGL>
  );
}

export default NovapokemonMap;



/*
  activeCells.map((entry, idx) => {
    if (entry.trainers_nr > maxTrainersInCell) {
      maxTrainersInCell = entry.trainers_nr
    }

    if (entry.trainers_nr < minTrainersInCell) {
      minTrainersInCell = entry.trainers_nr
    }
  })
*/
/*
let markersGeoJson = activeCells.map((entry, idx) => {
  let latLng = S2.idToLatLng(entry.cell_id)
  //    return (< Marker key={idx} position={latLng} />)
  /*
  var circleMarker = L.circleMarker(latLng, {
    renderer: myRenderer,
    color: '#3388ff'
  }).addTo(map);
})

    const polygons = activeCells.map((entry, idx) => {
      let latLng = S2.idToLatLng(entry.cell_id)
      //console.log(latLng)
      let cell = S2.S2Cell.FromLatLng(latLng, trainerCellLevel);
      let corners = cell.getCornerLatLngs()
      let colorPerc = entry.trainers_nr * 1.0 / max
      let polyColor = perc2color(colorPerc)

      return (<Polygon key={idx} color={polyColor} positions={corners} />)
    })
    */

