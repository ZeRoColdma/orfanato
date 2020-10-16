import React, {useEffect, useState} from 'react'
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import mapMarkerImg from '../images/map-marker.svg'

import '../styles/pages/orphanages-map.css';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

interface Orphanage{
  id: number,
  latitude: number,
  longitude: number,
  name: string
}

function OrphanagesMap() {

  const [orphanages, setOrphanages] = useState<Orphanage[]>([])

  useEffect(()=>{
    api.get('/orphanages').then(response => {
      setOrphanages(response.data);
    })
  }, [])

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy"/>

          <h2>Escolha uma <b>casas de acolhimento institucional</b> no mapa</h2>

          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>São Luis</strong>
          <span>Maranhão</span>
        </footer>
      </aside>

      <Map
        center={[-2.510029, -44.2501367]}
        zoom={15}
        style={{ width: '100%', height: '100%'}}
      >
        
        {<TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />}

        
          {orphanages.map(orphanage => {
            return(
              <Marker icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} key={orphanage.id}>
                <Popup closeButton={false} minWidth={248} maxWidth={248} className="map-popup">
                  {orphanage.name}
                  <Link to={`/orphanages/${orphanage.id}`}>
                    <FiArrowRight size={20} color="#fff"/>
                  </Link>
                </Popup>
              </Marker>
            )
          })}

      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  )
}

export default OrphanagesMap;
