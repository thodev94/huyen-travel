import React from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Compass,
  Heart,
  Languages,
  Leaf,
  Map,
  MapPin,
  MessageCircle,
  Route,
  Send,
  Sparkles,
  Star,
  Users,
  Waves,
} from 'lucide-react';
import './Engagement.css';

const CONTACT_LINK = '#contact';
const WHATSAPP_LINK = 'https://wa.me/84364399290';

const trustItems = [
  { value: '4.9+', label: 'Guest rating', icon: Star },
  { value: '400+', label: 'Traveler reviews', icon: MessageCircle },
  { value: '8+', label: 'Years of experience', icon: Compass },
  { value: 'Licensed', label: 'Professional guide', icon: BadgeCheck },
  { value: 'Bilingual', label: 'English & Vietnamese', icon: Languages },
];

const travelMoods = [
  {
    eyebrow: 'Saigon',
    title: 'Feel the City Energy',
    description: 'Step into local markets, hidden alleys, temples and the stories behind modern Saigon.',
    image: '/images/imgs/saigoncity/z5588324599578_feeb7cc93f106c0ead0bf987453497c9.jpg',
    icon: MapPin,
  },
  {
    eyebrow: 'Mekong',
    title: 'Slow Down by the River',
    description: 'Follow peaceful canals, visit coconut workshops and meet the communities shaped by the river.',
    image: '/images/imgs/mekong/z7764641211197_8e2b7de8c2975658cf8c8ccd75e3cf54.jpg',
    icon: Waves,
  },
  {
    eyebrow: 'Heritage',
    title: 'Walk Through History',
    description: 'Look beyond famous landmarks and uncover the people, memories and culture behind each place.',
    image: '/images/imgs/cuchi/z7764694566229_00e2a9e88fa107b8e5e0c16299cc8175.jpg',
    icon: Map,
  },
  {
    eyebrow: 'Nature',
    title: 'Escape Into the Green',
    description: 'Leave the busy streets for mangrove forests, quiet countryside and refreshing coastal views.',
    image: '/images/imgs/cangio/rung-sac-can-gio-6.jpg',
    icon: Leaf,
  },
];

const journeySteps = [
  {
    number: '01',
    title: 'Start With a Conversation',
    text: 'Share what interests you, how much time you have and the kind of day you want to remember.',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'Step Into Local Life',
    text: 'Move beyond the surface and discover neighborhoods, communities and everyday Vietnamese stories.',
    icon: MapPin,
  },
  {
    number: '03',
    title: 'Explore at Your Rhythm',
    text: 'Take time to observe, ask questions, photograph the moment and enjoy each destination.',
    icon: Camera,
  },
  {
    number: '04',
    title: 'Return With Real Stories',
    text: 'Bring home more than photos: meaningful memories and a deeper understanding of Vietnam.',
    icon: Heart,
  },
];

const privateBenefits = [
  {
    title: 'More Conversations',
    text: 'A personal journey leaves room for real questions, local context and spontaneous discoveries.',
    icon: MessageCircle,
  },
  {
    title: 'A Comfortable Rhythm',
    text: 'Enjoy the places around you without feeling like you are simply moving through a checklist.',
    icon: Route,
  },
  {
    title: 'Stories Behind Places',
    text: 'Understand why a temple, market, neighborhood or family tradition matters to local people.',
    icon: Sparkles,
  },
  {
    title: 'Direct Local Contact',
    text: 'Speak directly with Huyen before your journey and share the details that matter to you.',
    icon: Send,
  },
  {
    title: 'Space for Curiosity',
    text: 'Pause, look closer and follow the moments that make a trip feel personal.',
    icon: Compass,
  },
  {
    title: 'Built Around Interests',
    text: 'Tell Huyen what inspires you and receive suitable ideas for your available time.',
    icon: Users,
  },
];

const travelerTypes = [
  {
    title: 'First-Time Visitors',
    text: 'For travelers who want to understand Saigon and southern Vietnam beyond famous landmarks.',
    icon: Compass,
  },
  {
    title: 'Couples & Friends',
    text: 'For people who value shared memories, genuine conversations and a more personal travel rhythm.',
    icon: Heart,
  },
  {
    title: 'Families & Private Groups',
    text: 'For groups who prefer direct communication and one clear local point of contact.',
    icon: Users,
  },
  {
    title: 'Curious Return Travelers',
    text: 'For visitors ready to discover lesser-known places and deeper local stories.',
    icon: Map,
  },
];

const memorableDetails = [
  'A local person to ask real questions.',
  'Stories that make landmarks meaningful.',
  'Time to notice everyday life.',
  'Places beyond common travel routes.',
  'Direct communication before the trip.',
  'Memories that feel personal.',
];

const faqItems = [
  {
    question: 'Can I request a different itinerary?',
    answer: 'Share your interests and available time. Huyen will reply with suitable ideas and current availability.',
  },
  {
    question: 'Which areas can I explore?',
    answer: 'Current experiences cover Saigon, Cu Chi, the Mekong Delta, Can Gio, Dong Nai and Vung Tau.',
  },
  {
    question: 'What languages are available?',
    answer: 'Huyen guides and communicates in English and Vietnamese.',
  },
  {
    question: 'Can I contact Huyen directly?',
    answer: 'Yes. Use WhatsApp, email or the inquiry section at the bottom of this page.',
  },
  {
    question: 'How do I check availability?',
    answer: 'Send your preferred date through the contact section and Huyen will reply with availability.',
  },
  {
    question: 'What should I include in my message?',
    answer: 'Your travel date, group size, places you are interested in and any special wishes are a great start.',
  },
];

export const TrustStrip: React.FC = () => (
  <section className="engagement-trust" aria-label="Why travelers trust Huyen">
    <div className="engagement-shell engagement-trust-grid">
      {trustItems.map(({ value, label, icon: Icon }) => (
        <div className="engagement-trust-item" key={label}>
          <span className="engagement-trust-icon"><Icon size={19} aria-hidden="true" /></span>
          <span>
            <strong>{value}</strong>
            <small>{label}</small>
          </span>
        </div>
      ))}
    </div>
  </section>
);

export const BrandStory: React.FC = () => (
  <section className="engagement-section engagement-story">
    <div className="engagement-shell engagement-story-grid">
      <div className="engagement-story-visual">
        <div className="engagement-story-main-image">
          <Image
            src="/images/imgs/saigoncity/huyen-portrait.jpg"
            alt="A local perspective on Vietnam"
            fill
            sizes="(max-width: 768px) 100vw, 48vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="engagement-story-note">
          <Sparkles size={20} aria-hidden="true" />
          <span>Local stories make every place feel different.</span>
        </div>
      </div>

      <div className="engagement-copy">
        <span className="engagement-kicker">Vietnam beyond the guidebook</span>
        <h2>See the places.<br /><em>Feel the stories.</em></h2>
        <p className="engagement-lead">
          Vietnam is more than a list of landmarks. It lives in the rhythm of a market,
          the memories behind an old neighborhood and the warmth of the people you meet.
        </p>
        <p>
          Travel with a local perspective and discover the details that are easy to miss:
          everyday traditions, hidden corners and the stories that connect each destination.
        </p>
        <blockquote>
          “The best journeys do not only show you where to go. They help you understand where you are.”
        </blockquote>
        <a className="engagement-link" href={CONTACT_LINK}>
          Tell Huyen what you love <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);

export const TravelMoods: React.FC = () => (
  <section className="engagement-section engagement-moods">
    <div className="engagement-shell">
      <div className="engagement-heading engagement-heading-center">
        <span className="engagement-kicker">Choose your travel mood</span>
        <h2>What kind of Vietnam are you looking for?</h2>
        <p>Follow the feeling that inspires you. Huyen can help turn it into a meaningful local experience.</p>
      </div>

      <div className="engagement-mood-grid">
        {travelMoods.map(({ eyebrow, title, description, image, icon: Icon }) => (
          <article className="engagement-mood-card" key={title}>
            <div className="engagement-mood-image">
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <span className="engagement-mood-badge"><Icon size={16} aria-hidden="true" /> {eyebrow}</span>
            </div>
            <div className="engagement-mood-content">
              <h3>{title}</h3>
              <p>{description}</p>
              <a href={CONTACT_LINK}>
                Plan this experience <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const JourneyTimeline: React.FC = () => (
  <section className="engagement-section engagement-journey">
    <div className="engagement-shell">
      <div className="engagement-heading">
        <span className="engagement-kicker engagement-kicker-light">A day with Huyen</span>
        <h2>From a simple hello to a story worth remembering.</h2>
        <p>A personal journey starts with what you are curious about, then unfolds through local places and conversations.</p>
      </div>

      <div className="engagement-journey-grid">
        {journeySteps.map(({ number, title, text, icon: Icon }) => (
          <article className="engagement-step" key={number}>
            <div className="engagement-step-top">
              <span className="engagement-step-number">{number}</span>
              <span className="engagement-step-icon"><Icon size={22} aria-hidden="true" /></span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <a className="engagement-button engagement-button-light" href={CONTACT_LINK}>
        Start planning your day <ArrowDown size={17} aria-hidden="true" />
      </a>
    </div>
  </section>
);

export const PrivateBenefits: React.FC = () => (
  <section className="engagement-section engagement-benefits">
    <div className="engagement-shell engagement-benefits-grid">
      <div className="engagement-benefits-intro">
        <span className="engagement-kicker">Why private & local feels different</span>
        <h2>Less rushing.<br />More meaning.</h2>
        <p>
          A memorable trip is not about fitting the most stops into one day. It is about having
          the space to connect, understand and enjoy what is in front of you.
        </p>
        <a className="engagement-button" href={CONTACT_LINK}>
          Ask Huyen about your trip <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>

      <div className="engagement-benefit-list">
        {privateBenefits.map(({ title, text, icon: Icon }) => (
          <article className="engagement-benefit-card" key={title}>
            <span><Icon size={21} aria-hidden="true" /></span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const TravelerTypes: React.FC = () => (
  <section className="engagement-section engagement-travelers">
    <div className="engagement-shell">
      <div className="engagement-heading engagement-heading-center">
        <span className="engagement-kicker">Made for curious travelers</span>
        <h2>This journey may be perfect for you if...</h2>
        <p>You want more than a quick photo stop and enjoy discovering a place through local context and conversation.</p>
      </div>

      <div className="engagement-traveler-grid">
        {travelerTypes.map(({ title, text, icon: Icon }) => (
          <article className="engagement-traveler-card" key={title}>
            <span className="engagement-traveler-icon"><Icon size={24} aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href={CONTACT_LINK}>This sounds like us <ArrowDown size={15} aria-hidden="true" /></a>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const JourneyDetails: React.FC = () => (
  <section className="engagement-section engagement-details">
    <div className="engagement-shell engagement-details-grid">
      <div className="engagement-details-collage" aria-hidden="true">
        <div className="engagement-detail-image engagement-detail-image-main">
          <Image
            src="/images/imgs/mytho/z5588338009201_9fb0ad5c8dc24334a18bd4f001498b25.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 44vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="engagement-detail-image engagement-detail-image-small">
          <Image
            src="/images/imgs/saigoncity/z5588324476086_e0495572695230ef1be5bd264ff1c53e.jpg"
            alt=""
            fill
            sizes="220px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      <div>
        <span className="engagement-kicker">Small details, lasting memories</span>
        <h2>The moments between landmarks matter too.</h2>
        <div className="engagement-detail-list">
          {memorableDetails.map(detail => (
            <div key={detail}>
              <CheckCircle2 size={19} aria-hidden="true" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
        <p className="engagement-detail-quote">
          The best journeys are not always about seeing more. Sometimes, they are about feeling more.
        </p>
        <a className="engagement-link" href={CONTACT_LINK}>
          Create my Vietnam experience <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);

export const StaticFaq: React.FC = () => (
  <section id="before-you-go" className="engagement-section engagement-faq">
    <div className="engagement-shell">
      <div className="engagement-heading engagement-heading-center">
        <span className="engagement-kicker">Before you go</span>
        <h2>A few helpful answers.</h2>
        <p>Every journey starts with a question. Here are the details travelers most often want to know first.</p>
      </div>

      <div className="engagement-faq-grid">
        {faqItems.map(({ question, answer }, index) => (
          <article className="engagement-faq-card" key={question}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="engagement-faq-contact">
        <MessageCircle size={20} aria-hidden="true" />
        <span>Still have a question?</span>
        <a href={CONTACT_LINK}>Ask Huyen directly <ArrowDown size={15} aria-hidden="true" /></a>
      </div>
    </div>
  </section>
);

export const FinalContactCta: React.FC = () => (
  <section className="engagement-final">
    <div className="engagement-final-background" aria-hidden="true">
      <Image
        src="/images/baners/chua-la-sen-hoa-sen-no-1698747193.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
    <div className="engagement-final-overlay" aria-hidden="true" />
    <div className="engagement-shell engagement-final-content">
      <span className="engagement-kicker engagement-kicker-light">Ready when you are</span>
      <h2>Your Vietnam story can start with a simple hello.</h2>
      <p>
        Tell Huyen when you are coming, who you are traveling with and what kind of experience you hope to find.
      </p>
      <div className="engagement-final-actions">
        <a className="engagement-button engagement-button-light" href={CONTACT_LINK}>
          Send an inquiry <ArrowDown size={17} aria-hidden="true" />
        </a>
        <a
          className="engagement-button engagement-button-outline"
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat on WhatsApp <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);