import { S2 } from 's2-geometry';
import { S2Layer } from '@deck.gl/geo-layers';
import { PolygonLayer, TextLayer } from '@deck.gl/layers';
import { randomColor } from "randomcolor";


export function getActiveCellsLayer(activeCells) {
    let data = []
    activeCells.forEach(element => {
        //console.log(element)
        let corners = element.cell_bounds.map(corners => {
            return [
                Math.min(179, Math.max(-179, corners[1])),
                Math.min(89, Math.max(-89, corners[0]))
            ]
        })
        //console.log(corners)
        data.push({ corners: corners })
    })

    let layer = new PolygonLayer({
        id: 'active-cells',
        data,
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: d => d.corners,
        getElevation: d => 1000,
        getFillColor: d => [160, 140, 150, 255],
        getLineColor: [80, 80, 80],
        getLineWidth: 1
    });
    console.log(layer)
    return layer
}

export function getLabelsForServerConfigs(configs, boundaryCellLevel) {
    let data = []
    if (!configs) {
        return data
    }
    configs.forEach(element => {
        if (element.ServerName && element.ServerName !== "") {
            element.cell_bounds.forEach(rectCorners => {
                let coordinates = [
                    (rectCorners[2][1] + rectCorners[0][1]) / 2,
                    (rectCorners[2][0] + rectCorners[0][0]) / 2]
                data.push({
                    coordinates: coordinates,
                    name: element.ServerName
                })
                //console.log(element.ServerName, rectCorners, coordinates)
            })
        }
    })
    //console.log("data", data)
    const layer = new TextLayer({
        id: 'text-layer',
        data,
        pickable: true,
        getPosition: d => d.coordinates,
        getText: d => d.name,
        getSize: 32,
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center'
    });
    //console.log(layer)
    return layer
}

export function getPolygonsForServerBoundaries(configs, boundaryCellLevel) {
    let data = []
    configs.forEach(element => {
        if (element.ServerName && element.ServerName !== "") {
            element.cell_bounds.forEach(rectCorners => {
                let corners = rectCorners.map(corner =>
                    [
                        Math.min(179, Math.max(-179, corner[1])),
                        Math.min(89, Math.max(-89, corner[0]))
                    ]
                )
                data.push({
                    corners: corners,
                    color: randomColor({
                        luminosity: 'bright',
                        format: 'rgbarray'
                    }),
                })
            })
        }
    })
    let layer = new PolygonLayer({
        id: 'server-boundaries',
        data,
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: d => d.corners,
        getElevation: d => 1000,
        getFillColor: d => d.color,
        getLineColor: [80, 80, 80],
        getLineWidth: 1
    });
    //console.log(layer)
    return layer
}


/*+

export function getPolygonsForServerBoundariesGeoJson(configs, boundaryCellLevel) {

    let features = []
    for (const i in configs) {
        if (configs.hasOwnProperty(i)) {
            const element = configs[i];
            console.log(element)
            element.cells.map(cellNr => {
                let latLng = S2.idToLatLng(cellNr)
                console.log(latLng)
                let cell = S2.S2Cell.FromLatLng(latLng, boundaryCellLevel);
                let corners = cell.getCornerLatLngs()
                let coordinates = corners.map(currCorner => {
                    return [currCorner.lng, currCorner.lat]
                })
                console.log(coordinates)
                features.push({
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": coordinates
                    }
                })
            });
        }
    }
    let toReturn = {
        "type": "FeatureCollection",
        "features": features
    }
    console.log(toReturn)
    return (toReturn)
}

export function getMarkers(activeCells) {
    return ({
        "type": "FeatureCollection",
        "features":
            activeCells.map((entry) => {
                let latLng = S2.idToLatLng(entry.cell_id)
                return ({
                    "type": "Feature",
                    "properties": {
                        "marker-color": "#7e7e7e",
                        "marker-size": "large",
                        "marker-symbol": ""
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            latLng.lng,
                            latLng.lat
                        ]
                    }
                })

            })
    })
}
*/