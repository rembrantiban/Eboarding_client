import { usePaymentStore } from "@/store/usePaymentStore";

export const usePayment = () => {
  const payments = usePaymentStore((state) => state.payments);
  const Reports = usePaymentStore((state) => state.Reports);
  const getReports = usePaymentStore((state) => state.getReports);
  const calendarEvents = usePaymentStore((state) => state.calendarEvents);
  const loading = usePaymentStore((state) => state.loading);

  const getPayments = usePaymentStore((state) => state.getPayments);
  const getCalendar = usePaymentStore((state) => state.getCalendar);
  const markAsPaid = usePaymentStore((state) => state.markAsPaid);
  const getMyPaid = usePaymentStore((state) => state.getMyPaid);
  const getUserPaid = usePaymentStore((state) => state.getUserPaid);
  const getAnalytics = usePaymentStore((state) => state.getAnalytics);
  const analytics = usePaymentStore((state) => state.analytics);
  const revenueAnalytics = usePaymentStore((state) => state.revenueAnalytics);
  const getRevenueAnalytics = usePaymentStore((state) => state.getRevenueAnalytics);
  const getUpcomingPayment = usePaymentStore((state) => state.getUpcomingPayment);
  const upcomingPayment = usePaymentStore((state) => state.upcomingPayment);

  return {
    payments,
    calendarEvents,
    Reports,
    getReports,
    loading,
    getPayments,
    getCalendar,
    markAsPaid,
    getMyPaid,
    getUserPaid,
    getAnalytics,
    analytics,
    revenueAnalytics,
    getRevenueAnalytics,
    getUpcomingPayment,
    upcomingPayment
  };
};