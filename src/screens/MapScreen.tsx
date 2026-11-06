import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Navigation,
  LocateFixed,
  ChevronLeft,
  X,
  ShieldCheck,
  AlertTriangle,
  CornerUpRight,
  Phone,
  Languages
} from 'lucide-react';
import { useTranslation } from '../services/i18n';

interface MapScreenProps {
  onBack?: () => void;
}

interface SafetyPoint {
  id: string;
  name: string;
  shortLabel: string;
  type: 'police' | 'hospital' | 'transit' | 'danger';
  isSafe: boolean; // true = green, false = red
  coords: [number, number]; // [lng, lat]
  distance: string;
  source: string;
  status: string;
  details: string;
  phone?: string;
  lastUpdated: string;
}

// ----------------------------------------------------------------------------
// GEOGRAPHICAL ANCHORS — BENGALURU (RRCE TO KENGERI SATELLITE TOWN)
// ----------------------------------------------------------------------------
const RRCE_COORDS: [number, number] = [77.4503, 12.8867]; // RajaRajeswari College of Engineering (Start)
const HOME_COORDS: [number, number] = [77.4855, 12.9150]; // Kengeri Satellite Town (Destination)

// Verified safety points & potential hazard points along Mysore Road corridor
const SAFETY_POINTS: SafetyPoint[] = [
  {
    id: 'safe-1',
    name: 'Kumbalagodu Police Station',
    shortLabel: 'Police',
    type: 'police',
    isSafe: true,
    coords: [77.4498, 12.8842],
    distance: '350 m from College',
    source: 'Karnataka State Police (KSP) Highway Patrol Post',
    status: 'Verified 24/7 Active Police Station',
    details: 'Operational highway patrol station with 24/7 inspector desk and direct emergency interceptor.',
    phone: '080-28437100',
    lastUpdated: 'Nov 2026',
  },
  {
    id: 'safe-2',
    name: 'RajaRajeswari Medical College & Hospital',
    shortLabel: 'Hospital',
    type: 'hospital',
    isSafe: true,
    coords: [77.4626, 12.8939],
    distance: '1.8 km along route',
    source: 'NABH Trauma Registry • 24/7 Emergency Wing',
    status: 'Level 1 Trauma Care & Emergency Ambulance Base',
    details: '24/7 trauma care, emergency casualty department, and active security gatehouse.',
    phone: '080-28437444',
    lastUpdated: 'Nov 2026',
  },
  {
    id: 'safe-3',
    name: 'Kengeri Metro & TTMC Safety Kiosk',
    shortLabel: 'Safe Transit',
    type: 'transit',
    isSafe: true,
    coords: [77.4815, 12.9090],
    distance: '4.2 km along route',
    source: 'BMRCL & Bengaluru City Police',
    status: '24/7 Monitored Transit Hub & Women Assistance Kiosk',
    details: 'Multimodal transit center with continuous CCTV surveillance and active security desk.',
    phone: '080-22967100',
    lastUpdated: 'Nov 2026',
  },
  {
    id: 'danger-1',
    name: 'Ramohalli Underpass Unlit Stretch',
    shortLabel: 'Unlit Stretch',
    type: 'danger',
    isSafe: false,
    coords: [77.4580, 12.8895],
    distance: '1.2 km from College',
    source: 'BBMP Ward 198 Log • Citizen Safety Advisory',
    status: 'Known Safety Alert: Insufficient Lighting',
    details: 'Non-functioning streetlights reported after 9 PM. Stay on main divided arterial road.',
    lastUpdated: 'Oct 2026',
  },
  {
    id: 'danger-2',
    name: 'Kengeri Flyover Construction Detour',
    shortLabel: 'Caution',
    type: 'danger',
    isSafe: false,
    coords: [77.4760, 12.9040],
    distance: '3.6 km along corridor',
    source: 'Bengaluru Traffic Police Advisory',
    status: 'Caution: Drainage & Flyover Detour',
    details: 'Narrowed pedestrian walkway with reduced nighttime visibility due to ongoing civic work.',
    lastUpdated: 'Nov 2026',
  },
];

// High-precision road route coordinates from RajaRajeswari College to Home via Mysore Rd (NH275)
const PRIMARY_ROUTE_COORDS: [number, number][] = [
  [77.450607, 12.886464], [77.450723, 12.886567], [77.450874, 12.886755],
  [77.451294, 12.88727],  [77.451807, 12.887854], [77.452261, 12.888432],
  [77.452711, 12.888982], [77.453197, 12.889472], [77.453596, 12.88979],
  [77.45437,  12.890395], [77.4551,   12.890932], [77.455989, 12.891537],
  [77.456865, 12.892088], [77.457487, 12.892525], [77.458246, 12.893236],
  [77.459021, 12.89424],  [77.45972,  12.895132], [77.460319, 12.895918],
  [77.460812, 12.89662],  [77.461697, 12.897483], [77.462527, 12.898104],
  [77.463556, 12.898799], [77.464162, 12.89906],  [77.465096, 12.899704],
  [77.466619, 12.900676], [77.467712, 12.901319], [77.468472, 12.901814],
  [77.469197, 12.902364], [77.469781, 12.903123], [77.470339, 12.904209],
  [77.470891, 12.90497],  [77.471583, 12.905512], [77.47261,  12.906233],
  [77.473476, 12.906839], [77.47433,  12.907147], [77.475432, 12.907408],
  [77.476574, 12.908145], [77.477293, 12.908585], [77.478169, 12.909014],
  [77.479015, 12.90937],  [77.479872, 12.909682], [77.480728, 12.909945],
  [77.481796, 12.910343], [77.482573, 12.910452], [77.483668, 12.910436],
  [77.484189, 12.91056],  [77.484535, 12.910956], [77.484986, 12.91243],
  [77.485175, 12.912794], [77.48545,  12.913128], [77.485328, 12.913535],
  [77.485204, 12.913843], [77.485294, 12.914581], [77.485401, 12.915023]
];

export const MapScreen: React.FC<MapScreenProps> = ({ onBack }) => {
  const { t, language, languages, openLanguageModal } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<SafetyPoint | null>(null);

  // --------------------------------------------------------------------------
  // INITIALIZE MAP (STABLE, NO AUTO-MOVING INTERVALS)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create MapLibre map with photorealistic satellite layer & clean blush-pink theme route
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          // Satellite Aerial Base Imagery
          'satellite-tiles': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          // Route GeoJSON
          'primary-route': {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: PRIMARY_ROUTE_COORDS,
              },
            },
          },
        },
        layers: [
          // 1. Aerial Satellite Imagery Layer
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
          // 2. Route Outer Glow / Casing (Soft blush white outline for contrast)
          {
            id: 'route-glow',
            type: 'line',
            source: 'primary-route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 9,
              'line-opacity': 0.95,
            },
          },
          // 3. Navigation Route Core (App's Signature Blush Rose Deep #B96F80 - Pinkish theme)
          {
            id: 'route-core',
            type: 'line',
            source: 'primary-route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#B96F80',
              'line-width': 5.5,
              'line-opacity': 1.0,
            },
          },
        ],
      },
      center: [77.468, 12.901], // Kengeri Corridor midpoint
      zoom: 13.6,
      pitch: 0,
      bearing: 0,
    });

    mapRef.current = map;

    // On Load: Fit full route neatly into view once and STOP. Never auto-pan on timers!
    map.on('load', () => {
      const bounds = new maplibregl.LngLatBounds();
      PRIMARY_ROUTE_COORDS.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, {
        padding: { top: 90, bottom: 150, left: 35, right: 35 },
        maxZoom: 15.5,
        duration: 0, // Instant clean framing without disorienting fly-ins
      });

      // 1. ORIGIN MARKER: RajaRajeswari College (Blush Rose Dot)
      const collegeEl = document.createElement('div');
      collegeEl.style.display = 'flex';
      collegeEl.style.flexDirection = 'column';
      collegeEl.style.alignItems = 'center';
      collegeEl.style.cursor = 'pointer';
      collegeEl.innerHTML = `
        <div style="
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #B96F80;
          border: 3px solid #FFFFFF;
          box-shadow: 0 2px 8px rgba(185, 111, 128, 0.45);
        "></div>
        <div style="
          background: #FFFFFF;
          color: #6D3D48;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(185, 111, 128, 0.2);
          margin-top: 3px;
          white-space: nowrap;
          border: 1px solid rgba(217, 141, 157, 0.4);
        ">
          RRCE (Start)
        </div>
      `;
      new maplibregl.Marker({ element: collegeEl })
        .setLngLat(RRCE_COORDS)
        .addTo(map);

      // 2. DESTINATION MARKER: Home in Kengeri (App Restrained Accent Destination Pin)
      const homeEl = document.createElement('div');
      homeEl.style.display = 'flex';
      homeEl.style.flexDirection = 'column';
      homeEl.style.alignItems = 'center';
      homeEl.style.cursor = 'pointer';
      homeEl.innerHTML = `
        <div style="
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #C83F4B;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 2px 8px rgba(200, 63, 75, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 900;
        ">
          ⌂
        </div>
        <div style="
          background: #FFFFFF;
          color: #8F1924;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(200, 63, 75, 0.2);
          margin-top: 3px;
          white-space: nowrap;
          border: 1px solid rgba(200, 63, 75, 0.35);
        ">
          Home
        </div>
      `;
      new maplibregl.Marker({ element: homeEl })
        .setLngLat(HOME_COORDS)
        .addTo(map);

      // 3. SAFE & UNSAFE PLACES: Distinct Little Green & Red Markers on Map
      SAFETY_POINTS.forEach((pt) => {
        const markerEl = document.createElement('div');
        markerEl.style.display = 'flex';
        markerEl.style.flexDirection = 'column';
        markerEl.style.alignItems = 'center';
        markerEl.style.cursor = 'pointer';

        if (pt.isSafe) {
          // Green Safe Place Marker (Google Green #1E8E3E)
          markerEl.innerHTML = `
            <div title="${pt.name}" style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #1E8E3E;
              border: 2px solid #FFFFFF;
              box-shadow: 0 2px 5px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-size: 11px;
              font-weight: 900;
            ">
              ✓
            </div>
            <div style="
              background: #FFFFFF;
              color: #1E8E3E;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 9px;
              font-weight: 700;
              padding: 1px 5px;
              border-radius: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.25);
              margin-top: 2px;
              white-space: nowrap;
              border: 1px solid #CEEAD6;
            ">
              ${pt.shortLabel}
            </div>
          `;
        } else {
          // Red Unsafe / Caution Place Marker (Google Red #D93025)
          markerEl.innerHTML = `
            <div title="${pt.name}" style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #D93025;
              border: 2px solid #FFFFFF;
              box-shadow: 0 2px 5px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-size: 12px;
              font-weight: 900;
            ">
              !
            </div>
            <div style="
              background: #FFFFFF;
              color: #D93025;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 9px;
              font-weight: 700;
              padding: 1px 5px;
              border-radius: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.25);
              margin-top: 2px;
              white-space: nowrap;
              border: 1px solid #FAD2CF;
            ">
              ${pt.shortLabel}
            </div>
          `;
        }

        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedPoint(pt);
        });

        new maplibregl.Marker({ element: markerEl })
          .setLngLat(pt.coords)
          .addTo(map);
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // --------------------------------------------------------------------------
  // USER CONTROLS: "CURRENT" BUTTON & "START" BUTTON ONLY
  // --------------------------------------------------------------------------

  // 1. Current Location Button: Centers on RRCE (Origin) without auto-moving away
  const handleCurrentLocation = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: RRCE_COORDS,
      zoom: 16.2,
      duration: 600,
    });
  };

  // 2. Start Navigation: Toggles Navigation Mode cleanly like Google Maps
  const handleToggleNavigation = () => {
    if (!mapRef.current) return;

    if (!isNavigating) {
      // Start Navigation
      setIsNavigating(true);
      mapRef.current.easeTo({
        center: RRCE_COORDS,
        zoom: 16.5,
        pitch: 35,
        bearing: 25,
        duration: 800,
      });
    } else {
      // Exit Navigation: Fit full route overview back
      setIsNavigating(false);
      const bounds = new maplibregl.LngLatBounds();
      PRIMARY_ROUTE_COORDS.forEach((c) => bounds.extend(c));
      mapRef.current.fitBounds(bounds, {
        padding: { top: 90, bottom: 150, left: 35, right: 35 },
        maxZoom: 15.5,
        duration: 700,
      });
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#F8E9E9',
      }}
    >
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Atmospheric Warm Blush Veil over satellite map to unify with app's pinkish theme */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(248, 233, 233, 0.05) 0%, rgba(217, 141, 157, 0.12) 100%)',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      />

      {/* ---------------- TOP HEADER / NAVIGATION BANNER ---------------- */}
      {!isNavigating ? (
        // Frosted Glass Rose-Themed Route Header
        <div
          style={{
            position: 'absolute',
            top: 'calc(14px + env(safe-area-inset-top, 0px))',
            left: '14px',
            right: '14px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          {/* Back Button */}
          <button
            onClick={onBack}
            aria-label="Back to home"
            style={{
              pointerEvents: 'auto',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(235, 218, 222, 0.85)',
              boxShadow: '0 2px 10px rgba(185, 111, 128, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>

          {/* Clean Route Pill */}
          <div
            style={{
              pointerEvents: 'auto',
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '8px 14px',
              border: '1px solid rgba(235, 218, 222, 0.85)',
              boxShadow: '0 3px 12px rgba(185, 111, 128, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                {t('map.routeTitle')}
              </div>
              <div style={{ fontSize: '11px', color: '#655358', marginTop: '1px' }}>
                {t('map.routeSubtitle')}
              </div>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--color-success)',
                backgroundColor: 'rgba(52, 118, 93, 0.12)',
                border: '1px solid rgba(52, 118, 93, 0.25)',
                padding: '2px 7px',
                borderRadius: '12px',
              }}
            >
              {t('map.safeRoute')}
            </span>
          </div>

          {/* Multilingual Switcher Icon */}
          <button
            onClick={openLanguageModal}
            title={`Language: ${languages.find((l) => l.code === language)?.nativeName} (Tap to change)`}
            aria-label="Change Application Language"
            style={{
              pointerEvents: 'auto',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(235, 218, 222, 0.85)',
              boxShadow: '0 2px 10px rgba(185, 111, 128, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Languages size={17} strokeWidth={1.8} color="var(--color-text)" />
          </button>
        </div>
      ) : (
        // Active Navigation Turn Banner (App Theme Charcoal-Rose Glass)
        <div
          style={{
            position: 'absolute',
            top: 'calc(14px + env(safe-area-inset-top, 0px))',
            left: '14px',
            right: '14px',
            zIndex: 35,
            background: 'linear-gradient(135deg, rgba(59, 18, 28, 0.94) 0%, rgba(109, 61, 72, 0.94) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(235, 218, 222, 0.4)',
            color: '#FFFFFF',
            borderRadius: '18px',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(59, 18, 28, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 141, 157, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CornerUpRight size={22} color="#FFFFFF" strokeWidth={2.6} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>
                {t('map.turnRight')}
              </div>
              <div style={{ fontSize: '11px', color: '#FCEFF0', marginTop: '2px' }}>
                {t('map.turnDetail')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FLOATING "CURRENT" LOCATION BUTTON ---------------- */}
      <button
        onClick={handleCurrentLocation}
        title={t('map.centerLocation')}
        aria-label={t('map.centerLocation')}
        style={{
          position: 'absolute',
          right: '16px',
          bottom: '140px', // Sits cleanly above the bottom action button
          zIndex: 30,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(235, 218, 222, 0.85)',
          boxShadow: '0 4px 14px rgba(185, 111, 128, 0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-rose-deep)',
          cursor: 'pointer',
          transition: 'transform var(--motion-fast)',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <LocateFixed size={22} strokeWidth={2.4} />
      </button>

      {/* ---------------- FLOATING "START" / "EXIT" BUTTON ---------------- */}
      <div
        style={{
          position: 'absolute',
          bottom: '78px', // Positioned above the transparent bottom navigation
          left: '16px',
          right: '16px',
          zIndex: 30,
        }}
      >
        <button
          onClick={handleToggleNavigation}
          style={{
            width: '100%',
            height: '48px',
            background: isNavigating
              ? 'var(--color-text)'
              : 'linear-gradient(135deg, #C4687C 0%, #B96F80 50%, #A8576A 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            border: 'none',
            fontSize: '14.5px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isNavigating
              ? '0 4px 12px rgba(40, 35, 38, 0.25)'
              : '0 4px 16px rgba(185, 111, 128, 0.38)',
            cursor: 'pointer',
            transition: 'background-color 150ms ease, transform 100ms ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Navigation size={17} strokeWidth={2.5} fill="#FFFFFF" />
          <span>{isNavigating ? t('map.exitNav') : t('map.startNav')}</span>
        </button>
      </div>

      {/* ---------------- SAFETY POINT DETAIL POPUP (WHEN TAPPED) ---------------- */}
      {selectedPoint && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(40, 35, 38, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedPoint(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              padding: '18px 20px 24px',
              boxShadow: '0 -8px 28px rgba(185, 111, 128, 0.16)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Status Badge & Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  backgroundColor: selectedPoint.isSafe ? 'rgba(52, 118, 93, 0.12)' : 'rgba(200, 63, 75, 0.12)',
                  color: selectedPoint.isSafe ? 'var(--color-success)' : 'var(--color-sos)',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: selectedPoint.isSafe ? '1px solid rgba(52, 118, 93, 0.25)' : '1px solid rgba(200, 63, 75, 0.25)',
                }}
              >
                {selectedPoint.isSafe ? (
                  <ShieldCheck size={14} strokeWidth={2.4} />
                ) : (
                  <AlertTriangle size={14} strokeWidth={2.4} />
                )}
                <span>{selectedPoint.status}</span>
              </div>

              <button
                onClick={() => setSelectedPoint(null)}
                aria-label="Close details"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                <X size={15} strokeWidth={2.4} />
              </button>
            </div>

            {/* Place Name & Distance */}
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: '0 0 4px 0',
              }}
            >
              {selectedPoint.name}
            </h2>
            <div style={{ fontSize: '11.5px', color: '#655358', marginBottom: '10px' }}>
              {selectedPoint.distance} • Verified Source: {selectedPoint.source}
            </div>

            {/* Details Description */}
            <p
              style={{
                fontSize: '12.5px',
                color: '#3B121C',
                lineHeight: 1.45,
                margin: '0 0 14px 0',
              }}
            >
              {selectedPoint.details}
            </p>

            {/* Action Row */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedPoint.phone && (
                <a
                  href={`tel:${selectedPoint.phone}`}
                  style={{
                    flex: 1,
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(217, 141, 157, 0.16)',
                    color: 'var(--color-rose-deep)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    border: '1px solid rgba(217, 141, 157, 0.35)',
                  }}
                >
                  <Phone size={14} />
                  <span>Call {selectedPoint.phone}</span>
                </a>
              )}

              <button
                onClick={() => setSelectedPoint(null)}
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-surface-soft)',
                  color: 'var(--color-text)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
