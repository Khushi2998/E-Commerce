import "../App.css";

const InfoLayout = ({ title, children }) => {
  return (
    <div className="info-container">
      <h1 className="info-title">{title}</h1>
      <div className="info-card">{children}</div>
    </div>
  );
};

export default InfoLayout;
