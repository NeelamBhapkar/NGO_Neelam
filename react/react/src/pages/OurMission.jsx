import React from 'react';
import { FaHandHoldingHeart, FaGlobe, FaUsers, FaLeaf } from 'react-icons/fa';
import FooterSection from '../pages/FooterSection';
import 'bootstrap/dist/css/bootstrap.min.css';

const OurMission = () => {
  return (
    <div className="bg-light">
      
      {/* 1. HERO SECTION */}
      <section className="position-relative text-white py-5" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Empowering Communities, Changing Lives</h1>
              <p className="lead opacity-90 mb-4">
                We bridge the gap between compassionate donors and verified NGOs to ensure every resource reaches those who need it most.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light text-success fw-bold px-4 rounded-pill shadow-sm">Join Our Journey</button>
                <button className="btn btn-outline-light fw-bold px-4 rounded-pill">Watch Video</button>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Wave */}
        <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '60px', fill: '#f8f9fa' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. CORE VALUES */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-success fw-bold text-uppercase letter-spacing-1">Our Core Values</h6>
            <h2 className="fw-bold text-dark">What Drives Us Forward</h2>
          </div>

          <div className="row g-4">
            {/* Value 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                <div className="mb-3 mx-auto p-3 rounded-circle bg-success bg-opacity-10 text-success" style={{ width: '70px', height: '70px', display: 'grid', placeItems: 'center' }}>
                  <FaHandHoldingHeart size={32} />
                </div>
                <h5 className="fw-bold">Transparency</h5>
                <p className="text-muted small">
                  Every donation is tracked. We ensure 100% visibility on how funds and resources are utilized by NGOs.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                <div className="mb-3 mx-auto p-3 rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: '70px', height: '70px', display: 'grid', placeItems: 'center' }}>
                  <FaGlobe size={32} />
                </div>
                <h5 className="fw-bold">Accessibility</h5>
                <p className="text-muted small">
                  We verify NGOs from every corner of the country, making it easy to support local causes near you.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                <div className="mb-3 mx-auto p-3 rounded-circle bg-warning bg-opacity-10 text-warning" style={{ width: '70px', height: '70px', display: 'grid', placeItems: 'center' }}>
                  <FaUsers size={32} />
                </div>
                <h5 className="fw-bold">Community</h5>
                <p className="text-muted small">
                  Building a network of volunteers, donors, and changemakers united by a single goal: impact.
                </p>
              </div>
            </div>

            {/* Value 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                <div className="mb-3 mx-auto p-3 rounded-circle bg-info bg-opacity-10 text-info" style={{ width: '70px', height: '70px', display: 'grid', placeItems: 'center' }}>
                  <FaLeaf size={32} />
                </div>
                <h5 className="fw-bold">Sustainability</h5>
                <p className="text-muted small">
                  Focusing on long-term solutions for poverty, education, and environmental conservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMPACT STATS BANNER */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <h2 className="display-4 fw-bold text-success">50+</h2>
              <p className="lead opacity-75">Verified NGOs</p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h2 className="display-4 fw-bold text-success">₹1.2Cr</h2>
              <p className="lead opacity-75">Funds Raised</p>
            </div>
            <div className="col-md-4">
              <h2 className="display-4 fw-bold text-success">10k+</h2>
              <p className="lead opacity-75">Lives Impacted</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR STORY / TEXT SECTION */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Volunteers working" 
                className="img-fluid rounded-4 shadow"
              />
            </div>
            <div className="col-lg-6 ps-lg-5">
              <h6 className="text-success fw-bold text-uppercase">Our Story</h6>
              <h2 className="fw-bold mb-3">From a Small Idea to a Nationwide Movement</h2>
              <p className="text-muted">
                NGO-Connect started with a simple observation: there were thousands of people willing to help, and thousands of NGOs needing help, but no trusted bridge between them.
              </p>
              <p className="text-muted mb-4">
                We built this platform to solve the trust deficit. By verifying every NGO and providing proof of impact for every donation, we have created an ecosystem where kindness flows without friction.
              </p>
              <button className="btn btn-dark rounded-pill px-4">Read Full Story</button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-5 text-center bg-white border-top">
        <div className="container py-4">
          <h2 className="fw-bold mb-3">Ready to Make a Difference?</h2>
          <p className="text-muted mb-4 col-lg-6 mx-auto">
            Join thousands of donors and volunteers who are rewriting the future, one act of kindness at a time.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-success btn-lg rounded-pill px-5 shadow-sm">Donate Now</button>
            <button className="btn btn-outline-dark btn-lg rounded-pill px-5">Partner with Us</button>
          </div>
        </div>
      </section>

      {/* FOOTER - ADDED AS REQUESTED */}
      <FooterSection />

      {/* Internal CSS for Hover Effect */}
      <style>
        {`
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          }
        `}
      </style>
    </div>
  );
};

export default OurMission;