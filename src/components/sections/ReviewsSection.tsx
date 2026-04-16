'use client';

import { Container } from '@/components/ui/Container';
import type { Review } from '@/lib/types';

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;

  return (
    <section className="py-[7.8rem]">
      <Container>
        <h2 className="text-white text-[2.4rem] font-extrabold leading-[1.4em] mb-[1.2rem] capitalize">
          SOS Moving Company Reviews
        </h2>

        {/* Platform ratings row */}
        <div className="flex flex-wrap gap-[1rem] mb-[3rem]">
          {[
            { name: 'Google', score: '4.9', count: '1,007' },
            { name: 'Yelp', score: '4.8', count: '1,585' },
            { name: 'Trustpilot', score: '4.4', count: '56' },
            { name: 'HomeAdvisor', score: '4.9', count: '29' },
          ].map((p) => (
            <div key={p.name} className="bg-[#191919] rounded-[1rem] px-[1.4rem] py-[1rem] flex items-center gap-[0.8rem]">
              <div>
                <span className="text-white font-black text-[1.4rem]">{p.score}</span>
                <span className="text-text-muted text-[0.6rem]">/5</span>
              </div>
              <div>
                <div className="text-accent text-[0.7rem] tracking-wide">{'★★★★★'}</div>
                <div className="text-text-muted text-[0.6rem]">{p.count} reviews</div>
              </div>
              <span className="text-white font-bold text-[0.75rem] ml-[0.5rem]">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem]">
          {reviews.slice(0, 6).map((review, i) => (
            <div key={i} className="bg-[#191919] rounded-[1rem] p-[1.4rem]">
              <div className="flex items-center gap-[0.6rem] mb-[0.8rem]">
                <div className="w-[2rem] h-[2rem] bg-accent rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-[0.7rem]">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-white font-bold text-[0.8rem]">{review.name}</div>
                  <div className="text-accent text-[0.65rem]">{'★'.repeat(review.rating)}</div>
                </div>
              </div>
              <p className="text-text-muted text-[0.75rem] leading-[1.5em] line-clamp-[8]">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
