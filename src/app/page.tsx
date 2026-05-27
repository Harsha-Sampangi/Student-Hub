import HeroSection from '@/components/layout/sections/HeroSection';
import AboutSection from '@/components/layout/sections/AboutSection';
import FeaturesSection from '@/components/layout/sections/FeaturesSection';
import AchievementsSection from '@/components/layout/sections/AchievementsSection';
import OpportunitiesPreview from '@/components/layout/sections/OpportunitiesPreview';
import EventsPreview from '@/components/layout/sections/EventsPreview';
import BlogPreview from '@/components/layout/sections/BlogPreview';
import ResourcesSection from '@/components/layout/sections/ResourcesSection';
import StatsSection from '@/components/layout/sections/StatsSection';

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
