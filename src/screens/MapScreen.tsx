import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  SlidersHorizontal,
  ShieldCheck,
  Hospital,
  Building2,
  Phone,
  Navigation,
  X,
  Layers,
  MapPin,
  ChevronLeft
} from 'lucide-react';

declare global {
  interface Window {
    maplibregl: any;
  }
}

interface MapPoint {
  id: string;
  name: string;
  category: 'contact' | 'hospital' | 'police' | 'shelter';
  coords: [number, number]; // [lng, lat]
  distance: string;
  eta: string;
  status: string;
  badge?: string;
  phone?: string;
  address?: string;
  avatarText?: string;
  imageUrl?: string;
}

const INITIAL_POINTS: MapPoint[] = [
  {
    id: 'pt-1',
    name: 'Maya Lin',
    category: 'contact',
    coords: [-0.1186, 51.5049],
    distance: '134 m',
    eta: '2 min',
    status: 'Trusted Circle • Battery 92% • Live Sharing',
    badge: '11',
    phone: '+1 (555) 392-1048',
    avatarText: 'ML',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'pt-2',
    name: "St. Thomas' Urgent Haven",
    category: 'hospital',
    coords: [-0.1180, 51.5038],
    distance: '240 m',
    eta: '3 min',
    status: 'Verified 24/7 Haven • Active Trauma Desk',
    badge: 'Safe Haven',
    phone: '+44 20 7188 7188',
    address: 'Belvedere Rd, South Bank, London SE1',
  },
  {
    id: 'pt-3',
    name: 'Southbank Police Haven',
    category: 'police',
    coords: [-0.1173, 51.5044],
    distance: '340 m',
    eta: '4 min',
    status: 'Metropolitan Police • 24hr Public Safety',
    badge: 'Police',
    phone: '999',
    address: 'Concert Hall Approach, London SE1 8SW',
  },
  {
    id: 'pt-4',
    name: 'David K.',
    category: 'contact',
    coords: [-0.1197, 51.5056],
    distance: '310 m',
    eta: '4 min',
    status: 'Trusted Circle • Battery 84% • Stationary',
    badge: '16',
    phone: '+1 (555) 720-9112',
    avatarText: 'DK',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  },
];

// Landmark 3D Building massing with realistic heights and translucent architectural tint
const LANDMARK_BUILDINGS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'County Hall Complex', height: 26, min_height: 0 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.1206, 51.5010],
            [-0.1180, 51.5014],
            [-0.1186, 51.5024],
            [-0.1212, 51.5020],
            [-0.1206, 51.5010],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Shell Centre Skyscraper', height: 85, min_height: 0 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.1176, 51.5036],
            [-0.1156, 51.5038],
            [-0.1160, 51.5050],
            [-0.1180, 51.5048],
            [-0.1176, 51.5036],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Southbank Royal Festival Hall', height: 36, min_height: 0 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.1166, 51.5064],
            [-0.1146, 51.5066],
            [-0.1152, 51.5078],
            [-0.1172, 51.5076],
            [-0.1166, 51.5064],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Waterloo Station Concourse', height: 28, min_height: 0 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.1146, 51.5022],
            [-0.1118, 51.5028],
            [-0.1128, 51.5044],
            [-0.1156, 51.5038],
            [-0.1146, 51.5022],
          ],
        ],
      },
    },
  ],
};

export const MapScreen: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  // States
  const [userLocation, setUserLocation] = useState<[number, number]>([-0.1192, 51.5033]);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(INITIAL_POINTS[0]);
  const [isCardExpanded, setIsCardExpanded] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [satelliteStyle, setSatelliteStyle] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'havens' | 'contacts'>('all');
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Safe Route Trajectory function
  const renderRoute = (map: any, start: [number, number], end: [number, number]) => {
    if (!map) return;
    try {
      const src = map.getSource('safe-route');
      if (src) {
        // Natural curve towards destination
        const steps = 6;
        const coords: [number, number][] = [start];
        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const curveOffset = Math.sin(t * Math.PI) * -0.00022;
          const lng = start[0] + (end[0] - start[0]) * t + curveOffset;
          const lat = start[1] + (end[1] - start[1]) * t;
          coords.push([lng, lat]);
        }
        coords.push(end);

        src.setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coords,
          },
        });
      }
    } catch (err) {
      console.warn('Route update deferral:', err);
    }
  };

  // Initialize MapLibre GL 3D Map
  useEffect(() => {
    let checkTimer: any;

    const initMap = () => {
      if (!mapContainerRef.current) return;
      const ml = window.maplibregl;
      if (!ml) {
        checkTimer = setTimeout(initMap, 60);
        return;
      }

      if (!mapRef.current) {
        const initialRouteCoords: [number, number][] = [
          [-0.1192, 51.5033],
          [-0.1190, 51.5037],
          [-0.1188, 51.5041],
          [-0.1187, 51.5045],
          [-0.1186, 51.5049],
        ];

      const map = new ml.Map({
        container: mapContainerRef.current,
        attributionControl: false,
        style: {
          version: 8,
          sources: {
            'satellite-imagery': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
              maxzoom: 19,
            },
            'landmark-buildings': {
              type: 'geojson',
              data: LANDMARK_BUILDINGS_GEOJSON,
            },
            'safe-route': {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: initialRouteCoords,
                },
              },
            },
          },
          layers: [
            // 1. High-resolution Satellite Imagery
            {
              id: 'satellite-layer',
              type: 'raster',
              source: 'satellite-imagery',
              minzoom: 0,
              maxzoom: 19,
              layout: { visibility: 'visible' },
            },
            // 2. Safe Route Glow Underlay (Deep Rose)
            {
              id: 'safe-route-glow',
              type: 'line',
              source: 'safe-route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#E63956',
                'line-width': 10,
                'line-opacity': 0.95,
              },
            },
            // 3. Safe Route Dashed White Line (Matching reference)
            {
              id: 'safe-route-dashed',
              type: 'line',
              source: 'safe-route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#FFFFFF',
                'line-width': 4.5,
                'line-dasharray': [3, 2],
              },
            },
            // 4. Curated Local Landmark 3D Extruded Buildings
            {
              id: '3d-landmark-buildings',
              source: 'landmark-buildings',
              type: 'fill-extrusion',
              minzoom: 10,
              paint: {
                'fill-extrusion-color': '#FFFFFF',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.38,
              },
            },
          ],
        },
        center: [-0.1186, 51.5042], // Tilted 3D view of Jubilee Gardens & London Eye
        zoom: 16.2,
        pitch: 62,
        bearing: -28,
        antialias: true,
      });

      mapRef.current = map;
      (window as any).__mapInstance = map;

      // Add HTML markers
      setupUserBeacon(map, userLocation);
      populateMarkers(map, INITIAL_POINTS);

      map.on('load', () => {
        setIsMapReady(true);
      });
    }

    // Geolocation API: Request real coordinates if user grants permission
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setUserLocation(coords);
          setIsGpsActive(true);
          if (mapRef.current) {
            setupUserBeacon(mapRef.current, coords);
            mapRef.current.flyTo({ center: coords, zoom: 16.2, pitch: 60 });
          }
        },
        () => {
          setIsGpsActive(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  initMap();

    return () => {
      clearTimeout(checkTimer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update route when destination changes or map becomes ready
  useEffect(() => {
    if (mapRef.current && isMapReady && selectedPoint) {
      renderRoute(mapRef.current, userLocation, selectedPoint.coords);
    }
  }, [selectedPoint, userLocation, isMapReady]);

  // User location marker with directional cone matching reference image
  const setupUserBeacon = (map: any, coords: [number, number]) => {
    const ml = window.maplibregl;
    if (!ml) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'user-beacon-cone';
    el.style.width = '64px';
    el.style.height = '64px';
    el.style.position = 'relative';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.pointerEvents = 'none';

    el.innerHTML = `
      <div style="
        position: absolute;
        width: 54px;
        height: 54px;
        border-radius: 50% 50% 12% 50%;
        transform: rotate(18deg);
        background: rgba(255, 255, 255, 0.45);
        border: 2px solid rgba(255, 255, 255, 0.92);
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 14px solid #E69530;
          transform: rotate(45deg);
        "></div>
      </div>
      <div style="
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #C83F4B;
        border: 2.5px solid #FFFFFF;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>
    `;

    userMarkerRef.current = new ml.Marker({ element: el })
      .setLngLat(coords)
      .addTo(map);
  };

  // Render floating markers matching reference composition
  const populateMarkers = (map: any, points: MapPoint[]) => {
    const ml = window.maplibregl;
    if (!ml) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    points.forEach((pt) => {
      const el = document.createElement('div');
      el.className = 'map-point-marker';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';

      if (pt.category === 'contact') {
        // Contact Marker with Photo Card, Pin Disc & Amber Badge (matching reference)
        el.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            ${
              pt.imageUrl
                ? `
              <div style="
                width: 60px;
                height: 48px;
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid #FFFFFF;
                box-shadow: 0 4px 14px rgba(0,0,0,0.36);
                margin-bottom: -8px;
                z-index: 2;
                background-color: #F8E9E9;
              ">
                <img 
                  src="${pt.imageUrl}" 
                  alt="${pt.name}" 
                  style="width: 100%; height: 100%; object-fit: cover; display: block;" 
                  onerror="this.parentElement.style.display='none'"
                />
              </div>
            `
                : ''
            }
            <div style="position: relative; display: flex; align-items: center; justify-content: center; z-index: 3;">
              <div style="
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(36, 30, 34, 0.78);
                border: 2px solid #FFFFFF;
                box-shadow: 0 4px 12px rgba(0,0,0,0.32);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12.5px;
                font-weight: 800;
                color: #FFFFFF;
              ">
                ${pt.avatarText || 'TC'}
              </div>
              ${
                pt.badge
                  ? `
                <div style="
                  position: absolute;
                  top: -4px;
                  right: -6px;
                  background-color: #E69530;
                  color: #FFFFFF;
                  font-size: 9.5px;
                  font-weight: 800;
                  border-radius: 10px;
                  padding: 1.5px 5.5px;
                  border: 1.5px solid #FFFFFF;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.25);
                ">${pt.badge}</div>
              `
                  : ''
              }
            </div>
            <div style="
              background: rgba(255, 255, 255, 0.94);
              padding: 2.5px 8px;
              border-radius: 10px;
              font-size: 10.5px;
              font-weight: 700;
              color: #282326;
              margin-top: 4px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.26);
              white-space: nowrap;
            ">
              ${pt.name}
            </div>
          </div>
        `;
      } else {
        // Safe Haven Badge (Hospital / Police)
        const isHosp = pt.category === 'hospital';
        el.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.96);
            border: 1.5px solid rgba(255, 255, 255, 0.98);
            padding: 5px 11px;
            border-radius: 18px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.32);
          ">
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: ${isHosp ? '#C83F4B' : '#1F5E8E'};
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-size: 11px;
              font-weight: bold;
            ">
              ${isHosp ? '✚' : '★'}
            </div>
            <span style="
              font-size: 11px;
              font-weight: 700;
              color: #282326;
              white-space: nowrap;
            ">${pt.name.split(' ')[0]} (${pt.distance})</span>
          </div>
        `;
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedPoint(pt);
        setIsCardExpanded(true);
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: pt.coords,
            zoom: 16.5,
            pitch: 62,
            duration: 1000,
          });
        }
      });

      const marker = new ml.Marker({ element: el, offset: [0, -18] })
        .setLngLat(pt.coords)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Toggle 3D Camera Tilt (60° vs 0°)
  const toggle3DTilt = () => {
    if (!mapRef.current) return;
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);
    mapRef.current.easeTo({
      pitch: nextMode ? 60 : 0,
      bearing: nextMode ? -28 : 0,
      duration: 800,
    });
  };

  // Recenter on User Location
  const handleRecenter = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: userLocation,
      zoom: 16.2,
      pitch: is3DMode ? 60 : 0,
      bearing: -28,
      duration: 900,
    });
  };

  // Toggle Satellite vs 3D Architectural Vector Layer
  const toggleSatellite = () => {
    if (!mapRef.current) return;
    const next = !satelliteStyle;
    setSatelliteStyle(next);
    if (mapRef.current.getLayer('satellite-layer')) {
      mapRef.current.setLayoutProperty(
        'satellite-layer',
        'visibility',
        next ? 'visible' : 'none'
      );
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#0E0B0D',
        color: 'var(--color-text)',
      }}
    >
      {/* ---------------- 1. WEBGL 3D MAP CANVAS ---------------- */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* ---------------- 2. TOP FLOATING BAR (MATCHING REFERENCE) ---------------- */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(16px + env(safe-area-inset-top, 0px))',
          left: '16px',
          right: '16px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Left Circular Back / Recenter Button */}
        <button
          onClick={handleRecenter}
          aria-label="Recenter on location"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#282326',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.16)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <ChevronLeft size={18} strokeWidth={2.4} />
        </button>

        {/* Center: "Nearby now" Floating Title & Real-time Counts */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '18px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            Nearby now
          </h2>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '3px',
            }}
          >
            {isGpsActive ? 'Live GPS Active' : '3 havens'} · 2 contacts active
          </span>
        </div>

        {/* Right Circular Filter Button with Badge "3" */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Filter Map Layers"
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#282326',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.16)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <SlidersHorizontal size={16} strokeWidth={2} />
          {/* Active Badge "3" */}
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-rose-deep)',
              color: '#FFFFFF',
              fontSize: '9.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #FFFFFF',
            }}
          >
            3
          </span>
        </button>
      </div>

      {/* ---------------- 3. FLOATING BOTTOM CONTROLS (MATCHING REFERENCE) ---------------- */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))',
          left: '16px',
          right: '16px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Bottom-Left Floating Pill: "134 m left • 2 min walk" */}
        {selectedPoint && (
          <button
            onClick={() => setIsCardExpanded(!isCardExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.98)',
              padding: '8px 14px',
              borderRadius: '24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
          >
            <Navigation size={14} color="var(--color-rose-deep)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#282326' }}>
              {selectedPoint.distance} left
            </span>
            <span style={{ fontSize: '11px', color: '#655358' }}>• {selectedPoint.eta} walk</span>
          </button>
        )}

        {/* Bottom-Right Circular Controls: 3D Tilt & Recenter */}
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          {/* Toggle 3D Perspective Button */}
          <button
            onClick={toggle3DTilt}
            aria-label="Toggle 3D View"
            title="Toggle 3D Angle"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: is3DMode ? 'var(--color-text)' : 'rgba(255, 255, 255, 0.92)',
              color: is3DMode ? '#FFFFFF' : '#282326',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            3D
          </button>

          {/* Compass Recenter Button */}
          <button
            onClick={handleRecenter}
            aria-label="Recenter Location"
            title="Recenter Location"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#282326',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
            }}
          >
            <Compass size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ---------------- 4. EXPANDABLE FLOATING DETAIL CARD SHEET ---------------- */}
      {selectedPoint && isCardExpanded && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(118px + env(safe-area-inset-bottom, 0px))',
            left: '16px',
            right: '16px',
            zIndex: 35,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(217, 141, 157, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-rose-deep)',
                }}
              >
                {selectedPoint.category === 'hospital' && <Hospital size={17} />}
                {selectedPoint.category === 'police' && <ShieldCheck size={17} />}
                {selectedPoint.category === 'contact' && <MapPin size={17} />}
                {selectedPoint.category === 'shelter' && <Building2 size={17} />}
              </div>

              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
                  {selectedPoint.name}
                </h4>
                <p style={{ fontSize: '11px', color: '#655358', marginTop: '2px' }}>
                  {selectedPoint.status}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCardExpanded(false)}
              aria-label="Minimize details"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={13} />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-rose-deep)' }}>
                {selectedPoint.distance}
              </span>
              <span style={{ fontSize: '11px', color: '#655358' }}>• {selectedPoint.eta} safe route</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedPoint.phone && (
                <a
                  href={`tel:${selectedPoint.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(217, 141, 157, 0.14)',
                    color: 'var(--color-rose-deep)',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={13} /> Call
                </a>
              )}
              <button
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.flyTo({ center: selectedPoint.coords, zoom: 17, pitch: 65 });
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-text)',
                  color: '#FFFFFF',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Navigation size={13} /> Navigate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 5. FILTER & LAYER CONTROL SHEET ---------------- */}
      {showFilters && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={() => setShowFilters(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              padding: '18px 20px',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Map Layers & Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Satellite Imagery Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-surface-soft)',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--color-rose-deep)" />
                <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Photorealistic Satellite 3D</span>
              </div>
              <button
                role="switch"
                aria-checked={satelliteStyle}
                onClick={toggleSatellite}
                style={{
                  width: '36px',
                  height: '20px',
                  borderRadius: '10px',
                  backgroundColor: satelliteStyle ? 'var(--color-rose-deep)' : '#E0D4D6',
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '2px',
                    left: satelliteStyle ? '18px' : '2px',
                    transition: 'left 140ms ease',
                  }}
                />
              </button>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {[
                { id: 'all', label: 'All Markers' },
                { id: 'havens', label: 'Havens Only' },
                { id: 'contacts', label: 'Contacts Only' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFilter(f.id as any);
                    if (mapRef.current) {
                      const filtered = INITIAL_POINTS.filter((p) => {
                        if (f.id === 'havens') return p.category !== 'contact';
                        if (f.id === 'contacts') return p.category === 'contact';
                        return true;
                      });
                      populateMarkers(mapRef.current, filtered);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: '8px',
                    backgroundColor: activeFilter === f.id ? 'var(--color-text)' : 'var(--color-surface-soft)',
                    color: activeFilter === f.id ? '#FFFFFF' : 'var(--color-text)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-text)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
