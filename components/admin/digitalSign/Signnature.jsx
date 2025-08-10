import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import axios from "axios";

export default function SignatureCapture() {
  const sigCanvas = useRef(null);
  const [preview, setPreview] = useState(null);

  const clear = () => sigCanvas.current.clear();

  const save = async () => {
    const base64 = sigCanvas.current.getCanvas().toDataURL("image/png");
    setPreview(base64);

    try {
      await axios.post(`${import.meta.env.VITE_UPLOAD_SIGNATURE}`, {
        user_id: "user123",
        signature: base64,
      });
      alert("✅ Signature saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save signature");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{
          width: 500,
          height: 200,
          className: "sigCanvas",
          style: { border: "1px solid black" },
        }}
      />
      <div style={{ marginTop: 10 }}>
        <button onClick={clear}>Clear</button>
        <button onClick={save}>Save Signature</button>
      </div>
      {preview && <img src={preview} alt="Preview" style={{ marginTop: 10 }} />}
    </div>
  );
}
