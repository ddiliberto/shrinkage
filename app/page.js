import { Suspense } from "react";
import ButtonSignin from "@/components/ButtonSignin";
import Hero from "@/components/Hero";
import FeaturesGrid from "@/components/FeaturesGrid";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import DropZone from "@/components/DropZone";

const features = [
  {
    title: "JPEG/JPG",
    description: "Advanced compression with MozJPEG",
    icon: "🖼️",
  },
  {
    title: "PNG",
    description: "Lossless compression with OxiPNG",
    icon: "🎨",
  },
  {
    title: "GIF",
    description: "Optimize with Gifsicle",
    icon: "🎬",
  },
  {
    title: "WebP",
    description: "Modern format for better compression",
    icon: "🌐",
  },
  {
    title: "Bulk Upload",
    description: "Process multiple images at once",
    icon: "📦",
  },
  {
    title: "Privacy First",
    description: "Browser-based processing for free tier",
    icon: "🔒",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for small projects and testing",
    features: [
      "Up to 20 images per session",
      "Max file size: 5MB",
      "Basic compression options",
      "Browser-only processing",
      "Basic formats (JPEG, PNG, GIF)",
      "No account required",
    ],
  },
  {
    name: "Pro",
    price: "9.99",
    description: "For professionals and power users",
    features: [
      "Unlimited images/month",
      "Max file size: 75MB",
      "Advanced compression settings",
      "API access",
      "All formats including AVIF, WebP",
      "Bulk processing",
      "Priority support",
    ],
  },
];

const faqs = [
  {
    q: "How does the compression work?",
    a: "We use industry-standard optimization tools like MozJPEG, OxiPNG, Gifsicle, and others to compress your images while maintaining the best possible quality. The process happens directly in your browser for the free tier, ensuring your images never leave your device.",
  },
  {
    q: "What's the difference between free and pro?",
    a: "The free tier allows you to compress up to 20 images per session with a 5MB size limit, supporting basic formats (JPEG, PNG, GIF). The pro tier removes these limitations, adds support for more formats, provides API access, and enables advanced compression settings.",
  },
  {
    q: "Is my data secure?",
    a: "For free tier users, all processing happens directly in your browser - your images never leave your device. For pro users, we use secure cloud processing with immediate file deletion after compression.",
  },
  {
    q: "Do you support bulk processing?",
    a: "Yes! Pro users can process unlimited images in bulk. Free users can process up to 20 images per session.",
  },
  {
    q: "Which compression tools do you use?",
    a: "We use MozJPEG for JPEG compression, OxiPNG for PNG optimization, Gifsicle for GIF compression, and native browser APIs for WebP conversion. Pro users get access to additional tools like Guetzli, AVIF encoding, and more.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-end max-w-7xl mx-auto w-full">
        <ButtonSignin text="Login" />
      </header>

      <main className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          <Hero
            title="Shrinkage"
            subtitle="Professional image compression made easy"
            description="Compress your images without quality loss. Support for JPEG, PNG, GIF, WebP and more. No signup required for basic compression."
          />

          <section className="py-12 px-4">
            <div className="max-w-5xl mx-auto">
              <DropZone />
            </div>
          </section>

          <section className="py-16 bg-base-200">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
              <FeaturesGrid features={features} />
            </div>
          </section>

          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
              <Pricing prices={pricingPlans} />
            </div>
          </section>

          <section className="py-16 bg-base-200">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <FAQ faq={faqs} />
            </div>
          </section>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
