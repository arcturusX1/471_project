import { useState, useEffect } from "react";
import QRScanner from "./QRScanner";
import "./LocationFinder.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1202";

function LocationFinder() {
  const [showScanner, setShowScanner] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScanSuccess = async (location) => {
    setCurrentLocation(location);
    setShowScanner(false);
    await fetchNearbyLocations(location);
  };

  const handleScanClose = () => {
    // Ensure scanner is closed and state is reset
    setShowScanner(false);
    // Make sure we're not in a loading state that might cause blank screen
    if (loading) {
      setLoading(false);
    }
  };

  const fetchNearbyLocations = async (location) => {
    setLoading(true);
    try {
      // Fetch all locations to find nearby ones
      const res = await fetch(`${API_URL}/api/locations`);
      if (!res.ok) throw new Error("Failed to fetch locations");

      const allLocations = await res.json();

      // Filter locations based on closestBlocks and closestRooms
      const nearby = allLocations.filter((loc) => {
        // Skip the current location
        if (loc._id.toString() === location._id.toString()) {
          return false;
        }

        // Check if location is in closestBlocks (same floor, different block)
        if (location.closestBlocks && location.closestBlocks.length > 0) {
          if (location.closestBlocks.includes(loc.block) && loc.floor === location.floor) {
            return true;
          }
        }

        // Check if location is in closestRooms (find locations that contain these room codes)
        if (location.closestRooms && location.closestRooms.length > 0) {
          const roomCodes = loc.rooms?.map((r) => r.code) || [];
          if (location.closestRooms.some((roomCode) => roomCodes.includes(roomCode))) {
            return true;
          }
        }

        // Also include locations in the same block and floor (adjacent rooms)
        if (loc.block === location.block && loc.floor === location.floor) {
          return true;
        }

        return false;
      });

      setNearbyLocations(nearby);
    } catch (err) {
      console.error("Error fetching nearby locations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-finder">
      <header className="location-finder-header">
        <h1>Location Finder</h1>
        <button className="btn-primary" onClick={() => setShowScanner(true)}>
          Scan QR Code
        </button>
      </header>

      {showScanner && (
        <QRScanner
          key="qr-scanner"
          onScanSuccess={handleScanSuccess}
          onClose={handleScanClose}
        />
      )}

      {currentLocation && (
        <div className="current-location-card">
          <h2>Current Location</h2>
          <div className="location-details">
            <div className="location-badge">
              Floor {currentLocation.floor} • Block {currentLocation.block}
            </div>
            <p className="qr-ref">QR Code: {currentLocation.qrCodeRef}</p>
            {currentLocation.rooms && currentLocation.rooms.length > 0 && (
              <div className="rooms-list">
                <strong>Rooms in this location:</strong>
                <div className="room-tags">
                  {currentLocation.rooms.map((room, idx) => (
                    <span key={idx} className="room-tag">
                      {room.code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <p>Finding nearby classrooms...</p>
        </div>
      )}

      {currentLocation && !loading && (
        <div className="nearby-section">
          <h2>Nearby Classrooms</h2>
          {nearbyLocations.length === 0 ? (
            <p className="empty-state">No nearby classrooms found</p>
          ) : (
            <div className="nearby-locations-grid">
              {nearbyLocations.map((location) => (
                <div key={location._id} className="nearby-location-card">
                  <div className="location-header">
                    <h3>
                      Floor {location.floor} • Block {location.block}
                    </h3>
                  </div>
                  {location.rooms && location.rooms.length > 0 && (
                    <div className="rooms-section">
                      <p className="rooms-label">Available Rooms:</p>
                      <div className="room-tags">
                        {location.rooms.map((room, idx) => (
                          <span key={idx} className="room-tag">
                            {room.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {location.closestBlocks && location.closestBlocks.length > 0 && (
                    <div className="closest-info">
                      <p>
                        <strong>Nearby Blocks:</strong> {location.closestBlocks.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!currentLocation && (
        <div className="empty-state-large">
          <p>Scan a QR code to find your location and nearby classrooms</p>
        </div>
      )}
    </div>
  );
}

export default LocationFinder;

