import Hero from '../components/home/Hero';
import ScrollStory from '../components/home/ScrollStory';
import HowItWorks from '../components/home/HowItWorks';
import LiveRescueCases from '../components/home/LiveRescueCases';
import RescueMapPreview from '../components/home/RescueMapPreview';
import DonationCampaigns from '../components/home/DonationCampaigns';
import VolunteerNetwork from '../components/home/VolunteerNetwork';
import LostFoundPreview from '../components/home/LostFoundPreview';
import AdoptionPreview from '../components/home/AdoptionPreview';
import CommunityImpact from '../components/home/CommunityImpact';
import PartnerNetwork from '../components/home/PartnerNetwork';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollStory />
      <HowItWorks />
      <LiveRescueCases />
      <RescueMapPreview />
      <DonationCampaigns />
      <VolunteerNetwork />
      <LostFoundPreview />
      <AdoptionPreview />
      <CommunityImpact />
      <PartnerNetwork />
      <CTASection />
    </>
  );
}
