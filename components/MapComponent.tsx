
import React, { useEffect, useRef } from 'react';

// Fix: Declare L as a global variable to resolve "Cannot find name 'L'" errors
declare const L: any;

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  cityName?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, cityName }) => {
  // Fix: Use 'any' type for refs to resolve "Cannot find namespace 'L'" errors
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map-container').setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(center, zoom);
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }

    if (cityName) {
      markerRef.current = L.marker(center)
        .addTo(mapRef.current)
        .bindPopup(`<b>${cityName}</b><br>Monitoring Zone`)
        .openPopup();
      
      // Simulate flood zones with a circle
      const circle = L.circle(center, {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.1,
        radius: 2000
      }).addTo(mapRef.current);
      
      return () => {
        circle.remove();
      };
    }
  }, [center, zoom, cityName]);

  return <div id="map-container" className="h-full w-full rounded-2xl shadow-inner overflow-hidden border border-slate-200" />;
};

export default MapComponent;
