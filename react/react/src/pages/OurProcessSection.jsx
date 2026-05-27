import React from "react";
import { FaSearch, FaHandsHelping, FaChartLine } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const OurProcessSection = () => {
  const steps = [
    {
      icon: <FaSearch />,
      title: "Identify Needs",
      description: "We work directly with communities to understand their most pressing challenges and priorities.",
      color: "#3b82f6", // Blue
    },
    {
      icon: <FaHandsHelping />,
      title: "Take Action",
      description: "We implement sustainable solutions with local partners, ensuring long-term positive change.",
      color: "#ef4444", // Red
    },
    {
      icon: <FaChartLine />,
      title: "Measure Impact",
      description: "We track results and share transparent reports with our donors about every dollar spent.",
      color: "#22c55e", // Green
    },
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container text-center">
        
        {/* SECTION HEADINGS */}
        <div className="mb-5">
          <h6 className="fw-bold text-success text-uppercase ls-1 mb-2">
            Our Process
          </h6>
          <h2 className="fw-bold text-dark display-6">
            How We Make Impact
          </h2>
        </div>

        {/* STEPS GRID */}
        <div className="row justify-content-center g-4">
          {steps.map((step, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              
              <div className="h-100 p-4 rounded-3 step-card transition-all">
                {/* ICON CIRCLE */}
                <div 
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white mb-4 shadow-sm"
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    fontSize: "32px",
                    backgroundColor: step.color 
                  }}
                >
                  {step.icon}
                </div>

                {/* TEXT CONTENT */}
                <h3 className="h4 fw-bold text-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary mb-0 px-xl-3" style={{ lineHeight: "1.7" }}>
                  {step.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* CUSTOM CSS FOR HOVER EFFECTS & SPACING */}
      <style>
        {`
          .ls-1 { letter-spacing: 2px; }
          
          /* Smooth Hover Lift Effect */
          .step-card:hover {
            transform: translateY(-10px);
          }
          .transition-all {
            transition: transform 0.3s ease-in-out;
          }
        `}
      </style>
    </section>
  );
};

export default OurProcessSection;