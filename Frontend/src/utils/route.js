/*
 * Shared routing helpers — save this file as `src/utils/route.js`.
 *
 * Uses OSRM's free public routing API (no API key needed, same one
 * a lot of open-source map apps use) to get an actual road route
 * (geometry + distance + duration) between two {lat,lng} points.
 *
 * Also has a plain haversine distance function for cheap "remaining
 * distance" updates on every GPS tick, without hitting the network
 * every single time.
 */

/* Haversine distance in KM between two {lat,lng} points */
export function haversineKm(a, b) {
    if (!a || !b) return null;
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/*
 * Real road route between two points via OSRM's public demo server.
 * Returns { geometry (GeoJSON LineString), distanceKm, durationMin }
 * or null if the request fails (caller should fall back to a straight
 * line / haversine distance in that case).
 */
export async function fetchRoute(from, to) {
    if (!from || !to) return null;
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        const r = data?.routes?.[0];
        if (!r) return null;
        return {
            geometry: r.geometry, // { type: 'LineString', coordinates: [[lng,lat], ...] }
            distanceKm: r.distance / 1000,
            durationMin: r.duration / 60,
        };
    } catch (err) {
        console.error("OSRM route fetch failed:", err);
        return null;
    }
}

/*
 * Adds (or updates) a route line source/layer on a MapLibre map.
 * Call once after map 'load', then call again any time you have new
 * route geometry to redraw it (it just updates the existing source).
 */
export function ensureRouteLayer(map, { color = "#000000", width = 4 } = {}) {
    if (map.getSource("live-route")) return;
    map.addSource("live-route", {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: [] } },
    });
    map.addLayer({
        id: "live-route-line",
        type: "line",
        source: "live-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
            "line-color": color,
            "line-width": width,
            "line-opacity": 0.85,
        },
    });
}

export function setRouteOnMap(map, geometry) {
    const source = map?.getSource?.("live-route");
    if (!source) return;
    source.setData({
        type: "Feature",
        geometry: geometry || { type: "LineString", coordinates: [] },
    });
}

/* Fit the map view to a route's bounding box with some padding. */
export function fitRouteBounds(map, geometry, maplibregl) {
    if (!geometry?.coordinates?.length) return;
    const bounds = geometry.coordinates.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(geometry.coordinates[0], geometry.coordinates[0])
    );
    map.fitBounds(bounds, { padding: 80, duration: 600, maxZoom: 16 });
}