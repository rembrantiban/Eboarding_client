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
import BoarderRoute from './route/BoarderRoute'
import ViewUserPage from './pages/ViewUserAccount'
import GlobalStatusModal from './components/StatusModal/GlobalStatusModal'
import Documents from './pages/Documents'
import BoarderDocumentPage from './pages/BoarderDocumentPage'

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
            <Route path='/announcements' element={<Announcement />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/view-user/:id" element={<ViewUserPage />} />
            <Route path='documents' element={<Documents />} />
          </Route>
        </Route>

        <Route element={<BoarderRoute />}>
          <Route element={<BoarderLayout />}>
            <Route path="/boarder-dashboard" element={<BoarderDashboard />} />
            <Route path='/edit-account' element={<EditAccountPage />} />
            <Route path='/boarder/announcements' element={<BoardeAnnouncement />} />
            <Route path='/boarder/documents' element={<BoarderDocumentPage />} />
            <Route path='/my-room' element={<MyRoom />} />
            <Route path="/view-account" element={<ViewOwnAccount />} />
            <Route path="/payment-history" element={<PaymentHistoryPage />} />
          </Route>
        </Route>

      </Routes>
      
       <GlobalStatusModal />
    </>
  )
}

export default App

