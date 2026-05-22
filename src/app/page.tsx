import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import OpportunitiesPreview from '@/components/sections/OpportunitiesPreview';
import EventsPreview from '@/components/sections/EventsPreview';
import BlogPreview from '@/components/sections/BlogPreview';
import ResourcesSection from '@/components/sections/ResourcesSection';
import StatsSection from '@/components/sections/StatsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
      <OpportunitiesPreview />
      <EventsPreview />
      <AchievementsSection />
      <BlogPreview />
      <ResourcesSection />
    </>
  );
}
