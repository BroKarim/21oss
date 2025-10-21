"use client";
import { useEffect } from "react";

export default function ScrollToSlug() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let slug = params.get("slug");

    if (!slug && window.location.hash) {
      slug = window.location.hash.replace("#", "");
    }

    if (slug) {
      setTimeout(() => {
        const el = document.getElementById(slug);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, []);

  return null;
}
