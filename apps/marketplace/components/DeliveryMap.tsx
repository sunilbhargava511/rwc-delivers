"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface DeliveryMapProps {
  restaurantLocation: { lat: number; lng: number };
  customerLocation: { lat: number; lng: number };
  driverLocation: { lat: number; lng: number } | null;
}

export default function DeliveryMap({
  restaurantLocation,
  customerLocation,
  driverLocation,
}: DeliveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [customerLocation.lng, customerLocation.lat],
      zoom: 13,
    });

    mapRef.current = map;

    // Restaurant marker (red)
    new mapboxgl.Marker({ color: "#EF4444" })
      .setLngLat([restaurantLocation.lng, restaurantLocation.lat])
      .setPopup(new mapboxgl.Popup().setText("Restaurant"))
      .addTo(map);

    // Customer marker (blue)
    new mapboxgl.Marker({ color: "#3B82F6" })
      .setLngLat([customerLocation.lng, customerLocation.lat])
      .setPopup(new mapboxgl.Popup().setText("Delivery Address"))
      .addTo(map);

    // Fit bounds to show both markers
    const bounds = new mapboxgl.LngLatBounds()
      .extend([restaurantLocation.lng, restaurantLocation.lat])
      .extend([customerLocation.lng, customerLocation.lat]);

    if (driverLocation) {
      bounds.extend([driverLocation.lng, driverLocation.lat]);
    }

    map.fitBounds(bounds, { padding: 60 });

    return () => {
      map.remove();
      mapRef.current = null;
      driverMarkerRef.current = null;
    };
  }, [restaurantLocation, customerLocation]); // Only re-create map if locations change

  // Update driver marker position without re-creating the map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !driverLocation) return;

    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLngLat([
        driverLocation.lng,
        driverLocation.lat,
      ]);
    } else {
      driverMarkerRef.current = new mapboxgl.Marker({ color: "#10B981" })
        .setLngLat([driverLocation.lng, driverLocation.lat])
        .setPopup(new mapboxgl.Popup().setText("Driver"))
        .addTo(map);
    }
  }, [driverLocation]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-64 rounded-xl overflow-hidden"
    />
  );
}
