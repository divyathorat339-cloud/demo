// src/Pages/user/AboutUs.jsx
import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import img1 from "../../image/img2.jpg";
import img2 from "../../image/img3.jpg";
import img3 from "../../image/img9.jpg";
import img4 from "../../image/img8.jpg";
import img5 from "../../image/img4.jpg";
export default function AboutUs() {
  return (
    <>
      <Navbar />
      <style>{`
        .about-container {
          font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #fdfdfd;
          color: #222;
        }

        /* Hero Section */
        .about-hero {
          text-align: center;
          padding: 120px 20px 90px;
          background: #fff;
        }
        .about-hero h1 {
          font-size: 46px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
          font-family: 'Playfair Display', serif;
          animation: fadeInDown 1s ease;
        }
        .about-hero .tagline-underline {
          display: inline-block;
          width: 140px;
          height: 4px;
          background: linear-gradient(90deg, #b08d57, #d4af7a);
          margin-top: 10px;
          border-radius: 2px;
          animation: fadeIn 1.4s ease;
        }
        .about-hero p {
          font-size: 19px;
          color: #555;
          margin-top: 25px;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.8;
          animation: fadeInUp 1.2s ease;
        }

        .hero-images {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 28px;
          flex-wrap: wrap;
          margin-top: 70px;
        }
        .hero-images img {
          border-radius: 24px;
          object-fit: cover;
          transition: transform 0.6s ease, box-shadow 0.6s ease;
          box-shadow: 0px 12px 30px rgba(0,0,0,0.25);
        }
        .hero-images img:hover {
          transform: scale(1.08) translateY(-8px);
          box-shadow: 0px 20px 40px rgba(0,0,0,0.35);
        }
        .hero-images img.small {
          width: 180px;
          height: 230px;
        }
        .hero-images img.medium {
          width: 240px;
          height: 300px;
        }
        .hero-images img.large {
          width: 300px;
          height: 360px;
        }

        /* Info Section */
        .about-info {
          background: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
            url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
          padding: 160px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .info-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 22px;
          max-width: 850px;
          padding: 70px 55px;
          text-align: center;
          box-shadow: 0px 18px 40px rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          animation: fadeInUp 1.2s ease;
        }
        .info-card h2 {
          font-size: 38px;
          font-weight: 700;
          margin-bottom: 28px;
          color: #111;
          font-family: 'Playfair Display', serif;
        }
        .info-card p {
          font-size: 19px;
          color: #444;
          line-height: 1.85;
          margin-bottom: 20px;
        }

        /* Our Story Section */
        .about-story {
          background: #fff;
          padding: 120px 20px;
          position: relative;
          overflow: hidden;
        }
        .story-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          align-items: center;
          gap: 70px;
          max-width: 1150px;
          margin: auto;
        }
        .story-text h2 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 22px;
          color: #111;
          font-family: 'Playfair Display', serif;
          position: relative;
        }
        .story-text h2::after {
          content: "";
          width: 90px;
          height: 4px;
          background: linear-gradient(90deg, #b08d57, #d4af7a);
          position: absolute;
          left: 0;
          bottom: -12px;
          border-radius: 2px;
        }
        .story-text p {
          font-size: 20px;
          color: #555;
          line-height: 1.9;
          margin-top: 28px;
        }
        .story-image img {
          width: 100%;
          border-radius: 22px;
          box-shadow: 0px 18px 38px rgba(0,0,0,0.28);
          transition: transform 0.6s ease, box-shadow 0.6s ease;
        }
        .story-image img:hover {
          transform: scale(1.06);
          box-shadow: 0px 24px 48px rgba(0,0,0,0.38);
        }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
       <div className="about-container">
        {/* Hero Section with Images */}
        <section className="about-hero">
          <h1>Atithi Connect – Where Every Booking Feels Like Coming Home</h1>
          <div className="tagline-underline"></div>
          <p>
            A seamless way to experience comfort, luxury, and hospitality tailored 
            to your needs — redefining every stay with trust and care.
          </p>

          <div className="hero-images">
            <img src={img1} alt="Resort Beach" className="small" />
            <img src={img2} alt="Breakfast" className="medium" />
            <img src={img3} alt="Luxury Pool" className="large" />
            <img src={img4} alt="Sunset" className="medium" />
            <img src={img5} alt="Hotel Exterior" className="small" />
          </div>
        </section>

        {/* Info Section */}
        <section className="about-info">
          <div className="info-card">
            <h2>About Us</h2>
            <p>
              Our hotel is more than just a place to stay — it is a sanctuary of
              elegance and comfort. Designed with luxury in mind, we provide
              world-class hospitality, personalized services, and an atmosphere
              that makes every guest feel special.
            </p>
            <p>
              Whether you are traveling for leisure or business, we ensure that
              your stay is filled with memorable moments, gourmet dining, and
              unmatched comfort.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="about-story">
          <div className="story-grid">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded with a vision to redefine hospitality, our journey began
                with a simple idea — to create a place where guests feel valued
                and experiences become timeless. Over the years, we have built a
                reputation for excellence, combining tradition with innovation.
                From luxury rooms to fine dining and rejuvenating wellness
                facilities, we continue to set benchmarks in hospitality.
              </p>
            </div>
            <div className="story-image">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Hotel Lobby"
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
