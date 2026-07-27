import React from "react";
import './PropertyCard.css'
import {AiFillHeart} from 'react-icons/ai'
import {truncate} from 'lodash'
import { useNavigate } from "react-router-dom";
import Heart from "../Heart/Heart";
const PropertyCard = ({card}) => {
  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="flexColStart r-card" onClick={() => navigate(`../properties/${card.id}`)}>
      <Heart id={card?.id} />
      <img
        src={card.image || fallbackImage}
        alt="home"
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
      />
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>$</span>
        <span>{card.price}</span>
      </span>
      <span className="primaryText">{truncate(card.title, {length: 15})}</span>
      <span className="secondaryText">{truncate(card.description, {length: 80})}</span>
    </div>
  );
};

export default PropertyCard;
