// src/Pages/user/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaQuoteLeft } from "react-icons/fa"; 
import Slider from "react-slick"; // ✅ react-slick import
import "slick-carousel/slick/slick.css";   // ✅ slick styles import
import "slick-carousel/slick/slick-theme.css"; // ✅ slick theme import
import heroBg from "../../image/bgg4.jpg";

export default function Home() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  // ✅ 10 Locations
  const locations = [
    "Sangli",
    "Satara",
    "Kolhapur",
    "Pune",
    "Mumbai",
    "Nashik",
    "Nagpur",
    "Karad",
    "Bengluru",
    "Solapur",
  ];

  // ✅ Slick settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Locations */}
      <section
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
            Welcome to Atithi Connect
          </h1>
          <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
            Book hotels and rooms in Sangli, Satara, Kolhapur, and more cities with ease.
          </p>

          {/* Explore Hotels Button */}
          <Link
            to="/hotels"
            style={{
              marginTop: "20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #ff7b54, #ffb347)",
              padding: "14px 28px",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              textDecoration: "none",
              color: "#fff",
              boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }}
          >
            Explore Hotels
            <span
              className="arrow"
              style={{ display: "inline-block", transition: "transform 0.3s ease" }}
            >
              ➔
            </span>
          </Link>
        </div>

        {/* Explore by Location with Slider */}
        <div
          style={{
            marginTop: "60px",
            width: "100%",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1s ease 0.5s, transform 1s ease 0.5s",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>
            Explore by Location
          </h2>

          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <Slider {...sliderSettings}>
              {locations.map((city, index) => (
                <div key={city}>
                  <Link
                    to={`/hotels/${city.toLowerCase()}`}
                    style={{
                      display: "block",
                      background: "rgba(255, 255, 255, 0.9)",
                      padding: "40px 20px",
                      margin: "0 10px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "#111",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      textAlign: "center",
                      transition:
                        "transform 0.3s ease, box-shadow 0.3s ease, opacity 1s ease",
                      opacity: animate ? 1 : 0,
                      transform: animate ? "scale(1)" : "scale(0.9)",
                      transitionDelay: `${0.3 + index * 0.1}s`,
                    }}
                  >
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                      {city}
                    </h3>
                    <p>Find the best hotels in {city}</p>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section
        style={{
          padding: "60px 20px",
          background: "#f9fafb",
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 1s ease 0.8s, transform 1s ease 0.8s",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "30px",
          }}
        >
          Featured Hotels
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {[
            {
              name: "Luxury Stay Sangli",
              location: "Sangli",
              image:
                "https://images.unsplash.com/photo-1566073771259-6a8506099945",
              price: "₹2500/night",
              link: "/hotels/sangli",
            },
            {
              name: "Comfort Inn Satara",
              location: "Satara",
              image:
                "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
              price: "₹1800/night",
              link: "/hotels/satara",
            },
            {
              name: "Elite Palace Kolhapur",
              location: "Kolhapur",
              image:
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
              price: "₹3000/night",
              link: "/hotels/kolhapur",
            },
          ].map((hotel, index) => (
            <div
              key={hotel.name}
              style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease, opacity 1s ease",
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0.9)",
                transitionDelay: `${1 + index * 0.2}s`, // ✅ fixed
              }}
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>
                  {hotel.name}
                </h3>
                <p style={{ color: "#555", marginBottom: "8px" }}>
                  {hotel.location}
                </p>
                <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
                  {hotel.price}
                </p>
                <Link
                  to={hotel.link}
                  style={{
                    display: "inline-block",
                    background: "#ff7b54",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "500",
                    transition: "0.3s",
                  }}
                >
                  View All Hotels
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ Customer Reviews Section */}
      <section
        style={{
          padding: "60px 20px",
          background: "#fff",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>
          What Our Guests Say
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              text: "Atithi Connect made my trip so smooth! Booking was easy and the hotel was amazing.",
              name: "Rohit P.",
              img: "https://i.pravatar.cc/100?img=1",
            },
            {
              text: "Loved the service! Will definitely book again.",
              name: "Sneha K.",
              img: "https://i.pravatar.cc/100?img=2",
            },
            {
              text: "Best prices and very convenient booking process.",
              name: "Amit D.",
              img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces",
            },
          ].map((review, index) => (
            <div
              key={index}
              style={{
                background: "#f9fafb",
                padding: "30px 20px",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              {/* Quote Icon */}
              <FaQuoteLeft
                style={{ fontSize: "24px", color: "#ff7b54", marginBottom: "15px" }}
              />

              {/* Review Text */}
              <p
                style={{
                  fontStyle: "italic",
                  marginBottom: "15px",
                  color: "#444",
                }}
              >
                “{review.text}”
              </p>

              {/* Profile Image */}
              <img
                src={review.img}
                alt={review.name}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  marginBottom: "10px",
                  border: "3px solid #eee",
                }}
              />

              {/* Reviewer Name */}
              <h4 style={{ fontWeight: "600", color: "#111" }}>{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
