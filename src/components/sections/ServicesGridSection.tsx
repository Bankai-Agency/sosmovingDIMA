import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const services = [
  { title: 'Apartment Movers', href: '/services/apartment-movers', image: '/images/services/645ab1d979228786a75bf0d9_Apartment-Movers.webp' },
  { title: 'Commercial Movers', href: '/services/commercial-movers', image: '/images/services/645ab1d97922877a145befa6_services-img-4.webp' },
  { title: 'Long-Distance Movers', href: '/services/long-distance-movers', image: '/images/services/645ab1d9792287ddda5befc2_services-img-2.webp' },
  { title: 'Packing Services', href: '/services/packing-services', image: '/images/services/645ab1d979228713705befa4_services-img-5.webp' },
  { title: 'White Glove Movers', href: '/services/white-glove-movers', image: '/images/services/645ab1d979228797c85befa3_services-img-6.webp' },
  { title: 'Storage', href: '/services/storage', image: '/images/services/645ab1d97922871b155befa5_services-img-3.webp' },
];

export function ServicesGridSection() {
  return (
    <section className="py-[7.8rem]">
      <Container>
        <h2 className="text-white text-[2.4rem] font-extrabold leading-[1.4em] mb-[1.2rem] capitalize">
          SOS Moving Services
        </h2>
        <p className="text-[1rem] leading-[1.4em] text-text-muted max-w-[30rem] mb-[3.2rem]">
          We offer a wide range of services, providing all the required
          resources to deliver an outstanding moving experience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1rem]">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group bg-[#191919] rounded-[1.2rem] p-[2.2rem] relative overflow-hidden text-white hover:text-white transition-all duration-300"
            >
              {/* Background image */}
              <div className="relative aspect-[4/3] rounded-[0.8rem] overflow-hidden mb-[1.2rem]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-white text-[1rem] font-bold group-hover:text-accent transition-colors">
                {service.title}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
