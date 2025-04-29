"use client";

import { useEffect } from "react";
import { Tab } from "bootstrap";

const HashTab = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const triggerEl = document.querySelector(`a[data-bs-target="${hash}"]`);
      if (triggerEl) {
        const tab = new Tab(triggerEl);
        tab.show();
      }
    }
  }, []);

  return null;
};

export default HashTab;
