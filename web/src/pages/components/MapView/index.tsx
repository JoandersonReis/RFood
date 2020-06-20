import React, {useState, useEffect} from "react"
import { Map, TileLayer, Marker } from "react-leaflet"
import "./styles.css"
import { LeafletEvent, LeafletMouseEvent } from "leaflet"

interface Props {
  onSelectedPosition: (position: [number, number]) => void,
  selectedPosition:[number, number]
}

const MapView: React.FC<Props> = ({ onSelectedPosition, selectedPosition }) => {
  const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0, 0])

  function handleMapClick(event: LeafletMouseEvent) {
    onSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setInitialPosition([latitude, longitude])
    })
  }, [])

  return (
    <Map center={initialPosition} zoom={15} className="map" onClick={handleMapClick}>
      <TileLayer 
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={selectedPosition} />
    </Map>
  )
}

export default MapView
