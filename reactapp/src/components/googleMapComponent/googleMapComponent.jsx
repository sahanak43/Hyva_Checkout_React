/* eslint-disable react/prop-types */
/* eslint-disable */

import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '100%',
};

function MapComponent({ mapCenter, locationDetails, locationSelection }) {
  const [infoDomReady, setInfoDomReady] = useState(false);
  const [activeMarker, setActiveMarker] = useState(0);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyD4bQVQ04d9TzunBRD0vkzIIEQA-8B7vY8',
  });

  useEffect(() => {
    if (activeMarker !== 0) {
      setActiveMarker(0)
    }
  }, [mapCenter])
  

  const handleInfoCloseClick = () => {
    setActiveMarker(-1);
    setInfoDomReady(false);
  };

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={15}
      >
        {/* Marker on the map */}
        <Marker
          position={mapCenter}
          onClick={() => handleActiveMarker(0)}
        >
          {activeMarker === 0 && locationSelection && (
            <InfoWindow 
              onDomReady={() => setInfoDomReady(true)}
              onUnmount={() => setInfoDomReady(false)}
              position={mapCenter}
              onCloseClick={handleInfoCloseClick}
            >
              <div className="max-w-[200px]">
                <div>
                  <h3>
                    <b>{locationDetails?.name}</b>
                  </h3>
                  <p>
                    {`${locationDetails?.street || ''}, ${
                      locationDetails?.city || ''
                    }, ${locationDetails?.country || ''}`}
                  </p>

                  <br />

                  <a
                    className="text-[#006bb4]"
                    href={`https://www.google.com/maps/search/?api=1&query=${mapCenter.lat},${mapCenter.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Show on Google Map
                  </a>
                  <br />
                  <button
                    type="button"
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      padding: '10px 5px',
                      marginTop: '10px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      background: '#4c4c4c',
                      position: 'relative',
                      fontWeight: '700',
                      width: '200px',
                    }}
                  >
                    Selected
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </div>
  );
}

export default MapComponent;
