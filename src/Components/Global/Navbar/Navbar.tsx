import { useState } from "react";
import { Bell, Mail, Menu, Search, X } from "lucide-react";

const navItems = [
      {
            name: "Register a Company",
            link: "/dashboard/specialists/create",
      },
      {
            name: "Appoint a Company Secretary",
            link: "/publish/secretary",
      },
      {
            name: "Company Secretary Services",
            link: "/publish/services",
            subLinks: [
                  { name: "Company Formation", link: "/publish/services/formation" },
                  { name: "Registered Office Address", link: "/publish/services/office-address" },
                  { name: "Company Compliance", link: "/publish/services/compliance" },
                  { name: "Company Secretarial Services", link: "/publish/services/secretarial" },
            ],
      },
      {
            name: "How AnyComp Works",
            link: "/how-anycomp-works",
      },
];

const Navbar = () => {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const [expandedMobileItem, setExpandedMobileItem] = useState<number | null>(null);
      const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

      const toggleMobileItem = (index: number) => {
            setExpandedMobileItem(expandedMobileItem === index ? null : index);
      };

      const closeMobileMenu = () => {
            setMobileMenuOpen(false);
            setExpandedMobileItem(null);
      };

      return (
            <nav className="bg-white shadow-md sticky top-0 z-50">
                  <div className="lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                              {/* Logo */}
                              <div className="shrink-0">
                                    <h1 className="text-2xl font-bold text-primary">ANYCOMP</h1>
                              </div>

                              {/* Desktop Navigation */}
                              <div className="hidden lg:flex items-center space-x-10">
                                    {navItems.map((item, index) => (
                                          <div key={index} className="relative group">
                                                <a
                                                      href={item.link}
                                                      className="text-xs whitespace-nowrap text-secondary hover:text-primary transition-colors duration-200"
                                                >
                                                      {item.name}
                                                </a>
                                                {item.subLinks && (
                                                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                            <div className="py-2">
                                                                  {item.subLinks.map((subItem, subIndex) => (
                                                                        <a
                                                                              key={subIndex}
                                                                              href={subItem.link}
                                                                              className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary"
                                                                        >
                                                                              {subItem.name}
                                                                        </a>
                                                                  ))}
                                                            </div>
                                                      </div>
                                                )}
                                          </div>
                                    ))}
                              </div>

                              {/* Desktop Search & Icons */}
                              <div className="hidden lg:flex items-center space-x-4">
                                    <div className="flex items-center">
                                          <input
                                                type="text"
                                                placeholder="Search..."
                                                className="h-8 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                          />
                                          <button className="h-8 px-6 flex items-center justify-center bg-primary text-white rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                                <Search size={18} />
                                          </button>
                                    </div>
                                    <Mail
                                          className="text-secondary hover:text-primary cursor-pointer transition-colors"
                                          size={18}
                                    />
                                    <Bell
                                          className="text-secondary hover:text-primary cursor-pointer transition-colors"
                                          size={18}
                                    />
                                    <img
                                          src="https://avatars.githubusercontent.com/u/105328960?v=4"
                                          alt="Profile"
                                          className="w-8 h-8 rounded-full cursor-pointer"
                                    />
                              </div>

                              {/* Mobile menu button & icons */}
                              <div className="flex items-center space-x-3 lg:hidden">
                                    <button
                                          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                                          className="p-2 text-secondary hover:text-primary"
                                    >
                                          <Search size={20} />
                                    </button>
                                    <Mail className="text-secondary hover:text-primary cursor-pointer" size={20} />
                                    <Bell className="text-secondary hover:text-primary cursor-pointer" size={20} />
                                    <img
                                          src="https://avatars.githubusercontent.com/u/105328960?v=4"
                                          alt="Profile"
                                          className="w-8 h-8 rounded-full cursor-pointer"
                                    />
                                    <button
                                          onClick={() => setMobileMenuOpen(true)}
                                          className="p-2 text-secondary hover:text-primary"
                                    >
                                          <Menu size={24} />
                                    </button>
                              </div>
                        </div>

                        {/* Mobile search bar (conditionally visible) */}
                        {mobileSearchOpen && (
                              <div className="lg:hidden pb-3">
                                    <div className="flex items-center">
                                          <input
                                                type="text"
                                                placeholder="Search..."
                                                className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                          />
                                          <button className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark">
                                                <Search size={18} />
                                          </button>
                                    </div>
                              </div>
                        )}
                  </div>

                  {/* Mobile Sidebar */}
                  {mobileMenuOpen && (
                        <>
                              {/* Backdrop */}
                              <div
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                                    onClick={closeMobileMenu}
                              />

                              {/* Sidebar */}
                              <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
                                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                          <h2 className="text-lg font-semibold text-primary">Menu</h2>
                                          <button
                                                onClick={closeMobileMenu}
                                                className="p-2 text-secondary hover:text-primary rounded-full hover:bg-gray-100"
                                          >
                                                <X size={20} />
                                          </button>
                                    </div>

                                    <div className="overflow-y-auto h-full pb-20">
                                          <div className="p-4 space-y-2">
                                                {navItems.map((item, index) => (
                                                      <div key={index} className="border-b border-gray-100 last:border-0">
                                                            <div
                                                                  className="flex justify-between items-center py-3 cursor-pointer"
                                                                  onClick={() => item.subLinks && toggleMobileItem(index)}
                                                            >
                                                                  <a
                                                                        href={item.link}
                                                                        className="text-sm text-secondary hover:text-primary font-medium truncate pr-2"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        title={item.name} // show full text on hover
                                                                  >
                                                                        {item.name}
                                                                  </a>
                                                                  {item.subLinks && (
                                                                        <span className="text-secondary shrink-0">
                                                                              {expandedMobileItem === index ? "−" : "+"}
                                                                        </span>
                                                                  )}
                                                            </div>
                                                            {item.subLinks && expandedMobileItem === index && (
                                                                  <div className="pl-4 pb-2 space-y-2">
                                                                        {item.subLinks.map((subItem, subIndex) => (
                                                                              <a
                                                                                    key={subIndex}
                                                                                    href={subItem.link}
                                                                                    className="block py-2 text-xs text-secondary hover:text-primary truncate"
                                                                                    title={subItem.name}
                                                                              >
                                                                                    {subItem.name}
                                                                              </a>
                                                                        ))}
                                                                  </div>
                                                            )}
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                              </div>
                        </>
                  )}
            </nav>
      );
};

export default Navbar;