import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getNearbyDonors } from '../api/map';
 
const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '0' };
const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Fallback: New Delhi
 
const mapStyles = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];
 
export default function MapPage() {
  const [donors, setDonors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPos, setCurrentPos] = useState(defaultCenter);
  const [locationLoaded, setLocationLoaded] = useState(false);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorRes = await getNearbyDonors();
        setDonors(donorRes.data.data);
      } catch (err) {
        console.error("Failed to fetch map data");
      }
    };
    fetchData();
 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPos({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoaded(true);
        },
        () => {
          console.log("Location permission denied, using default");
          setLocationLoaded(true);
        }
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);
 
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
 
  if (!apiKey || apiKey === 'TUHARI_GOOGLE_API_KEY_YAHAN_PASTE_KAR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <i className="ti ti-map-off" style={{ fontSize: 28, color: '#dc2626' }}></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Google Maps API key missing</h2>
          <p className="text-sm text-gray-500">Please add a valid <code className="text-red-600">VITE_GOOGLE_MAPS_API_KEY</code> to your environment file.</p>
        </div>
      </div>
    );
  }
 
  if (!locationLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center animate-pulse">
            <i className="ti ti-map-pin" style={{ fontSize: 28, color: '#dc2626' }}></i>
          </div>
          <p className="text-gray-600 font-medium">Detecting your location...</p>
        </div>
      </div>
    );
  }
 
  // Har donor ko center se circular shape mein thoda alag position par lagane ka logic
  const getMarkerPosition = (index, total) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = 0.02;
    return {
      lat: currentPos.lat + radius * Math.cos(angle),
      lng: currentPos.lng + radius * Math.sin(angle)
    };
  };
 
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <i className="ti ti-map-pin" style={{ fontSize: 20, color: '#dc2626' }}></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Find nearby donors</h2>
            <p className="text-xs text-gray-400">Showing donors around your current location</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          {donors.length} donors available
        </div>
      </div>
 
      {/* Body: sidebar + map */}
      <div className="flex-1 flex overflow-hidden">
 
        {/* Sidebar — donor list */}
        <div className="hidden md:flex md:w-80 lg:w-96 flex-col bg-white border-r border-gray-100 overflow-y-auto shrink-0">
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> You
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Donors
              </span>
            </div>
          </div>
 
          {donors.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <i className="ti ti-users" style={{ fontSize: 22, color: '#9ca3af' }}></i>
              </div>
              <p className="text-sm font-medium text-gray-600">No donors found nearby</p>
              <p className="text-xs text-gray-400 mt-1">Check back later or expand your search area</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {donors.map((donor, index) => {
                const pos = getMarkerPosition(index, donors.length);
                const isActive = selected?._id === donor._id;
                return (
                  <button
                    key={donor._id}
                    onClick={() => setSelected({ ...donor, pos })}
                    className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-colors ${
                      isActive ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                      isActive ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {donor.bloodGroup}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-gray-900 truncate">{donor.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <i className="ti ti-phone" style={{ fontSize: 12 }}></i>
                        {donor.phone}
                      </p>
                    </div>
                    <i className="ti ti-chevron-right text-gray-300" style={{ fontSize: 16 }}></i>
                  </button>
                );
              })}
            </div>
          )}
        </div>
 
        {/* Map */}
        <div className="flex-1 relative">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={13}
              center={currentPos}
              options={{ styles: mapStyles, disableDefaultUI: false, zoomControl: true }}
            >
              {/* Your Current Location Marker */}
              <Marker
                position={currentPos}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                title="You are here"
              />
 
              {/* Donor Markers - Circular Pattern */}
              {donors.map((donor, index) => {
                const pos = getMarkerPosition(index, donors.length);
                return (
                  <Marker
                    key={donor._id}
                    position={pos}
                    icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                    onClick={() => setSelected({ ...donor, pos })}
                  />
                );
              })}
 
              {/* Info Window */}
              {selected && (
                <InfoWindow
                  position={selected.pos}
                  onCloseClick={() => setSelected(null)}
                >
                  <div className="p-1">
                    <h3 className="font-bold text-red-600 text-sm">{selected.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">Blood group: <span className="font-bold">{selected.bloodGroup}</span></p>
                    <p className="text-xs text-gray-500">Phone: {selected.phone}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
 
          {/* Mobile donor count badge */}
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold text-gray-700 z-10">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            {donors.length} donors nearby
          </div>
        </div>
      </div>
    </div>
  );
}