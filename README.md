<div align="center">

# 🛒 E-MarketX — Full-Stack Multi-Vendor E-Commerce Platform

### A complete Amazon-style marketplace with Buyer, Vendor & Admin portals — built with Next.js, MongoDB & Cloudinary

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-4CAF50?style=for-the-badge&logo=vercel)](https://full-stack-multi-vendor-e-com.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/AhmedDevx07/Full-Stack-Multi-Vendor-E-Commerce)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

</div>

---

## 📌 Overview

**E-MarketX** is a complete, production-ready multi-vendor e-commerce marketplace — similar to Amazon — where multiple vendors sell products under one platform while admins oversee the entire ecosystem. Built entirely with **Next.js** (full-stack: frontend + API routes), **MongoDB**, **JWT authentication**, and **Cloudinary** for media management.

The platform is split into **three fully isolated portals**: a public **Buyer storefront**, a protected **Vendor Dashboard**, and a protected **Admin Dashboard** — each with its own layout, theme, and role-based permissions enforced via middleware.

This project was built as part of the **Internee.pk Internship Program**, focused on real-world e-commerce architecture: role-based access control, secure auth flows, cart/checkout systems, and multi-tenant dashboard design.

---

## 🚀 Live Demo

🔗 **[https://full-stack-multi-vendor-e-com.vercel.app/](https://full-stack-multi-vendor-e-com.vercel.app/)**

---

## ✨ Key Features

### 🛍️ Buyer Storefront (Public — No Login Required)
- **Home Page** — hero section, latest products carousel, best-sellers carousel, features grid
- **Shop Page** — full product grid with category filtering, search, and sorting
- **Product Detail Page** — full product info, images, pricing, vendor info, add-to-cart
- **Cart Drawer** — slide-in side panel to add/remove items and update quantities
- **Secure Checkout** — login-protected checkout flow with shipping form, order review & order placement
- **About & Contact Pages**
- Sticky, modern **Navbar** with live cart count and role-aware menu (Vendor/Admin portal links)
- Clean **Footer** with brand info and navigation links

### 🏪 Vendor Dashboard (Protected)
- Dedicated dark-themed sidebar layout (navbar/footer hidden for a focused workspace)
- **Dashboard Hub** — analytics on total catalog items, approved products, active marketplace feeds
- **Launch Product** — add new products to the marketplace
- **Manage Inventory** — edit/update/remove own products
- Secure session termination (logout)

### 👨‍💼 Admin Dashboard (Protected)
- Dedicated dark-themed sidebar layout with a distinct accent (Rose) for clear role separation
- **Control Dashboard** — platform-wide analytics: gross revenue, total platform volume, active accounts, global catalog size
- **Manage Products** — approve/reject vendor product submissions
- **Manage Vendors** — view and remove vendor accounts
- **View Orders** — live system-wide order feed across all vendors

### 🔐 Authentication & Role-Based Access Control
- JWT-based authentication with tokens stored in both **localStorage** and **cookies**
- Password hashing via **bcryptjs**
- **Role-based redirects on login:** Vendor → `/vendor`, Admin → `/admin`, User → `/`
- **Middleware-enforced route protection:**
  - `/checkout` → requires login
  - `/vendor/*` → vendor role only
  - `/admin/*` → admin role only
- Hard-redirect logout flow with full session/token cleanup

### 🖼️ Media Management
- Product images uploaded and served via **Cloudinary** for optimized delivery

### 🎨 UI/UX
- Fully responsive across mobile (320px+), tablet (768px+), and desktop (1024px+)
- Distinct visual themes per portal: White/Indigo (Buyer) · Dark/Indigo (Vendor) · Dark/Rose (Admin)
- Bento-style analytics cards, glassmorphic navbar, and clean data tables for order management

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js (App Router — Full-Stack: Frontend + API Routes) |
| **Frontend** | React (via Next.js), Tailwind CSS |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT, bcryptjs, Middleware-based route protection |
| **Media Storage** | Cloudinary |
| **State Management** | React Context API (Auth & Cart) |
| **Deployment** | Vercel |

---

## 🗂️ Project Structure

```
Full-Stack-Multi-Vendor-E-Commerce/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # register, login
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── admin/
│   │   ├── admin/                 # Admin dashboard pages
│   │   │   ├── layout.js
│   │   │   └── orders/page.js
│   │   ├── vendor/                # Vendor dashboard pages
│   │   │   ├── layout.js
│   │   │   ├── add-product/
│   │   │   └── manage-products/
│   │   ├── checkout/page.js       # Login-protected checkout
│   │   ├── products/[id]/         # Product detail page
│   │   ├── shop/
│   │   ├── about/
│   │   ├── contact/
│   │   └── layout.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── CartDrawer.js
│   │   └── LayoutConditionalWrapper.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── middleware.js              # Role-based route protection
│   └── models/                    # MongoDB schemas
├── PROJECT_SUMMARY.md
├── next.config.mjs
├── package.json
└── README.md
```

---

## 👥 User Roles & Permissions

| Role | Access |
|---|---|
| **Buyer (User)** | Browse products, add to cart, checkout, place orders, track order status |
| **Vendor** | Dashboard analytics, add/manage own products, view own product performance |
| **Admin** | Platform-wide analytics, manage all products, manage all vendors, view all orders |

---

## 🔄 Data Flow

**Registration:** Signup form → `/api/auth/register` → MongoDB → redirect to login

**Login:** Login form → `/api/auth/login` → JWT issued → role-based redirect (`vendor → /vendor`, `admin → /admin`, `user → /`)

**Browsing:** Home/Shop → `/api/products` → display products → add to cart

**Checkout:** Cart → "Proceed to Secure Checkout" → middleware checks login → `/checkout` → shipping form → `/api/orders` (POST) → order saved → cart cleared → redirect home

**Admin Order Management:** `/admin/orders` → `/api/admin/orders` → live order feed displayed in table

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AhmedDevx07/Full-Stack-Multi-Vendor-E-Commerce.git
cd Full-Stack-Multi-Vendor-E-Commerce

# 2. Install dependencies
npm install
```

Create a `.env.local` file in the root:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

```bash
# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 To test the Admin portal, manually update a user's `role` field to `"admin"` in MongoDB after registration.

---

## 🎯 Task Requirements Covered

| Requirement | Status |
|---|---|
| Multi-vendor e-commerce architecture | ✅ Done |
| User Authentication & Role-Based Access (User/Admin/Vendor) | ✅ Done |
| Admin Panel — manage orders, products, vendors | ✅ Done |
| Vendor Panel — manage own orders & products | ✅ Done |
| Secure password handling (bcryptjs) | ✅ Done |
| JWT-based authentication with middleware protection | ✅ Done |
| Cart & secure checkout flow | ✅ Done |
| Image upload & management (Cloudinary) | ✅ Done |
| Responsive UI (Tailwind CSS) | ✅ Done |
| Deployment on Vercel | ✅ Done |

---

## 👨‍💻 Developer

**Muhammad Ahmed**
- 🌐 Portfolio: [ahmeddevx07.vercel.app](https://ahmeddevx07.vercel.app)
- 💼 LinkedIn: [linkedin.com/in/your-linkedin](https://linkedin.com/in/ahmeddevx07)
- 🐙 GitHub: [github.com/AhmedDevx07](https://github.com/AhmedDevx07)

---

## 🏢 Internship

Built as part of the **Internee.pk Internship Program** — Pakistan's leading virtual internship platform.

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ by [Muhammad Ahmed](https://github.com/AhmedDevx07)

</div>
