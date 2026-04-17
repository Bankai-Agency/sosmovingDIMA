import data from "@/data/mainpage2/homepage.json";

export function SchemaOrg() {
  const { company, faq } = data;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: company.name,
    image: "https://www.sosmovingla.net/images/sos-logo.avif",
    telephone: company.phone,
    email: company.email,
    url: "https://www.sosmovingla.net",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.zip,
      addressCountry: company.address.country,
    },
    openingHours: "Mo-Su 08:00-18:00",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: company.rating.overall.toString(),
      reviewCount: "2500",
      bestRating: "5",
    },
    areaServed: [
      { "@type": "State", name: "California" },
      { "@type": "State", name: "Oregon" },
      { "@type": "State", name: "Washington" },
      { "@type": "City", name: "Denver, CO" },
    ],
    priceRange: "$$",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
