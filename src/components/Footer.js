import React, { useEffect, useRef, useState } from "react";
export default function Footer() {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } 
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        background: "#111",
        color: "#fff",
        padding: "20px 20px", 
        textAlign: "center",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 1s ease, transform 1s ease",
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>Atithi Connect</h3>
      <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "0.9rem" }}>
        Your trusted partner for booking hotels and rooms in Sangli, Satara,
        Kolhapur and More Cities. Enjoy comfort, luxury, and convenience at your fingertips.
      </p>
      <p style={{ marginTop: "15px", fontSize: "0.8rem", color: "#aaa" }}>
        © {new Date().getFullYear()} Atithi Connect. All rights reserved.
      </p>
    </footer>
  );
}
