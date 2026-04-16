import Image from 'next/image';
import { Container } from '@/components/ui/Container';

export function AboutCompanySection() {
  return (
    <section className="py-[7.8rem]">
      <Container>
        <h2 className="text-white text-[2.4rem] font-extrabold leading-[1.4em] mb-[1.2rem] capitalize">
          Professional Moving Services in Los Angeles
        </h2>

        <div className="bg-[#201f1f] rounded-[2.5rem] flex flex-wrap overflow-hidden">
          {/* Left - Text */}
          <div className="flex-1 min-w-[300px] p-[2.5rem]">
            <div className="text-[1rem] leading-[1.4em] text-text-muted space-y-[1rem]">
              <p>
                SOS Moving is a licensed and insured moving company in Los Angeles
                serving residential and commercial clients across Southern
                California and beyond. Since our founding, we have completed
                thousands of successful relocations — from studio apartments in
                Downtown LA to five-bedroom homes in Calabasas, from small office
                suites to full corporate headquarters.
              </p>
              <p>
                Every move includes premium blankets, unlimited shrink wrap,
                wardrobe boxes, furniture disassembly and reassembly, and TV
                unmounting at no extra cost.
              </p>
            </div>

            {/* Included items */}
            <div className="mt-[2rem] grid grid-cols-2 gap-[0.8rem]">
              {['Premium blankets', 'Unlimited shrink wrap', 'Wardrobe boxes', 'Furniture disassembly', 'TV unmounting', 'No hidden fees'].map((item) => (
                <div key={item} className="flex items-center gap-[0.5rem] text-[0.8rem] text-white/80">
                  <svg className="w-[1rem] h-[1rem] text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Images */}
          <div className="flex-1 min-w-[300px] grid grid-cols-2 gap-[0.75rem] p-[1.5rem]">
            <div className="relative rounded-[1.2rem] overflow-hidden aspect-[3/4]">
              <Image
                src="/images/general/645ab1d97922876aaf5bef8b_company-img-1.webp"
                alt="SOS Moving team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative rounded-[1.2rem] overflow-hidden aspect-[3/4] mt-[2rem]">
              <Image
                src="/images/general/645ab1d9792287bc985bef88_company-img-4.webp"
                alt="SOS Moving truck"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
