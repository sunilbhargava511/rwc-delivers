"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RWC_CENTER } from "@rwc/shared";

interface DriverMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

interface LiveMapProps {
  drivers: DriverMarker[];
}

export default function LiveMap({ drivers }: LiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [RWC_CENTER.lng, RWC_CENTER.lat],
      zoom: 13,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update driver markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(drivers.map((d) => d.id));

    // Remove markers for drivers no longer present
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add/update markers
    for (const driver of drivers) {
      const existing = markersRef.current.get(driver.id);
      if (existing) {
        existing.setLngLat([driver.lng, driver.lat]);
      } else {
        const el = document.createElement("div");
        el.className = "w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-lg";

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([driver.lng, driver.lat])
          .addTo(map);

        if (driver.label) {
          marker.setPopup(new mapboxgl.Popup().setText(driver.label));
        }

        markersRef.current.set(driver.id, marker);
      }
    }
  }, [drivers]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: "520px" }}
    />
  );
}
