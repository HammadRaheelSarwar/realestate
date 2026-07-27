import React from "react";
import "./Blog.css";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for First-Time Home Buyers",
    excerpt: "Buying your first home is exciting but can be overwhelming. Here are five essential tips to help you navigate the process with confidence and find the perfect place to call home.",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Buying Tips",
    date: "July 15, 2025",
    readTime: "5 min read",
    author: "Sarah Johnson",
  },
  {
    id: 2,
    title: "Understanding Mortgages: A Complete Guide",
    excerpt: "Mortgages can be complex, but understanding the basics is crucial before you buy. Learn about fixed vs. adjustable rates, down payments, and how to get the best deal.",
    image: "https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Finance",
    date: "July 10, 2025",
    readTime: "8 min read",
    author: "David Carter",
  },
  {
    id: 3,
    title: "Top 10 Things to Look for When Viewing a Property",
    excerpt: "Don't let emotions cloud your judgment when viewing a potential new home. This checklist will help you evaluate properties objectively and make a smart decision.",
    image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Property Guide",
    date: "July 5, 2025",
    readTime: "6 min read",
    author: "Emily Zhang",
  },
  {
    id: 4,
    title: "Real Estate Investment Strategies for 2025",
    excerpt: "The real estate market is evolving rapidly. Discover the most profitable investment strategies for 2025 and how to build a robust property portfolio.",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Investment",
    date: "June 28, 2025",
    readTime: "10 min read",
    author: "Michael Torres",
  },
  {
    id: 5,
    title: "How to Stage Your Home for a Quick Sale",
    excerpt: "Home staging is one of the most effective ways to sell your property faster and at a higher price. Learn the professional secrets that real estate agents use.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Selling Tips",
    date: "June 20, 2025",
    readTime: "7 min read",
    author: "Amina Patel",
  },
  {
    id: 6,
    title: "Renting vs. Buying: Which is Right for You?",
    excerpt: "The renting vs. buying debate is one of the biggest financial decisions you'll ever make. We break down the pros and cons of each option to help you choose wisely.",
    image: "https://images.pexels.com/photos/1127119/pexels-photo-1127119.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Lifestyle",
    date: "June 15, 2025",
    readTime: "6 min read",
    author: "James Wilson",
  },
];

const BlogCard = ({ post }) => (
  <div className="blog-card">
    <div className="blog-img-wrapper">
      <img src={post.image} alt={post.title} className="blog-img" />
      <span className="blog-category">{post.category}</span>
    </div>
    <div className="blog-content">
      <div className="blog-meta">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
      <h3>{post.title}</h3>
      <p className="blog-excerpt">{post.excerpt}</p>
      <div className="blog-footer">
        <span className="blog-author">By {post.author}</span>
        <button className="blog-read-btn">Read More →</button>
      </div>
    </div>
  </div>
);

const Blog = () => {
  return (
    <div className="blog-wrapper">
      <div className="blog-hero">
        <span className="orangeText">Our Blog</span>
        <h1 className="primaryText">Real Estate Insights & Tips</h1>
        <p className="secondaryText">
          Stay informed with the latest trends, tips, and news in the real estate world.
        </p>
      </div>
      <div className="innerWidth paddings blog-container">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
