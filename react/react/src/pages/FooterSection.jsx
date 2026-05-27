import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import NGOImg from "../assets/Logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoIosMail } from "react-icons/io";


const FooterSection = () => {
  return (
    <footer className="text-white py-5" style={{ backgroundColor: "#0a1929" }}>
      <div className="container">
        {/* Added 'text-center text-md-start' to center content on mobile but left-align on desktop */}
        <div className="row gy-5 text-center text-md-start">
          {/* COLUMN 1: BRANDING & INFO */}
          <div className="col-lg-4 col-md-6">
            {/* Logo Section: Centered on mobile (justify-content-center), Left on desktop (justify-content-md-start) */}
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
              <img
                src={NGOImg}
                alt="NGO Connect Logo"
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
                className="me-2"
              />
              <span className="fs-4 fw-bold text-success" style={{fontFamily: '"Google Sans", sans-serif'}}>NGO-Connect</span>
            </div>

            {/* Description: Auto margins on mobile to center the text block */}
            <p
              className="text-secondary mb-4 mx-auto ms-md-0"
              style={{ lineHeight: "1.7", maxWidth: "320px" }}
            >
              Empowering communities through sustainable development, education,
              and healthcare initiatives worldwide.
            </p>

            {/* Social Icons: Centered on mobile */}
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a
                href="https://github.com/Ngo-Connect/NGO"
                className="text-white fs-5 hover-opacity"
              >
                <FaGithub />
              </a>
              <a
                href="	info@know-it.co.in
"
                className="text-white fs-5 hover-opacity"
              >
                <IoIosMail />
              </a>
            </div>
          </div>

          {/* COLUMN 2: NAVIGATION LINKS */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-4 fw-bold">Navigate</h5>
            <ul className="list-unstyled p-0 m-0">
              {["Home", "Campaigns", "Our Mission", "Contact"].map(
                (item, index) => {
                  const path =
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(" ", "-")}`;
                  return (
                    <li key={index} className="mb-3">
                      <Link
                        to={path}
                        className="text-secondary text-decoration-none hover-text-white transition-all"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          {/* COLUMN 3: CONTACT INFO */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4 fw-bold">Contact Us</h5>

            {/* Contact Items: Centered flex for mobile */}
            <div className="d-flex flex-column align-items-center align-items-md-start gap-3 text-secondary">
              <div className="d-flex align-items-start">
                <FaMapMarkerAlt className="text-success me-3 mt-1" />
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary text-decoration-none hover-text-white text-start"
                >
                  KNOW-IT, C-DAC ACTS (ATC), Pune
                </a>
              </div>

              <div className="d-flex align-items-center">
                <FaPhoneAlt className="text-success me-3" />
                <span>+91 9823434616</span>
              </div>

              <div className="d-flex align-items-center">
                <FaEnvelope className="text-success me-3" />
                <span>	info@know-it.co.in</span>
              </div>
            </div>
          </div>

          {/* COLUMN 4: SUBSCRIBE */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4 fw-bold">Subscribe Us</h5>

            <div
              className="input-group bg-transparent border border-white rounded-pill overflow-hidden p-1 mx-auto ms-md-0"
              style={{ maxWidth: "300px" }}
            >
              <input
                type="email"
                className="form-control bg-transparent border-0 text-white shadow-none ps-3"
                placeholder="Enter Email"
                aria-label="Enter Email"
                style={{ color: "white" }}
              />
              <button className="btn btn-light rounded-pill px-4 fw-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Helper styles for hover effects & placeholder */}
      <style>
        {`
          .hover-opacity:hover { opacity: 0.7; transition: 0.3s; }
          .hover-text-white:hover { color: #fff !important; }
          ::placeholder { color: #aaa !important; opacity: 1; }
        `}
      </style>
    </footer>
  );
};

export default FooterSection;
