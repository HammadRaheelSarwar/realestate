import React from "react";
import "./Agents.css";
import { FaStar, FaPhone, FaEnvelope } from "react-icons/fa";

const agents = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    phone: "+1 (555) 012-3456",
    email: "sarah@homyz.com",
    rating: 4.9,
    reviews: 128,
    properties: 42,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    speciality: "Luxury Homes",
  },
  {
    id: 2,
    name: "David Carter",
    title: "Property Consultant",
    phone: "+1 (555) 123-4567",
    email: "david@homyz.com",
    rating: 4.7,
    reviews: 96,
    properties: 35,
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    speciality: "Commercial Properties",
  },
  {
    id: 3,
    name: "Emily Zhang",
    title: "Residential Specialist",
    phone: "+1 (555) 234-5678",
    email: "emily@homyz.com",
    rating: 4.8,
    reviews: 112,
    properties: 58,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    speciality: "First-Time Buyers",
  },
  {
    id: 4,
    name: "Michael Torres",
    title: "Investment Advisor",
    phone: "+1 (555) 345-6789",
    email: "michael@homyz.com",
    rating: 4.6,
    reviews: 74,
    properties: 29,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    speciality: "Investment Properties",
  },
  {
    id: 5,
    name: "Amina Patel",
    title: "Luxury Properties Expert",
    phone: "+1 (555) 456-7890",
    email: "amina@homyz.com",
    rating: 4.9,
    reviews: 154,
    properties: 67,
    image: "https://randomuser.me/api/portraits/women/91.jpg",
    speciality: "Luxury Villas",
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Rental Specialist",
    phone: "+1 (555) 567-8901",
    email: "james@homyz.com",
    rating: 4.5,
    reviews: 88,
    properties: 44,
    image: "https://randomuser.me/api/portraits/men/23.jpg",
    speciality: "Rental Markets",
  },
];

const AgentCard = ({ agent }) => (
  <div className="agent-card">
    <img src={agent.image} alt={agent.name} className="agent-img" />
    <div className="agent-info">
      <h3>{agent.name}</h3>
      <p className="agent-title">{agent.title}</p>
      <span className="agent-badge">{agent.speciality}</span>
      <div className="agent-stats">
        <div className="stat">
          <span className="stat-value">{agent.properties}</span>
          <span className="stat-label">Listings</span>
        </div>
        <div className="stat">
          <span className="stat-value">{agent.reviews}</span>
          <span className="stat-label">Reviews</span>
        </div>
        <div className="stat rating">
          <FaStar color="#f9a825" />
          <span className="stat-value">{agent.rating}</span>
        </div>
      </div>
      <div className="agent-contact">
        <a href={`tel:${agent.phone}`}><FaPhone /> {agent.phone}</a>
        <a href={`mailto:${agent.email}`}><FaEnvelope /> {agent.email}</a>
      </div>
    </div>
  </div>
);

const Agents = () => {
  return (
    <div className="agents-wrapper">
      <div className="agents-hero">
        <div className="agents-hero-text">
          <span className="orangeText">Our Team</span>
          <h1 className="primaryText">Meet Our Expert Agents</h1>
          <p className="secondaryText">
            Our team of dedicated real estate professionals is here to help you
            find your perfect home. With years of experience and local market
            expertise, we make your real estate journey seamless.
          </p>
        </div>
      </div>
      <div className="innerWidth paddings agents-container">
        <div className="agents-grid">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;
