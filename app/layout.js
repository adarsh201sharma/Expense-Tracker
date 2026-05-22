import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';

export const metadata = {
  title: 'Expense Tracker — Smart Finance Management',
  description: 'Track expenses with interactive dashboards and insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
