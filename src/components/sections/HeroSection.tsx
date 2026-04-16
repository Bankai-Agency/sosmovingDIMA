import Image from 'next/image';
import Link from 'next/link';

type HeroProps = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  showRatings?: boolean;
  showStats?: boolean;
  phone?: string;
};

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  showRatings = true,
  showStats = true,
  phone = '(909) 443-0004',
}: HeroProps) {
  return (
    <section className="relative flex flex-col justify-end min-h-screen">
      {/* Background */}
      {backgroundImage ? (
        <Image src={backgroundImage} alt={title} fill className="object-cover" priority />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 z-10" />

      <div className="relative z-20 max-w-[72rem] mx-auto w-full px-[1rem] pb-[3rem]">
        {/* Rating labels */}
        {showRatings && (
          <div className="flex gap-[42px] mb-[30px]">
            <div className="flex items-center gap-[0.5rem] bg-[#2a2a2a]/80 backdrop-blur-sm rounded-full px-[1.2rem] py-[0.6rem]">
              <span className="text-white font-black text-[1rem]">4.89</span>
              <span className="text-text-muted text-[0.6rem]">/5</span>
              <span className="text-white text-[0.65rem]">1,600+ Reviews on</span>
              <Image src="/images/general/645ab1d979228708865bef94_rate-img-4.webp" alt="Yelp" width={40} height={20} className="h-[1rem] w-auto" />
            </div>
            <div className="flex items-center gap-[0.5rem] bg-[#2a2a2a]/80 backdrop-blur-sm rounded-full px-[1.2rem] py-[0.6rem]">
              <span className="text-white font-black text-[1rem]">4.98</span>
              <span className="text-text-muted text-[0.6rem]">/5</span>
              <span className="text-white text-[0.65rem]">1,000+ Reviews on</span>
              <Image src="/images/general/645ab1d979228776035bef93_rate-img-3.webp" alt="Google" width={40} height={20} className="h-[1rem] w-auto" />
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-white text-[2rem] md:text-[3.2rem] font-black leading-[1.1em] mb-[0.75rem] max-w-[40rem]">
          {title}
        </h1>
        <p className="text-white/80 text-[1rem] leading-[1.4em] max-w-[30rem] mb-[2rem]">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-[1rem]">
          <Link href="/free-estimate" className="bg-accent text-black font-bold text-[0.8rem] leading-[1.4em] px-[1rem] py-[0.65rem] rounded-[0.75rem] hover:bg-[#ffec6a] transition-colors">
            Get a Free Quote
          </Link>
          <a href="tel:+19094430004" className="border border-accent text-accent font-bold text-[0.8rem] leading-[1.4em] px-[1rem] py-[0.65rem] rounded-[0.75rem] hover:bg-accent hover:text-black transition-colors">
            Call {phone}
          </a>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="flex gap-[2rem] mt-[3rem] border-t border-white/10 pt-[1.5rem]">
            <div>
              <div className="text-white text-[2rem] font-black leading-[1.2]">10.000+</div>
              <div className="text-text-muted text-[0.7rem]">Successful Moves</div>
            </div>
            <div className="border-l border-white/10 pl-[2rem]">
              <div className="text-white text-[2rem] font-black leading-[1.2]">2019</div>
              <div className="text-text-muted text-[0.7rem]">Trusted Since</div>
            </div>
            <div className="border-l border-white/10 pl-[2rem]">
              <div className="text-white text-[2rem] font-black leading-[1.2]">20+</div>
              <div className="text-text-muted text-[0.7rem]">Serving Cities</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
