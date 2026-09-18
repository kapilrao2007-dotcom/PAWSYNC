import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import ProtectedRoute from './components/layout/ProtectedRoute';
import SplashScreen from './components/layout/SplashScreen';

import Home from './pages/Home';
import ReportAnimal from './pages/ReportAnimal';
import RescueBrowse from './pages/RescueBrowse';
import RescueCasePage from './pages/RescueCasePage';
import DonationBrowse from './pages/DonationBrowse';
import DonationCampaign from './pages/DonationCampaign';
import DonationReceipt from './pages/DonationReceipt';
import Adopt from './pages/Adopt';
import AnimalProfile from './pages/AnimalProfile';
import Volunteer from './pages/Volunteer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminReports from './pages/admin/AdminReports';
import AdminCases from './pages/admin/AdminCases';
import AdminDonations from './pages/admin/AdminDonations';

export default function App() {
  return (
    <>
      <SplashScreen />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportAnimal />} />
          <Route path="/rescue" element={<RescueBrowse />} />
          <Route path="/discover" element={<RescueBrowse />} />
          <Route path="/rescue/:caseId" element={<RescueCasePage />} />
          <Route path="/donate" element={<DonationBrowse />} />
          <Route path="/donate/:caseId" element={<DonationCampaign />} />
          <Route path="/donate/receipt/:donationId" element={<DonationReceipt />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/adopt/:id" element={<AnimalProfile />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {['/about', '/privacy', '/terms', '/contact', '/organizations', '/vets', '/lost-and-found', '/foster'].map((path) => (
            <Route key={path} path={path} element={<ComingSoon />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="cases" element={<AdminCases />} />
          <Route path="donations" element={<AdminDonations />} />
        </Route>
      </Routes>
    </>
  );
}
