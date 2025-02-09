# Shrinkage

Professional image compression web app built with Next.js and Supabase.

## Features
- Drag-and-drop interface with bulk uploads
- Support for JPEG, PNG, GIF, and WebP formats
- Client-side compression using Web Workers
- Free and Pro tiers with different capabilities
- Real-time compression progress tracking
- Before/after size comparison

### Free Tier
- Up to 20 images per session
- Max file size: 5MB
- Basic compression options
- Browser-only processing
- Basic formats (JPEG, PNG, GIF)

### Pro Tier ($9.99/month)
- Unlimited images/month
- Max file size: 75MB
- Advanced compression settings
- API access
- All formats including AVIF, WebP
- Bulk processing

## Tech Stack
- Next.js 14
- Supabase for authentication and database
- TailwindCSS with DaisyUI
- Web Workers for client-side compression
- Stripe for payment processing

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shrinkage.git
cd shrinkage
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env.local`
- Update the variables with your credentials:
  - Supabase configuration
  - Stripe keys (for Pro tier)
  - Other service credentials

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development
Project structure and contribution guidelines will be added as the project evolves.

## License
MIT
