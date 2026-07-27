import React, { useState } from "react";
import "./ContactPage.css";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "Residential",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");
    leads.push({ ...form, submittedAt: new Date().toISOString() });
    localStorage.setItem("leads", JSON.stringify(leads));
    toast.success("Your message has been sent! We'll get back to you shortly.");
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", propertyType: "Residential", budget: "", message: "" });
  };

  return (
    <div className="contact-page-wrapper">
      {/* Hero */}
      <div className="contact-page-hero">
        <span className="orangeText">Get In Touch</span>
        <h1 className="primaryText">Contact Our Team</h1>
        <p className="secondaryText">
          Have questions about a property? Ready to start your real estate journey?
          Our expert team is here to help you every step of the way.
        </p>
      </div>

      <div className="innerWidth paddings contact-page-body">
        {/* Info cards */}
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <MdPhone size={28} color="#f1780f" />
            <h4>Call Us</h4>
            <p>+1 (555) 012-3456</p>
            <p>Mon – Fri, 9am – 6pm</p>
          </div>
          <div className="contact-info-card">
            <MdEmail size={28} color="#f1780f" />
            <h4>Email Us</h4>
            <p>info@homyz.com</p>
            <p>Reply within 24 hours</p>
          </div>
          <div className="contact-info-card">
            <MdLocationOn size={28} color="#f1780f" />
            <h4>Visit Us</h4>
            <p>123 Homyz Street</p>
            <p>New York, NY 10001</p>
          </div>
          <div className="contact-info-card whatsapp-card" onClick={() => window.open("https://wa.me/11234567890", "_blank")}>
            <FaWhatsapp size={28} color="#25d366" />
            <h4>WhatsApp</h4>
            <p>Chat with us instantly</p>
            <p>Available 24/7</p>
          </div>
        </div>

        {/* CRM Lead Form */}
        <div className="contact-form-section">
          <div className="form-header">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and one of our agents will contact you within 24 hours.</p>
          </div>

          {submitted && (
            <div className="success-banner">
              ✅ Thank you! Your inquiry has been submitted. Our team will reach out to you soon.
            </div>
          )}

          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Budget Range</label>
                <select name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">Select Budget</option>
                  <option value="Under $2,000">Under $2,000/mo</option>
                  <option value="$2,000 - $5,000">$2,000 - $5,000/mo</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000/mo</option>
                  <option value="$10,000+">$10,000+/mo</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Property Type</label>
              <div className="radio-group">
                {["Residential", "Commercial", "Luxury Villa", "Apartment", "Land"].map((type) => (
                  <label key={type} className={`radio-option ${form.propertyType === type ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="propertyType"
                      value={type}
                      checked={form.propertyType === type}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                placeholder="Tell us about your requirements, the area you're interested in, or any specific features you're looking for..."
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="button submit-btn">
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
