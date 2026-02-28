# Credit Card CMS - API Integration Documentation

## 🎯 Purpose
This document provides a complete guide for connecting the Admin Panel with the Website through a RESTful API. Follow this guide when pulling the code from GitHub to build the full-stack application with backend APIs.

---

## 📋 Table of Contents
1. [Current Architecture (Static)](#current-architecture-static)
2. [Target Architecture (API-Driven)](#target-architecture-api-driven)
3. [Technology Stack Recommendations](#technology-stack-recommendations)
4. [Database Schema](#database-schema)
5. [API Endpoints Specification](#api-endpoints-specification)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [Implementation Steps](#implementation-steps)
8. [Frontend Changes Required](#frontend-changes-required)
9. [Authentication & Authorization](#authentication--authorization)
10. [File Upload Strategy](#file-upload-strategy)
11. [Environment Variables](#environment-variables)
12. [Testing Strategy](#testing-strategy)

---

## 1. Current Architecture (Static)

### How It Works Now
```
┌─────────────────────────────────────┐
│   Static Data (creditCardsData)    │
│   /src/app/data/creditCardsData.ts │
└──────────────┬──────────────────────┘
               │
               ├─────────────┐
               ↓             ↓
        ┌──────────┐   ┌──────────┐
        │ Website  │   │  Admin   │
        │  Pages   │   │  Panel   │
        └──────────┘   └──────────┘
```

**Problems:**
- ❌ Changes in Admin Panel don't persist
- ❌ Website doesn't update when admin adds cards
- ❌ No database storage
- ❌ No image upload
- ❌ No user authentication
- ❌ Data resets on page refresh

---

## 2. Target Architecture (API-Driven)

### How It Should Work
```
┌──────────────────────────────────────────────────────────┐
│                     Frontend (React)                      │
│  ┌─────────────────────┐      ┌─────────────────────┐   │
│  │   Website Pages     │      │   Admin Panel       │   │
│  │  - Homepage         │      │  - Dashboard        │   │
│  │  - Card Listing     │      │  - Add/Edit Card    │   │
│  │  - Card Details     │      │  - Banks Mgmt       │   │
│  └─────────┬───────────┘      └─────────┬───────────┘   │
└────────────┼──────────────────────────────┼──────────────┘
             │                              │
             │         HTTP/REST            │
             ↓                              ↓
┌──────────────────────────────────────────────────────────┐
│                    Backend API Server                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │              API Routes (Express/Fastify)          │  │
│  │  GET    /api/cards              (Public)           │  │
│  │  GET    /api/cards/:id          (Public)           │  │
│  │  POST   /api/cards              (Auth Required)    │  │
│  │  PUT    /api/cards/:id          (Auth Required)    │  │
│  │  DELETE /api/cards/:id          (Auth Required)    │  │
│  │  POST   /api/upload             (Auth Required)    │  │
│  │  GET    /api/card-types         (Public)           │  │
│  │  POST   /api/card-types         (Auth Required)    │  │
│  │  GET    /api/card-networks      (Public)           │  │
│  │  POST   /api/admin/login        (Public)           │  │
│  └────────────────────┬───────────────────────────────┘  │
│                       │                                   │
│  ┌────────────────────┴───────────────────────────────┐  │
│  │          Business Logic Layer                      │  │
│  │  - Input Validation (Zod/Joi)                      │  │
│  │  - Authentication (JWT)                            │  │
│  │  - Authorization (Role-based)                      │  │
│  │  - Error Handling                                  │  │
│  └────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │
                          ↓
┌──────────────────────────────────────────────────────────┐
│                    Data Layer                             │
│  ┌─────────────────┐         ┌──────────────────────┐   │
│  │   PostgreSQL    │         │  Cloud Storage       │   │
│  │   (Supabase)    │         │  (AWS S3/Cloudinary) │   │
│  │                 │         │                      │   │
│  │  - cards        │         │  - Card Images       │   │
│  │  - card_types   │         │  - Bank Logos        │   │
│  │  - card_networks│         │                      │   │
│  │  - banks        │         │                      │   │
│  │  - admins       │         │                      │   │
│  │  - audit_logs   │         │                      │   │
│  └─────────────────┘         └──────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack Recommendations

### Backend Options

#### Option A: Node.js + Express + Supabase (Recommended)
```
Backend Framework: Express.js
Database: Supabase (PostgreSQL)
ORM: Prisma or Supabase Client
Authentication: Supabase Auth
File Storage: Supabase Storage
Validation: Zod
```

**Pros:**
- ✅ Easy integration with existing React frontend
- ✅ Supabase provides instant APIs
- ✅ Built-in authentication
- ✅ Free tier available
- ✅ Real-time capabilities

#### Option B: Node.js + Express + Custom Setup
```
Backend Framework: Express.js
Database: PostgreSQL (hosted)
ORM: Prisma
Authentication: JWT + bcrypt
File Storage: AWS S3 or Cloudinary
Validation: Zod
```

**Pros:**
- ✅ Full control
- ✅ Can be hosted anywhere
- ✅ More customization

#### Option C: Next.js API Routes (Full-Stack)
```
Framework: Next.js 14+ (App Router)
Database: Prisma + PostgreSQL
Authentication: NextAuth.js
File Storage: Vercel Blob or AWS S3
```

**Pros:**
- ✅ Single codebase
- ✅ API routes in same project
- ✅ Easy deployment

### Recommended: **Option A (Supabase)**

---

## 4. Database Schema

### Supabase PostgreSQL Tables

#### Table: `cards`
```sql
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_name VARCHAR(255) NOT NULL,
    bank_id UUID REFERENCES banks(id),
    card_image_url TEXT,
    joining_fee VARCHAR(100),
    annual_fee VARCHAR(100),
    interest_rate VARCHAR(50),
    reward_program_name VARCHAR(255),
    welcome_bonus TEXT,
    card_type_id UUID REFERENCES card_types(id),
    network_id UUID REFERENCES card_networks(id),
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'enabled', 'disabled'
    
    -- Structured data (JSON)
    benefits JSONB, -- Array of benefits
    categories JSONB, -- Array of category strings
    rewards_details JSONB, -- Structured rewards data
    product_description TEXT,
    product_features JSONB, -- Array of features
    special_perks JSONB, -- Array of perks
    eligibility_criteria JSONB, -- Object with age, income, etc.
    pros JSONB, -- Array of pros
    cons JSONB, -- Array of cons
    custom_fees JSONB, -- Array of {feeType, amount}
    
    -- SEO fields
    meta_title VARCHAR(255),
    meta_description TEXT,
    slug VARCHAR(255) UNIQUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES admins(id),
    updated_by UUID REFERENCES admins(id)
);

-- Indexes
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_bank ON cards(bank_id);
CREATE INDEX idx_cards_slug ON cards(slug);
```

#### Table: `banks`
```sql
CREATE TABLE banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_name VARCHAR(255) NOT NULL UNIQUE,
    bank_code VARCHAR(50),
    bank_logo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO banks (bank_name, bank_code) VALUES 
    ('HDFC Bank', 'HDFC'),
    ('ICICI Bank', 'ICICI'),
    ('State Bank of India', 'SBI'),
    ('Axis Bank', 'AXIS'),
    ('Kotak Mahindra Bank', 'KOTAK'),
    ('IndusInd Bank', 'INDUSIND');
```

#### Table: `card_types`
```sql
CREATE TABLE card_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_name VARCHAR(100) NOT NULL UNIQUE,
    display_order INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO card_types (type_name, display_order) VALUES 
    ('Travel', 1),
    ('Shopping', 2),
    ('Dining', 3),
    ('Cashback', 4),
    ('Rewards', 5),
    ('Fuel', 6),
    ('Business', 7);
```

#### Table: `card_networks`
```sql
CREATE TABLE card_networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO card_networks (network_name) VALUES 
    ('Visa'),
    ('Mastercard'),
    ('RuPay'),
    ('American Express');
```

#### Table: `admins`
```sql
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin'
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `audit_logs`
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id),
    action VARCHAR(50), -- 'create', 'update', 'delete', 'publish'
    entity_type VARCHAR(50), -- 'card', 'bank', 'card_type'
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Entity Relationship Diagram
```
┌─────────────┐         ┌──────────────┐
│    admins   │────┐    │    cards     │
└─────────────┘    │    └───────┬──────┘
                   │            │
                   │            ├──────┐
                   │            │      │
                   ↓            ↓      ↓
              ┌─────────────┐  │   ┌────────────────┐
              │ audit_logs  │  │   │  card_types    │
              └─────────────┘  │   └────────────────┘
                               ↓
                         ┌────────────────┐
                         │  card_networks │
                         └────────────────┘
                               ↓
                         ┌────────────────┐
                         │     banks      │
                         └────────────────┘
```

---

## 5. API Endpoints Specification

### Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

### Public Endpoints (No Auth Required)

#### 1. Get All Cards
```http
GET /api/cards
```

**Query Parameters:**
- `status` (optional): "enabled" | "disabled" | "draft" (default: "enabled")
- `bank` (optional): Bank ID or name
- `type` (optional): Card type ID
- `network` (optional): Network ID
- `search` (optional): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "uuid",
        "card_name": "HDFC Regalia Credit Card",
        "bank": {
          "id": "uuid",
          "bank_name": "HDFC Bank",
          "bank_logo_url": "https://..."
        },
        "card_image_url": "https://...",
        "joining_fee": "Free",
        "annual_fee": "₹2,500",
        "benefits": [
          "Welcome bonus of 5,000 points",
          "Complimentary airport lounge access"
        ],
        "categories": ["Travel", "Shopping"],
        "card_type": {
          "id": "uuid",
          "type_name": "Travel"
        },
        "network": {
          "id": "uuid",
          "network_name": "Visa"
        },
        "status": "enabled",
        "slug": "hdfc-regalia-credit-card",
        "created_at": "2026-02-28T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

#### 2. Get Single Card by ID or Slug
```http
GET /api/cards/:idOrSlug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "card_name": "HDFC Regalia Credit Card",
    "bank": {...},
    "card_image_url": "https://...",
    "joining_fee": "Free",
    "annual_fee": "₹2,500",
    "interest_rate": "3.5% per month",
    "reward_program_name": "HDFC RewardZ Points",
    "welcome_bonus": "5,000 bonus points",
    "benefits": ["..."],
    "categories": ["Travel"],
    "rewards_details": {
      "rewards_rate": "4 points per ₹150",
      "reward_redemption": "Redeem for flights, shopping",
      "welcome_bonus_details": "..."
    },
    "product_description": "...",
    "product_features": ["..."],
    "special_perks": ["..."],
    "eligibility_criteria": {
      "age_requirement": "21-60 years",
      "minimum_income": "₹3,00,000 per annum",
      "credit_score": "700+",
      "employment_status": "Salaried",
      "documents": ["PAN Card", "Aadhaar", "Salary Slip"]
    },
    "pros": ["..."],
    "cons": ["..."],
    "custom_fees": [
      {"feeType": "Foreign Transaction", "amount": "3.5%"}
    ],
    "created_at": "2026-02-28T10:00:00Z",
    "updated_at": "2026-02-28T10:00:00Z"
  }
}
```

#### 3. Get Card Types
```http
GET /api/card-types
```

**Response:**
```json
{
  "success": true,
  "data": [
    {"id": "uuid", "type_name": "Travel", "display_order": 1},
    {"id": "uuid", "type_name": "Shopping", "display_order": 2}
  ]
}
```

#### 4. Get Card Networks
```http
GET /api/card-networks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {"id": "uuid", "network_name": "Visa"},
    {"id": "uuid", "network_name": "Mastercard"}
  ]
}
```

#### 5. Get Banks
```http
GET /api/banks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bank_name": "HDFC Bank",
      "bank_code": "HDFC",
      "bank_logo_url": "https://..."
    }
  ]
}
```

### Admin Endpoints (Auth Required)

#### Authentication Header
```
Authorization: Bearer <JWT_TOKEN>
```

#### 6. Admin Login
```http
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "uuid",
      "email": "admin@example.com",
      "full_name": "Admin User",
      "role": "admin"
    }
  }
}
```

#### 7. Create Card
```http
POST /api/cards
```

**Request Body:**
```json
{
  "card_name": "HDFC Regalia Credit Card",
  "bank_id": "uuid",
  "card_image_url": "https://...",
  "joining_fee": "Free",
  "annual_fee": "₹2,500",
  "interest_rate": "3.5% per month",
  "reward_program_name": "HDFC RewardZ Points",
  "welcome_bonus": "5,000 bonus points",
  "card_type_id": "uuid",
  "network_id": "uuid",
  "status": "draft",
  "benefits": ["Welcome bonus", "Lounge access"],
  "categories": ["Travel", "Shopping"],
  "rewards_details": {...},
  "product_description": "...",
  "product_features": ["..."],
  "special_perks": ["..."],
  "eligibility_criteria": {...},
  "pros": ["..."],
  "cons": ["..."],
  "custom_fees": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "card_name": "HDFC Regalia Credit Card",
    "slug": "hdfc-regalia-credit-card",
    "...": "..."
  },
  "message": "Card created successfully"
}
```

#### 8. Update Card
```http
PUT /api/cards/:id
```

**Request Body:** Same as Create Card

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Card updated successfully"
}
```

#### 9. Delete Card
```http
DELETE /api/cards/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Card deleted successfully"
}
```

#### 10. Upload Card Image
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <image file>
type: "card_image" | "bank_logo"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/cards/image-uuid.jpg",
    "filename": "image-uuid.jpg",
    "size": 152048,
    "mimeType": "image/jpeg"
  }
}
```

#### 11. Create Card Type
```http
POST /api/card-types
```

**Request Body:**
```json
{
  "type_name": "Premium Travel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type_name": "Premium Travel",
    "display_order": 8
  }
}
```

#### 12. Delete Card Type
```http
DELETE /api/card-types/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Card type deleted successfully"
}
```

#### 13. Create Card Network
```http
POST /api/card-networks
```

**Request Body:**
```json
{
  "network_name": "Discover"
}
```

#### 14. Delete Card Network
```http
DELETE /api/card-networks/:id
```

#### 15. Get Admin Dashboard Stats
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCards": 45,
    "enabledCards": 38,
    "draftCards": 5,
    "disabledCards": 2,
    "totalBanks": 12,
    "recentActivity": [...]
  }
}
```

---

## 6. Data Flow Diagrams

### User Views Card on Website
```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Opens website
     ↓
┌──────────────────┐
│  Homepage        │
│  (React)         │
└────┬─────────────┘
     │ 2. useEffect → fetch cards
     ↓
┌──────────────────────────┐
│  GET /api/cards          │
│  ?status=enabled         │
└────┬─────────────────────┘
     │ 3. Query database
     ↓
┌──────────────────────────┐
│  PostgreSQL              │
│  SELECT * FROM cards     │
│  WHERE status='enabled'  │
└────┬─────────────────────┘
     │ 4. Return data
     ↓
┌──────────────────────────┐
│  React Component         │
│  - Map cards to UI       │
│  - Display images        │
│  - Show benefits         │
└──────────────────────────┘
```

### Admin Creates New Card
```
┌──────────┐
│  Admin   │
└────┬─────┘
     │ 1. Login
     ↓
┌──────────────────────────┐
│  POST /api/admin/login   │
└────┬─────────────────────┘
     │ 2. Returns JWT token
     ↓
┌──────────────────────────┐
│  Admin Panel             │
│  - Store token in state  │
└────┬─────────────────────┘
     │ 3. Fill form
     ↓
┌──────────────────────────┐
│  Upload Card Image       │
│  POST /api/upload        │
└────┬─────────────────────┘
     │ 4. Returns image URL
     ↓
┌──────────────────────────┐
│  Submit Form             │
│  POST /api/cards         │
│  + JWT token             │
└────┬─────────────────────┘
     │ 5. Validate data
     ↓
┌──────────────────────────┐
│  Insert into Database    │
│  CREATE slug from name   │
└────┬─────────────────────┘
     │ 6. Log audit trail
     ↓
┌──────────────────────────┐
│  INSERT audit_logs       │
└────┬─────────────────────┘
     │ 7. Return success
     ↓
┌──────────────────────────┐
│  Show success toast      │
│  Redirect to dashboard   │
└──────────────────────────┘
```

---

## 7. Implementation Steps

### Phase 1: Backend Setup (Week 1)

#### Step 1: Initialize Backend Project
```bash
# Create backend folder
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv
npm install @supabase/supabase-js
npm install jsonwebtoken bcryptjs
npm install zod
npm install multer cloudinary  # for file uploads
npm install morgan  # logging

# Install dev dependencies
npm install -D typescript @types/node @types/express
npm install -D nodemon ts-node
```

#### Step 2: Setup Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get API URL and keys
4. Run database migrations (see schema above)

#### Step 3: Create Backend Structure
```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   ├── supabase.ts         # Supabase client
│   │   └── cloudinary.ts       # Image upload config
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification
│   │   ├── validation.ts       # Request validation
│   │   └── errorHandler.ts    # Error handling
│   ├── routes/
│   │   ├── cards.ts            # Card routes
│   │   ├── admin.ts            # Admin routes
│   │   ├── upload.ts           # File upload
│   │   ├── cardTypes.ts        # Card types routes
│   │   └── cardNetworks.ts    # Networks routes
│   ├── controllers/
│   │   ├── cardController.ts
│   │   ├── adminController.ts
│   │   └── uploadController.ts
│   ├── services/
│   │   ├── cardService.ts      # Business logic
│   │   └── authService.ts
│   ├── utils/
│   │   ├── slugify.ts          # Generate slugs
│   │   └── validators.ts       # Zod schemas
│   └── types/
│       └── index.ts            # TypeScript types
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

#### Step 4: Create API Server (`src/index.ts`)
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Routes
import cardRoutes from './routes/cards';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';
import cardTypeRoutes from './routes/cardTypes';
import cardNetworkRoutes from './routes/cardNetworks';

// Middleware
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/cards', cardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/card-types', cardTypeRoutes);
app.use('/api/card-networks', cardNetworkRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

#### Step 5: Supabase Client (`src/config/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### Step 6: Authentication Middleware (`src/middleware/auth.ts`)
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};
```

#### Step 7: Create .env File
```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Cloudinary (for image upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Phase 2: API Implementation (Week 2)

#### Cards Controller Example (`src/controllers/cardController.ts`)
```typescript
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { createSlug } from '../utils/slugify';

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const { 
      status = 'enabled', 
      bank, 
      type, 
      search,
      page = 1,
      limit = 20 
    } = req.query;

    let query = supabase
      .from('cards')
      .select(`
        *,
        bank:banks(*),
        card_type:card_types(*),
        network:card_networks(*)
      `)
      .eq('status', status);

    if (bank) query = query.eq('bank_id', bank);
    if (type) query = query.eq('card_type_id', type);
    if (search) query = query.ilike('card_name', `%${search}%`);

    // Pagination
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: {
        cards: data,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching cards' 
    });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const cardData = req.body;
    
    // Generate slug
    cardData.slug = createSlug(cardData.card_name);
    
    // Add audit fields
    cardData.created_by = req.user.id;
    cardData.updated_by = req.user.id;

    const { data, error } = await supabase
      .from('cards')
      .insert(cardData)
      .select()
      .single();

    if (error) throw error;

    // Log audit trail
    await supabase.from('audit_logs').insert({
      admin_id: req.user.id,
      action: 'create',
      entity_type: 'card',
      entity_id: data.id,
      new_data: data,
      ip_address: req.ip
    });

    res.status(201).json({
      success: true,
      data,
      message: 'Card created successfully'
    });
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating card' 
    });
  }
};

// More functions: getCardById, updateCard, deleteCard...
```

### Phase 3: Frontend Integration (Week 3)

#### Step 1: Create API Service Layer

Create `/src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('admin_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Card APIs
export const cardAPI = {
  getAll: (params?: any) => fetchAPI(`/cards?${new URLSearchParams(params)}`),
  
  getById: (id: string) => fetchAPI(`/cards/${id}`),
  
  create: (data: any) => fetchAPI('/cards', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchAPI(`/cards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/cards/${id}`, {
    method: 'DELETE',
  }),
};

// Admin APIs
export const adminAPI = {
  login: (email: string, password: string) => 
    fetchAPI('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  getStats: () => fetchAPI('/admin/stats'),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  },
};

// Card Types API
export const cardTypeAPI = {
  getAll: () => fetchAPI('/card-types'),
  create: (type_name: string) => fetchAPI('/card-types', {
    method: 'POST',
    body: JSON.stringify({ type_name }),
  }),
  delete: (id: string) => fetchAPI(`/card-types/${id}`, {
    method: 'DELETE',
  }),
};

// Card Networks API
export const cardNetworkAPI = {
  getAll: () => fetchAPI('/card-networks'),
  create: (network_name: string) => fetchAPI('/card-networks', {
    method: 'POST',
    body: JSON.stringify({ network_name }),
  }),
  delete: (id: string) => fetchAPI(`/card-networks/${id}`, {
    method: 'DELETE',
  }),
};
```

#### Step 2: Update Frontend Components

Update `/src/app/pages/AdminPage.tsx`:
```typescript
// Add imports
import { cardAPI, cardTypeAPI, cardNetworkAPI, uploadAPI } from '../../services/api';
import { useEffect } from 'react';

// Inside AdminPage component:
const [cards, setCards] = useState([]);
const [loading, setLoading] = useState(false);

// Fetch cards on mount
useEffect(() => {
  fetchCards();
}, []);

const fetchCards = async () => {
  try {
    setLoading(true);
    const response = await cardAPI.getAll({ status: 'all' });
    setCards(response.data.cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    // Show error toast
  } finally {
    setLoading(false);
  }
};

// Handle save card
const handleSaveCard = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    if (editingCard) {
      // Update existing card
      await cardAPI.update(editingCard.id, formData);
      // Show success toast
    } else {
      // Create new card
      await cardAPI.create(formData);
      // Show success toast
    }
    
    // Refresh cards list
    await fetchCards();
    
    // Reset form
    setFormData({...});
    setActiveTab('dashboard');
  } catch (error) {
    console.error('Error saving card:', error);
    // Show error toast
  } finally {
    setLoading(false);
  }
};

// Handle delete card
const handleDeleteCard = async (cardId: string) => {
  if (!confirm('Are you sure you want to delete this card?')) return;
  
  try {
    await cardAPI.delete(cardId);
    // Show success toast
    await fetchCards();
  } catch (error) {
    console.error('Error deleting card:', error);
    // Show error toast
  }
};

// Handle image upload
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  try {
    setLoading(true);
    const response = await uploadAPI.uploadImage(file, 'card_image');
    setFormData({ ...formData, cardImage: response.data.url });
    // Show success toast
  } catch (error) {
    console.error('Error uploading image:', error);
    // Show error toast
  } finally {
    setLoading(false);
  }
};
```

Update `/src/app/components/CreditCardSection.tsx`:
```typescript
// Replace static data with API call
const [cards, setCards] = useState<CreditCardProps[]>([]);

useEffect(() => {
  fetchCards();
}, []);

const fetchCards = async () => {
  try {
    const response = await cardAPI.getAll({ status: 'enabled' });
    setCards(response.data.cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};
```

#### Step 3: Add Toast Notifications

Install toast library:
```bash
npm install sonner
```

Create toast context `/src/contexts/ToastContext.tsx`:
```typescript
import { Toaster, toast } from 'sonner';

// In your main App.tsx:
<Toaster position="top-right" />

// Usage in components:
toast.success('Card created successfully!');
toast.error('Failed to delete card');
toast.loading('Uploading image...');
```

#### Step 4: Add Environment Variables

Create `.env` in frontend root:
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 8. Frontend Changes Required

### Files to Modify

1. **`/src/app/data/creditCardsData.ts`**
   - Keep for TypeScript types
   - Remove static data (or keep as fallback)

2. **`/src/app/pages/AdminPage.tsx`**
   - Add API calls for CRUD operations
   - Add loading states
   - Add error handling
   - Add image upload functionality

3. **`/src/app/components/CreditCardSection.tsx`**
   - Fetch cards from API instead of static data
   - Add loading skeleton
   - Add error state

4. **`/src/app/pages/CreditCardDetailPage.tsx`**
   - Fetch card by ID from API
   - Add loading state
   - Handle 404 errors

5. **`/src/app/pages/LenderPage.tsx`**
   - Fetch lender cards from API
   - Filter by bank

### New Files to Create

1. **`/src/services/api.ts`** - API service layer
2. **`/src/contexts/AuthContext.tsx`** - Admin authentication
3. **`/src/contexts/ToastContext.tsx`** - Toast notifications
4. **`/src/hooks/useCards.ts`** - Custom hook for cards
5. **`/src/components/LoadingSkeleton.tsx`** - Loading states
6. **`/src/components/ErrorBoundary.tsx`** - Error handling

---

## 9. Authentication & Authorization

### Admin Login Flow

1. Admin enters email/password
2. POST to `/api/admin/login`
3. Backend validates credentials
4. Returns JWT token
5. Frontend stores token in localStorage
6. All admin requests include `Authorization: Bearer <token>`
7. Backend verifies token on protected routes

### Create Login Page

`/src/app/pages/AdminLoginPage.tsx`:
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { adminAPI } from '../../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminAPI.login(email, password);
      
      // Store token
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
      
      // Redirect to admin panel
      navigate('/admin');
    } catch (error) {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Protect Admin Routes

```typescript
// In routes.ts
{
  path: "/admin/login",
  Component: AdminLoginPage,
},
{
  path: "/admin",
  Component: AdminPage,
  loader: () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      throw redirect('/admin/login');
    }
    return null;
  }
}
```

---

## 10. File Upload Strategy

### Option A: Cloudinary (Recommended)

**Setup:**
```bash
npm install cloudinary multer
```

**Backend Upload Controller:**
```typescript
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'credit-cards' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};
```

### Option B: Supabase Storage

```typescript
import { supabase } from '../config/supabase';

export const uploadToSupabase = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('card-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('card-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
```

---

## 11. Environment Variables

### Backend `.env`
```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database (Supabase)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Authentication
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=7d

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret

# Or use Supabase Storage
SUPABASE_STORAGE_BUCKET=card-images
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 12. Testing Strategy

### Backend API Tests

Install testing libraries:
```bash
npm install -D jest supertest @types/jest @types/supertest
```

Example test (`tests/cards.test.ts`):
```typescript
import request from 'supertest';
import app from '../src/index';

describe('Cards API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'test@example.com', password: 'password' });
    authToken = res.body.data.token;
  });

  describe('GET /api/cards', () => {
    it('should return all enabled cards', async () => {
      const res = await request(app)
        .get('/api/cards')
        .query({ status: 'enabled' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.cards)).toBe(true);
    });
  });

  describe('POST /api/cards', () => {
    it('should create a new card', async () => {
      const cardData = {
        card_name: 'Test Card',
        bank_id: 'uuid',
        joining_fee: 'Free',
        // ... more fields
      };

      const res = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.card_name).toBe('Test Card');
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/cards')
        .send({});

      expect(res.status).toBe(401);
    });
  });
});
```

### Frontend Integration Tests

Use Vitest or React Testing Library

---

## 📊 Implementation Checklist

### Backend Setup
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Setup Supabase project
- [ ] Create database tables
- [ ] Implement API routes
- [ ] Add authentication middleware
- [ ] Setup file upload (Cloudinary/Supabase Storage)
- [ ] Add input validation (Zod)
- [ ] Implement error handling
- [ ] Add CORS configuration
- [ ] Create audit logging
- [ ] Write API tests

### Frontend Integration
- [ ] Create API service layer (`/src/services/api.ts`)
- [ ] Add environment variables
- [ ] Update AdminPage with API calls
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement toast notifications
- [ ] Create login page
- [ ] Protect admin routes
- [ ] Update CreditCardSection to fetch from API
- [ ] Update CreditCardDetailPage to fetch from API
- [ ] Add image upload component
- [ ] Test all CRUD operations

### Deployment
- [ ] Deploy backend to Render/Railway/Heroku
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure production environment variables
- [ ] Setup SSL certificates
- [ ] Configure CORS for production
- [ ] Test production deployment
- [ ] Setup monitoring (Sentry)
- [ ] Create backup strategy

---

## 🚀 Quick Start Commands

### Clone and Setup
```bash
# Clone repository
git clone <your-repo>
cd credit-card-cms

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev  # Starts on http://localhost:3001

# Setup frontend (in new terminal)
cd ../
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev  # Starts on http://localhost:5173
```

### Create First Admin User
```sql
-- Run in Supabase SQL Editor
INSERT INTO admins (email, password_hash, full_name, role)
VALUES (
  'admin@example.com',
  '$2a$10$...',  -- Use bcrypt to hash 'password123'
  'Admin User',
  'super_admin'
);
```

Or use Node.js script:
```typescript
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('password123', 10);
console.log(hash);
```

---

## 📝 Notes

1. **Security:** Always use HTTPS in production
2. **Rate Limiting:** Add rate limiting to prevent abuse
3. **Caching:** Consider Redis for caching frequently accessed data
4. **CDN:** Use Cloudflare or similar for static assets
5. **Monitoring:** Setup error tracking with Sentry
6. **Backups:** Automate database backups
7. **Documentation:** Keep API documentation updated (Swagger/Postman)

---

## 🆘 Troubleshooting

### CORS Errors
- Check CORS origin in backend
- Verify frontend URL in environment variables

### 401 Unauthorized
- Check JWT token is being sent
- Verify token hasn't expired
- Check JWT_SECRET matches

### Database Connection Errors
- Verify Supabase URL and keys
- Check network connectivity
- Ensure database tables exist

### File Upload Failing
- Check Cloudinary credentials
- Verify file size limits
- Check MIME type restrictions

---

**Last Updated:** February 28, 2026  
**Version:** 1.0  
**Author:** Technical Documentation Team
