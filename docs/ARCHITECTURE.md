# Architecture & Technical Design: BuyWise

## 1. System Overview

```
+-------------------------------------------------------------+
|                     Client (React + Vite)                   |
|  - Modern Chat UI (ChatGPT/Linear inspired aesthetic)       |
|  - Collapsible Sidebar with Conversation History (Local)   |
|  - Rich Message Stream: Text, Product Cards, Comparisons    |
|  - Suggested Starter Prompts & Quick Actions                |
+------------------------------+------------------------------+
                               |
                        HTTP / JSON
                               |
+------------------------------v------------------------------+
|                     Server (Express.js)                     |
|  - POST /api/chat       -> Conversation & Advice Handler    |
|  - GET  /api/products   -> Filter & Search Product Dataset  |
|  - GET  /api/health     -> Service Health & AI Status       |
+------------------------------+------------------------------+
                               |
            +------------------+------------------+
            |                                     |
+-----------v------------+            +-----------v------------+
|  Gemini AI API Engine   |            | Local Advisor Engine   |
|  - Model: gemini-2.5-   |            | - Keyword extraction   |
|    flash               |            | - Budget-aware filter  |
|  - Grounded Context     |            | - Comparison generator |
|  - Structured Responses |            | - Standby / Offline    |
+-----------+------------+            +-----------+------------+
            |                                     |
            +------------------+------------------+
                               |
+------------------------------v------------------------------+
|             Curated Product Dataset (products.json)         |
|  - 25 Genuine Products across 5 Tech Categories             |
|  - Verified Specifications, Real INR (₹) Prices, Pros/Cons  |
+-------------------------------------------------------------+
```

## 2. API Contract

### POST /api/chat
**Request**:
```json
{
  "message": "I need wireless headphones under 2000 for online classes",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "model", "content": "..." }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "reply": "Here are 2 great options within your ₹2,000 budget...",
  "recommendedProductIds": ["hp-001", "hp-002"],
  "products": [
    {
      "id": "hp-001",
      "name": "...",
      "brand": "...",
      "price": 1999,
      ...
    }
  ],
  "comparison": null,
  "source": "gemini" | "local-advisor"
}
```

### GET /api/products
Supports query filters: `category`, `maxPrice`, `search`.

### GET /api/health
Returns system health, status, and whether Gemini API key is configured.
