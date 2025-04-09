import React, { useRef, useEffect } from "react";

const AdPreview = ({ html }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current && html) {
      previewRef.current.innerHTML = html;
    }
  }, [html]);

  return <div ref={previewRef} />;
};

export default React.memo(AdPreview);
