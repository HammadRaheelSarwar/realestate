import dayjs from "dayjs";
import { toast } from "react-toastify";
import { initialProperties } from "./propertiesData";

// Helper to load properties from localStorage or initialize
const getStoredProperties = () => {
  let data = localStorage.getItem("properties");
  if (!data) {
    data = JSON.stringify(initialProperties);
    localStorage.setItem("properties", data);
  }
  return JSON.parse(data);
};

// Helper to save properties to localStorage
const saveProperties = (properties) => {
  localStorage.setItem("properties", JSON.stringify(properties));
};

// Helper to load user profile (favorites/bookings) from localStorage
const getStoredUser = (email) => {
  let users = JSON.parse(localStorage.getItem("users") || "{}");
  if (!users[email]) {
    users[email] = {
      email,
      bookedVisits: [],
      favResidenciesID: []
    };
    localStorage.setItem("users", JSON.stringify(users));
  }
  return users[email];
};

// Helper to save user profile to localStorage
const saveUser = (email, userData) => {
  let users = JSON.parse(localStorage.getItem("users") || "{}");
  users[email] = userData;
  localStorage.setItem("users", JSON.stringify(users));
};

export const getAllProperties = async () => {
  try {
    return getStoredProperties();
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const properties = getStoredProperties();
    const property = properties.find((p) => p.id === id);
    if (!property) throw new Error("Property not found");
    return property;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const createUser = async (email, token) => {
  try {
    getStoredUser(email);
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const bookVisit = async (date, propertyId, email, token) => {
  try {
    const user = getStoredUser(email);
    if (user.bookedVisits.some((b) => b.id === propertyId)) {
      throw new Error("Already booked");
    }
    user.bookedVisits.push({
      id: propertyId,
      date: dayjs(date).format("DD/MM/YYYY"),
    });
    saveUser(email, user);
    toast.success("Visit booked successfully");
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const removeBooking = async (id, email, token) => {
  try {
    const user = getStoredUser(email);
    user.bookedVisits = user.bookedVisits.filter((b) => b.id !== id);
    saveUser(email, user);
    toast.success("Booking removed");
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const toFav = async (id, email, token) => {
  try {
    const user = getStoredUser(email);
    if (user.favResidenciesID.includes(id)) {
      user.favResidenciesID = user.favResidenciesID.filter((favId) => favId !== id);
      toast.info("Removed from favorites");
    } else {
      user.favResidenciesID.push(id);
      toast.success("Added to favorites");
    }
    saveUser(email, user);
  } catch (e) {
    throw e;
  }
};

export const getAllFav = async (email, token) => {
  try {
    const user = getStoredUser(email);
    return user.favResidenciesID;
  } catch (e) {
    toast.error("Something went wrong while fetching favs");
    throw e;
  }
};

export const getAllBookings = async (email, token) => {
  try {
    const user = getStoredUser(email);
    return user.bookedVisits;
  } catch (error) {
    toast.error("Something went wrong while fetching bookings");
    throw error;
  }
};

export const createResidency = async (data, token) => {
  try {
    const properties = getStoredProperties();
    const newProperty = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    properties.push(newProperty);
    saveProperties(properties);
    toast.success("Residency created successfully");
  } catch (error) {
    toast.error("Something went wrong while creating residency");
    throw error;
  }
};