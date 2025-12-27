import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScanner.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1202";

function QRScanner({ onScanSuccess, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            if (html5QrCodeRef.current) {
              html5QrCodeRef.current.clear();
            }
          })
          .catch((err) => {
            console.error("Error stopping scanner:", err);
          })
          .finally(() => {
            html5QrCodeRef.current = null;
          });
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError("");
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      // Try to get camera permissions first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        // Stop the stream immediately, html5-qrcode will start its own
        stream.getTracks().forEach(track => track.stop());
      } catch (permErr) {
        console.error("Camera permission denied:", permErr);
        setError("Camera permission denied. Please allow camera access and try again.");
        return;
      }

      await html5QrCode.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // QR code scanned successfully
          handleQRCodeScanned(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors (they're frequent while scanning)
        }
      );

      setScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No camera found. Please ensure your device has a camera.");
      } else {
        setError(`Failed to start camera: ${err.message}`);
      }
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
        // Even if stop fails, clear the reference
        html5QrCodeRef.current = null;
        setScanning(false);
      }
    }
  };

  const handleClose = async () => {
    try {
      // Stop scanning if active
      await stopScanning();
    } catch (err) {
      console.error("Error during close cleanup:", err);
    }
    // Clear any errors
    setError("");
    // Reset scanning state
    setScanning(false);
    // Call the onClose callback
    if (onClose) {
      onClose();
    }
  };

  const handleQRCodeScanned = async (qrCodeRef) => {
    // Stop scanning once we get a result
    await stopScanning();

    try {
      // Fetch location data from API
      const res = await fetch(`${API_URL}/api/locations/qr/${encodeURIComponent(qrCodeRef)}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Location not found");
      }

      const location = await res.json();
      
      // Call success callback
      if (onScanSuccess) {
        onScanSuccess(location);
      }
    } catch (err) {
      setError(`Location not found for QR code: ${qrCodeRef}. ${err.message}`);
      // Don't auto-restart, let user decide
    }
  };

  return (
    <div className="qr-scanner-overlay" onClick={handleClose}>
      <div className="qr-scanner-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-scanner-header">
          <h2>Scan QR Code</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="qr-scanner-content">
          <div id="qr-reader" className="qr-reader-container"></div>

          {!scanning && (
            <button className="start-scan-btn" onClick={startScanning}>
              Start Camera
            </button>
          )}

          {scanning && (
            <button className="stop-scan-btn" onClick={stopScanning}>
              Stop Scanning
            </button>
          )}

          {error && (
            <div className="error-message">
              {error}
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <button 
                  className="retry-btn" 
                  onClick={startScanning}
                  style={{ flex: 1 }}
                >
                  Try Again
                </button>
                <button 
                  className="close-error-btn" 
                  onClick={handleClose}
                  style={{ flex: 1 }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRScanner;

