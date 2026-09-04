import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from '@/pages/login'
import Home from '@/pages/home'
import Register from '@/pages/register'
import About from './pages/about'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from '@/pages/dashboard'
import UserPage from '@/pages/user'
import Calendar from '@/pages/Calendar'
import Room from '@/pages/room'
import Rules from './pages/rules'
import ForgotPassword from './pages/forgatPassword'
import ResetPassword from "./pages/resetPassword"
import AdminRoute from "./route/AdminRoute"
import Viewroom from './pages/viewroom'
import Boarders from "./pages/boarders"
import Billing from "./pages/Billing"
import ProfilePage from './pages/ProfilePage'
import Report from "@/pages/Report"
import Announcement from "@/pages/announcement"
import BoarderDashboard from './pages/BoarderDashboard'
import BoarderLayout from './components/layout/BoarderLayout'
import EditAccountPage from "./pages/EditAccountPage"
import BoardeAnnouncement from './pages/BoarderAnnouncement'
import MyRoom from "@/pages/MyRoom"
import ViewOwnAccount from "@/pages/ViewOwnAccount"
import PaymentHistoryPage from './pages/PaymentHistoryPage'
import ViewUserPage from './pages/ViewUserAccount'
import GlobalStatusModal from './components/StatusModal/GlobalStatusModal'
import Documents from './pages/Documents'
import BoarderDocumentPage from './pages/BoarderDocumentPage'
import History from './pages/History'
import BoarderBilling from './pages/BoarderBilling'
import DeletedAccountsPage from './pages/DeletedAccounts'
import StaffAnnouncementsPage from "@/pages/StaffAnnouncement"
import MaintenanceRequestPage from './pages/MaintenanceRequestPage'
import AdminMaintenanceRequestPage from './pages/AdminMaintenance'
import BoarderMaintenancePage from './pages/BoarderMaintenancePage'
import BoarderHouseRulesPage from './pages/BoarderHouseRulesPage'
import ReportBoarder from './pages/ReportBoarder'
import BoarderPenalties from './pages/BoarderPenalties'

//Generated Reports 
import FinancialReport from './pages/FinancialReport'
import OccupancyReport from './pages/OccupancyReport'
import PenaltyReport from './pages/PenaltyReport'
import PaymentCollectionReport from './pages/PaymentCollectionReport'
import RoomAvailabilityReport from './pages/RoomAvailabilityReport'
import BoarderReport  from './pages/BoarderReport'
import StaffDasboard from './pages/StaffDashboard'

import PenaltiesPage from './pages/Penalties'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/viewroom" element={<Viewroom />} />

        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<UserPage />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path="/room" element={<Room />} />
            <Route path="/boarders" element={<Boarders />} />
            <Route path='/rules' element={<Rules />} />
            <Route path='/billing' element={<Billing />} />
            <Route path='/reports' element={<Report />} />

            <Route path='/financial-report' element={<FinancialReport />} />
            <Route path='/occupancy-report' element={<OccupancyReport />} />
            <Route path='/penalty-report' element={<PenaltyReport />} />
            <Route path='/payment-collection-report' element={<PaymentCollectionReport />} />
            <Route path='/room-availability-report' element={<RoomAvailabilityReport />} />
            <Route path='/boarder-report' element={<BoarderReport />} />

            <Route path='/announcements' element={<Announcement />} />
            <Route path='/staff-announcements' element={<StaffAnnouncementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/view-user/:id" element={<ViewUserPage />} />
            <Route path='documents' element={<Documents />} />
            <Route path="/history" element={<History />} />
            <Route path="/deleted-accounts" element={<DeletedAccountsPage />} />
            <Route path="/staff-maintenance" element={<MaintenanceRequestPage />} />
            <Route path="/admin-maintenance" element={<AdminMaintenanceRequestPage />} />
            <Route path='/staff-dashboard' element={<StaffDasboard />} />
            <Route path="/penalties" element={<PenaltiesPage />} />

          </Route>
        </Route>

          <Route element={<BoarderLayout />}>
            <Route path="/boarder-dashboard" element={<BoarderDashboard />} />
            <Route path='/edit-account' element={<EditAccountPage />} />
            <Route path='/boarder/announcements' element={<BoardeAnnouncement />} />
            <Route path='/boarder/documents' element={<BoarderDocumentPage />} />
            <Route path='/my-room' element={<MyRoom />} />
            <Route path="/view-account" element={<ViewOwnAccount />} />
            <Route path="/payment-history" element={<PaymentHistoryPage />} />
            <Route path="/boarder-billing" element={<BoarderBilling />} />
            <Route path='/boarder-maintenance' element={<BoarderMaintenancePage />} />
            <Route path='/house-rules' element={<BoarderHouseRulesPage />} />
            <Route path='/report/boarder' element={<ReportBoarder />} />
            <Route path='/boarder/penalties' element={<BoarderPenalties />} />
          </Route>

      </Routes>
      
       <GlobalStatusModal />
    </>
  )
}

export default App

