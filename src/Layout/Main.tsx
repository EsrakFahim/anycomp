import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNavigationSection } from "../Components/Global/Sidebar/Sidebar";
import { Menu } from "lucide-react";

const Main = () => {
      const [sidebarOpen, setSidebarOpen] = useState(false);

      return (
            <div className="bg-bgPrimary min-h-screen flex relative">
                  {/* Mobile sidebar toggle button */}
                  <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-primary text-white rounded-md shadow-md"
                  >
                        <Menu size={20} />
                  </button>

                  {/* Sidebar - desktop always visible, mobile as drawer */}
                  <div
                        className={`
                              fixed lg:static inset-y-0 left-0 z-30 w-80 bg-bgPrimary shadow-2xl transform transition-transform duration-300 ease-in-out
                              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
                              `}
                  >
                        <SidebarNavigationSection onClose={() => setSidebarOpen(false)} />
                  </div>

                  {/* Backdrop for mobile */}
                  {sidebarOpen && (
                        <div
                              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                              onClick={() => setSidebarOpen(false)}
                        />
                  )}

                  {/* Main content */}
                  <div className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto">
                        <Outlet />
                  </div>
            </div>
      );
};

export default Main;