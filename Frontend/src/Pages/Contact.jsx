// import InfoLayout from "../components/InfoLayout";

// const Contact = () => (
//   <InfoLayout title="Contact Us">
//     <form className="contact-form">
//       <input type="text" placeholder="Your Name" required />
//       <input type="email" placeholder="Your Email" required />
//       <textarea placeholder="Your Message" rows="4"></textarea>
//       <button type="submit">Send Message</button>
//     </form>
//   </InfoLayout>
// );

// export default Contact;

import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="page contact-page">
      <h1>Contact Us</h1>
      <p className="subtitle">
        We’re here to help you with orders, delivery, and general queries.
      </p>

      <div className="contact-grid">
        <div className="contact-card">
          <FaEnvelope />
          <h4>Email</h4>
          <p>support@infinitystore.com</p>
        </div>

        <div className="contact-card">
          <FaPhoneAlt />
          <h4>Phone</h4>
          <p>+91 99999 88888</p>
        </div>

        <div className="contact-card">
          <FaClock />
          <h4>Support Hours</h4>
          <p>Mon – Sat, 9:00 AM – 7:00 PM</p>
        </div>

        <div className="contact-card">
          <FaMapMarkerAlt />
          <h4>Address</h4>
          <p>
            Infinity Store Pvt Ltd <br />
            Prayagraj, Uttar Pradesh <br />
            India
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

