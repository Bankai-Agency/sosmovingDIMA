"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

/* ===== MARKERS [lat, lng] ===== */
const markerCoords: [number, number][] = [
  [34.05, -118.24],  // Los Angeles
  [33.72, -117.83],  // Orange County
  [34.18, -118.31],  // San Fernando Valley
  [34.06, -117.65],  // Inland Empire
  [45.52, -122.68],  // Portland
  [47.61, -122.33],  // Seattle
  [39.74, -104.99],  // Denver
];

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ===== POINT IN POLYGON (ray casting) ===== */
function pointInPolygon(x: number, y: number, polygon: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function isLand(lng: number, lat: number, polygons: number[][][][]): boolean {
  for (const poly of polygons) {
    for (const ring of poly) {
      if (pointInPolygon(lng, lat, ring)) return true;
    }
  }
  return false;
}

/* ===== CREATE LAND DOTS ===== */
function createLandDots(r: number, polygons: number[][][][]): THREE.Points {
  const positions: number[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const total = 60000;

  for (let i = 0; i < total; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
    const lat = 90 - (phi * 180) / Math.PI;
    const lng = (theta * 180) / Math.PI - 180;
    const normLng = ((lng % 360) + 540) % 360 - 180;

    if (isLand(normLng, lat, polygons)) {
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      positions.push(x, y, z);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xcccccc,
    size: 0.006,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
  });

  return new THREE.Points(geo, mat);
}

/* ===== CREATE COASTLINE FROM GEOJSON ===== */
function createCoastlines(r: number, polygons: number[][][][]): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
  });

  for (const poly of polygons) {
    for (const ring of poly) {
      if (ring.length < 4) continue;
      const points: THREE.Vector3[] = [];
      // Sample every few points for performance
      const step = Math.max(1, Math.floor(ring.length / 200));
      for (let i = 0; i < ring.length; i += step) {
        const [lng, lat] = ring[i];
        points.push(latLngToVec3(lat, lng, r * 1.001));
      }
      // Close the ring
      const [lng0, lat0] = ring[0];
      points.push(latLngToVec3(lat0, lng0, r * 1.001));

      if (points.length > 2) {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        group.add(new THREE.Line(geo, mat));
      }
    }
  }

  return group;
}

/* ===== GRID LINES ===== */
function createGrid(r: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.06,
  });
  const seg = 128;

  for (let lng = 0; lng < 360; lng += 30) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= seg; i++) {
      pts.push(latLngToVec3(-90 + (180 * i) / seg, lng, r * 1.0005));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= seg; i++) {
      pts.push(latLngToVec3(lat, (360 * i) / seg, r * 1.0005));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }

  return group;
}

/* ===== MARKERS ===== */
function createMarkers(r: number): THREE.Group {
  const group = new THREE.Group();
  for (const [lat, lng] of markerCoords) {
    const pos = latLngToVec3(lat, lng, r * 1.008);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffe533, transparent: true, opacity: 0.35 })
    );
    glow.position.copy(pos);
    group.add(glow);

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.006, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffe533 })
    );
    dot.position.copy(pos);
    group.add(dot);
  }
  return group;
}

/* ===== COMPONENT ===== */
export function Globe({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef(0);
  const pointerDown = useRef(false);
  const pointerXY = useRef({ x: 0, y: 0 });
  const rotTarget = useRef({ x: 0.25, y: 4.0 });
  const rot = useRef({ x: 0.25, y: 4.0 });

  const onResize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current) return;
    const w = containerRef.current.offsetWidth;
    rendererRef.current.setSize(w, w);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const w = container.offsetWidth;
    const R = 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, w);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    renderer.domElement.style.cursor = "grab";

    const globeGroup = new THREE.Group();

    // Load land topology and build globe
    fetch("/mainpage2/data/land-110m.json")
      .then((res) => res.json())
      .then((topo: Topology) => {
        const land = topojson.feature(
          topo,
          topo.objects.land as GeometryCollection
        );

        // Extract all polygon coordinates
        const polygons: number[][][][] = [];
        for (const feat of land.features) {
          if (feat.geometry.type === "Polygon") {
            polygons.push(feat.geometry.coordinates as number[][][]);
          } else if (feat.geometry.type === "MultiPolygon") {
            for (const poly of feat.geometry.coordinates) {
              polygons.push(poly as number[][][]);
            }
          }
        }

        // Build globe elements
        globeGroup.add(createLandDots(R, polygons));
        globeGroup.add(createCoastlines(R, polygons));
        globeGroup.add(createGrid(R));
        globeGroup.add(createMarkers(R));

        scene.add(globeGroup);

        // Set initial rotation to show West Coast
        rot.current = { x: 0.25, y: 4.0 };
        rotTarget.current = { x: 0.25, y: 4.0 };
      });

    // Animation
    function animate() {
      if (!pointerDown.current) {
        rotTarget.current.y += 0.0008;
      }
      rot.current.x += (rotTarget.current.x - rot.current.x) * 0.05;
      rot.current.y += (rotTarget.current.y - rot.current.y) * 0.05;
      globeGroup.rotation.x = rot.current.x;
      globeGroup.rotation.y = rot.current.y;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    }
    frameRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", onResize);

    const canvas = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      pointerDown.current = true;
      pointerXY.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };
    const onUp = () => { pointerDown.current = false; canvas.style.cursor = "grab"; };
    const onMove = (e: PointerEvent) => {
      if (!pointerDown.current) return;
      const dx = e.clientX - pointerXY.current.x;
      const dy = e.clientY - pointerXY.current.y;
      pointerXY.current = { x: e.clientX, y: e.clientY };
      rotTarget.current.y += dx / 200;
      rotTarget.current.x += dy / 300;
      rotTarget.current.x = Math.max(-0.8, Math.min(0.8, rotTarget.current.x));
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);
    canvas.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onUp);
      canvas.removeEventListener("pointermove", onMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onResize]);

  return <div ref={containerRef} className={`relative aspect-square ${className}`} />;
}
