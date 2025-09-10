import { useNavigate } from "react-router-dom";
export default function HotelCard({ name, location, image, price, id, rating = 4.5, featured = false }) {
  const navigate = useNavigate();
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (halfStar) {
      stars.push("☆");
    }
    while (stars.length < 5) {
      stars.push("☆");
    }

    return stars.join(" ");
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transition: "0.3s",
        position: "relative",
      }}
    >
      {/* Featured Tag */}
      {featured && (
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "linear-gradient(90deg, #ff7b54, #ffb347)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          Featured
        </span>
      )}
      <img
        src={image}
        alt={name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />

      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>{name}</h3>
        <p style={{ color: "#555", marginBottom: "8px" }}>{location}</p>

        {/* Rating Stars */}
        <p style={{ color: "#ffb347", fontSize: "1rem", marginBottom: "8px" }}>
          {renderStars(rating)} <span style={{ color: "#444" }}>({rating})</span>
        </p>

        <p style={{ fontWeight: "bold", marginBottom: "12px" }}>{price}</p>
        <button
          style={{
            background: "#ff7b54",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#e96b45")}
          onMouseOut={(e) => (e.target.style.background = "#ff7b54")}
          onClick={() => navigate(`/hotel/${id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
