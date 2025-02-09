import Image from "next/image";

const Hero = ({ title, subtitle, description }) => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight">
          {title}
        </h1>
        <h2 className="text-2xl lg:text-3xl opacity-90">
          {subtitle}
        </h2>
        <p className="text-lg opacity-80 leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

export default Hero;
