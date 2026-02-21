import React from 'react';
import FooterSection from './FooterSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const FAQs = () => {
  const faqData = [
    {
      question: "How do I know my donation actually reaches the beneficiary?",
      answer: "Transparency is our core value. When you donate to a campaign, you can track its status in real-time. Once the NGO distributes the items or funds, they are required to upload 'Proof of Work' (photos or receipts), which will be visible on your donor dashboard."
    },
    {
      question: "Are my donations tax-deductible?",
      answer: "Yes, most registered NGOs on our platform hold an 80G certification. You can download your donation receipt directly from your 'History' section to claim tax benefits while filing your returns."
    },
    {
      question: "Can I donate items instead of money?",
      answer: "Absolutely! Many NGOs request specific items like blankets, books, or medicines. You can choose to 'Schedule a Pickup' or drop off the items at the NGO's verified center."
    },
    {
      question: "How are NGOs verified on this platform?",
      answer: "We have a strict 3-step verification process. Our Admin team reviews their legal registration documents (Trust Deed/Society Registration), PAN card, and past activity reports before activating their account."
    },
    {
      question: "I want to volunteer. How can I join?",
      answer: "Simply navigate to the 'Campaigns' page and filter by 'Volunteering'. You can apply for open volunteer slots, and the NGO coordinator will contact you directly."
    },
    {
      question: "Is there a minimum amount I need to donate?",
      answer: "No, every contribution counts! Whether it is ₹10 or ₹10,000, your support makes a difference. We do not enforce a minimum limit on monetary donations."
    }
  ];

  return (
    <>
      {/* Main Content Container - Keeps FAQs centered */}
      <div className="container py-5" style={{ minHeight: '80vh' }}>
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ color: 'var(--primary, #059669)' }}>Frequently Asked Questions</h2>
          <p className="text-muted">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        {/* Accordion Section */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            <div className="accordion shadow-sm" id="faqAccordion">
              {faqData.map((item, index) => (
                <div className="accordion-item border-0 mb-3 rounded shadow-sm" key={index} style={{ overflow: 'hidden' }}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className={`accordion-button ${index !== 0 ? 'collapsed' : ''} fw-semibold`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded={index === 0 ? "true" : "false"}
                      aria-controls={`collapse${index}`}
                      style={{ 
                        backgroundColor: 'var(--nav-bg, #fff)', 
                        color: 'var(--text-primary, #333)',
                        boxShadow: 'none'
                      }}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body text-muted bg-light bg-opacity-25">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Contact Link */}
        <div className="text-center mt-5">
          <p className="text-muted">
            Still have questions? <a href="/contact" className="text-decoration-none fw-bold" style={{ color: '#059669' }}>Contact Support</a>
          </p>
        </div>

      </div>

      {/* Footer Section - Placed outside the container to span full width */}
      <FooterSection />
    </>
  );
};

export default FAQs;