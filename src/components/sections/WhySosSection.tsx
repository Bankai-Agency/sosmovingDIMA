import Image from 'next/image';
import { Container } from '@/components/ui/Container';

const reasons = [
  {
    title: 'Licensed and insured',
    description: 'Apart from having highly skilled experts, we are licensed and insured to operate, ensuring the highest safety standards for your belongings.',
    image: '/images/general/645ab1d9792287a29c5bef8c_why-img-1.webp',
  },
  {
    title: '5-star reviews',
    description: 'Hundreds of outstanding reviews across Google, Yelp, and other platforms confirm the quality of our service and commitment to excellence.',
    image: '/images/general/645ab1d979228718d85bef8d_why-img-2.webp',
  },
  {
    title: 'Quality supplies',
    description: 'We use premium blankets, unlimited shrink wrap, and professional equipment. Our strict quality control ensures nothing gets damaged.',
    image: '/images/general/645ab1d979228714395bef9e_why-img-3.webp',
  },
  {
    title: 'Customer service',
    description: 'Our team is available 7 days a week to help plan your move. We treat every customer like family and go above and beyond expectations.',
    image: '/images/general/645ab1d97922874f955bef86_why-img-4.webp',
  },
];

export function WhySosSection() {
  return (
    <section className="py-[7.8rem]">
      <Container>
        <h2 className="text-white text-[2.4rem] font-extrabold leading-[1.4em] mb-[3.2rem] capitalize">
          Why SOS Moving?
        </h2>

        <div className="flex flex-col gap-[2rem]">
          {reasons.map((reason, i) => (
            <div key={i} className={`flex flex-col lg:flex-row gap-[2rem] items-stretch ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Image */}
              <div className="lg:w-[48.5%] relative rounded-[1.2rem] overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[20rem]">
                <Image
                  src={reason.image}
                  alt={reason.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 48.5vw"
                />
              </div>
              {/* Content */}
              <div className="lg:w-[48.5%] flex flex-col justify-center">
                <h3 className="text-white text-[1.6rem] font-bold mb-[1rem] capitalize">
                  {reason.title}
                </h3>
                <p className="text-text-muted text-[0.85rem] leading-[1.6em]">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
