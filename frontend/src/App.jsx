import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";

function generateStreamKey() {
  return Math.random().toString(36).substring(2, 10);
}

const RTMP_SERVER_URL = "rtmp://allrounder/live";
const HLS_SERVER_URL = "http://allrounder:8080/hls";

export default function App() {
  const [streamKey, setStreamKey] = useState(() => generateStreamKey());
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const rtmpLink = `${RTMP_SERVER_URL}/${streamKey}`;
  const hlsUrl = `${HLS_SERVER_URL}/${streamKey}.m3u8`;

  useEffect(() => {
    let hls;

    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play();
          setPlaying(true);
        });
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = hlsUrl;
        videoRef.current.addEventListener("loadedmetadata", () => {
          videoRef.current.play();
          setPlaying(true);
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamKey]);

  function newKey() {
    setStreamKey(generateStreamKey());
    setPlaying(false);
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>RTMP Streaming Server</h1>
      <p>
        Stream to OBS using this RTMP URL and key <strong>without login</strong>:
      </p>
      <code>
        RTMP URL: <b>{RTMP_SERVER_URL}</b>
        <br />
        Stream Key: <b>{streamKey}</b>
      </code>

      <p>
        Full RTMP Publish URL: <br />
        <code>{rtmpLink}</code>
      </p>

      <button onClick={newKey} style={{ marginBottom: 20 }}>
        Generate New Stream Key
      </button>

      <h2>Live Preview</h2>
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", backgroundColor: "#000" }}
      >
        Your browser does not support the video tag.
      </video>
      {playing ? null : <p>Preview loading... or streaming not started yet.</p>}
    </div>
  );
}
