"use client";

import { useEffect, useState, useRef } from "react";
import Quagga from "quagga";

const BarcodeScanner = ({ onDetected }) => {
  const [scannedCode, setScannedCode] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [frozenFrame, setFrozenFrame] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const beepSound = useRef(null);


  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isScanning) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: { facingMode: "environment", focusMode: "continuous" },
            numOfWorkers: navigator.hardwareConcurrency || 4,
            locate: true,
            zoom: { ideal: 2 },
            focusDistance: { ideal: 5000 },
            exposureMode: "continuous",
            whiteBalanceMode: "continuous",
            locator: { patchSize: "x-large", halfSample: true },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            target: document.querySelector("#interactive"),
          },
          decoder: { readers: ["ean_reader", "code_128_reader"] },
          debug: true
        },
        (err) => {
          if (!err) {
            Quagga.start();
            videoRef.current = document.querySelector("video");
          } else {
            console.error("Quagga initialization failed:", err);
          }
        }
      );

      Quagga.onDetected(handleDetected);
    }

    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);

  const handleDetected = (result) => {
    const code = result.codeResult.code;
    setScannedCode(code);
    freezeScreen();
    setIsScanning(false);
    Quagga.stop();

    if (beepSound.current) {
      const playPromise = beepSound.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => console.warn("Audio play blocked:", error));
      }
    }
    // Pastikan onDetected tidak undefined sebelum dipanggil
    if (onDetected) {
      onDetected(code);
    }
  };

  const freezeScreen = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setFrozenFrame(canvas.toDataURL("image/png"));
    }
  };

  const restartScan = () => {
    setScannedCode("");
    setFrozenFrame(null);
    setIsScanning(false);

    setTimeout(() => {
      setIsScanning(true);
    }, 500); // Beri jeda agar Quagga berhenti sebelum restart
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Scan Barcode</h1>
      <div id="interactive" style={styles.scannerContainer} className="rounded-lg">
        {frozenFrame ? (
          <img src={frozenFrame} alt="Frozen Scan" style={styles.frozenImage} />
        ) : null}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <audio ref={beepSound} src="/beep.mp3" preload="auto"></audio>




      {scannedCode ? (
        <div style={styles.resultContainer}>
          <p style={styles.resultText}><strong>Scanned Code:</strong> {scannedCode}</p>
          <button onClick={restartScan} style={styles.button}>
            Scan Lagi
          </button>
        </div>

      ) : (
        <div>
        <p style={styles.instruction}>Arahkan kamera ke barcode...</p>
        <div className="flex justify-center">
        <button
          onClick={() => onDetected(".")}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 hover:shadow-2xl"
        >
          ✨ Isi Barcode Manual ✨
        </button>
      </div>
        </div>
        
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "10px",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  scannerContainer: {
    width: "100%",
    aspectRatio: "16 / 9",
    border: "2px solid black",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  frozenImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  resultContainer: {
    marginTop: "15px",
    textAlign: "center",
  },
  resultText: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
  },
  instruction: {
    fontSize: "1rem",
    color: "#666",
  },
  button: {
    padding: "10px 15px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};
 
export default BarcodeScanner;
