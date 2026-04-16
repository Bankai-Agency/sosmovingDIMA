import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function CtaSection() {
  return (
    <section className="relative bg-black rounded-t-[2.4rem] pt-[1.7rem] pb-[5.6rem] z-10 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2rem] items-start">
          <div>
            <h2 className="text-white text-[2.4rem] font-extrabold leading-[1.4em] mb-[1.2rem]">
              Feel free to<br />
              <span className="text-accent">contact us</span>
            </h2>
            <p className="text-text-muted text-[1rem] leading-[1.4em] max-w-[25rem] mb-[2rem]">
              Get a free, no-obligation estimate. Our team is ready to help make your move smooth and stress-free.
            </p>
            <div className="flex flex-wrap gap-[1rem]">
              <Link href="/free-estimate" className="bg-accent text-black font-bold text-[0.8rem] leading-[1.4em] px-[1rem] py-[0.65rem] rounded-[0.75rem] hover:bg-[#ffec6a] transition-colors">
                Get a Free Quote
              </Link>
              <a href="tel:+19094430004" className="border border-accent text-accent font-bold text-[0.8rem] leading-[1.4em] px-[1rem] py-[0.65rem] rounded-[0.75rem] hover:bg-accent hover:text-black transition-colors">
                Call (909) 443-0004
              </a>
            </div>
          </div>
          <div className="text-text-muted text-[0.8rem] space-y-[1rem]">
            <div>
              <div className="text-white font-bold mb-[0.3rem]">Address</div>
              <p>5530 Jillson Street, Los Angeles, CA 90040</p>
            </div>
            <div>
              <div className="text-white font-bold mb-[0.3rem]">Hours</div>
              <p>Monday - Sunday, 8AM - 6PM</p>
            </div>
            <div>
              <div className="text-white font-bold mb-[0.3rem]">Email</div>
              <a href="mailto:info@sosmovingla.net" className="text-accent hover:underline">info@sosmovingla.net</a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
