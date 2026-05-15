import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
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
import Payment from "./pages/Payment"
import ProfilePage from './pages/ProfilePage'
import Report from "@/pages/Report"
import Announcement from "@/pages/announcement"

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
        <Route path="/profile" element={<ProfilePage />} />

        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<UserPage />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path="/room" element={<Room />} />
            <Route path="/boarders" element={<Boarders />} />
            <Route path='/rules' element={<Rules />} />
            <Route path='/payments' element={<Payment />} />
            <Route path='/reports' element={<Report />} />
            <Route path='/announcements' element={<Announcement />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}

export default App

