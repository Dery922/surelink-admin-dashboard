import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { PageTitleProvider } from '../../context/PageTitleContext.jsx';

export default function AdminShell() {
  return (
    <PageTitleProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />
        <main className="ml-60 pt-14 min-h-screen">
          <Outlet />
        </main>
      </div>
    </PageTitleProvider>
  );
}
