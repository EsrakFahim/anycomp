/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NavLink } from "react-router-dom";
import { Button } from "../../Button/Button";
import { ClipboardList, Mail, MessageCircleQuestionMark, ReceiptText, Settings, Signature, Tag, Users, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../Avatar/Avatar";


const navigationItems = [
      {
            label: "Specialists",
            icon: <Tag />,
            to: "/specialists"
      },
      {
            label: "Clients",
            icon: <Users />,
            to: "/clients"
      },
      {
            label: "Service Orders",
            icon: <ClipboardList />,
            to: "/service-orders"
      },
      {
            label: "eSignature",
            icon: <Signature />,
            to: "/e-signature"
      },
      {
            label: "Messages",
            icon: <Mail />,
            to: "/messages"
      },
      {
            label: "Invoices & Receipts",
            icon: <ReceiptText />,
            to: "/invoices-receipts"
      },
];

const bottomNavigationItems = [
      {
            label: "Help",
            icon: <MessageCircleQuestionMark />,
            to: "/help"
      },
      {
            label: "Settings",
            icon: <Settings />,
            to: "/settings"
      },
];

export const SidebarNavigationSection = ({ onClose }: any) => {
      return (
            <nav className="flex flex-col h-full relative">
                  {/* Mobile close button */}
                  <button
                        onClick={onClose}
                        className="lg:hidden absolute top-4 right-4 p-2 text-textSecondary hover:text-primary"
                  >
                        <X size={20} />
                  </button>

                  <div className="px-5.5 py-10">
                        <h2 className="font-bold text-textHighlight text-xl tracking-[0] leading-[normal] mb-3">
                              Profile
                        </h2>
                        <div className="flex items-center gap-2">
                              <Avatar className="">
                                    <AvatarImage
                                          className="object-contain rounded-full w-10 h-10"
                                          src="/profile.png"
                                          alt="Gwen Lam"
                                    />
                                    <AvatarFallback className="text-[8px]">GL</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                    <span className="font-medium text-textPrimary whitespace-nowrap">
                                          Gwen Lam
                                    </span>
                                    <span className="font-normal text-primary text-sm">
                                          ST Comp Holdings Sdn Bhd
                                    </span>
                              </div>
                        </div>
                  </div>

                  <div className="px-3 flex flex-col gap-0">
                        <div className="px-2 mb-4.5">
                              <span className="font-bold text-textPrimary tracking-[0] leading-[normal]">
                                    Dashboard
                              </span>
                        </div>

                        {navigationItems.map((item, index) => (
                              <NavLink
                                    key={index}
                                    to={item.to}
                                    onClick={onClose} // close sidebar on navigation (mobile)
                                    className={({ isActive }) =>
                                          `w-full h-auto py-3 justify-start px-4 gap-2 hover:bg-primary hover:text-white text-textPrimary font-medium ${isActive ? " bg-primary text-white" : ""
                                          } rounded-md flex items-center`
                                    }
                              >
                                    <div className="flex items-center gap-5 text-lg">
                                          {item.icon}
                                          <span className="font-medium whitespace-nowrap tracking-[0] leading-[normal]">
                                                {item.label}
                                          </span>
                                    </div>
                              </NavLink>
                        ))}
                  </div>

                  <div className="mt-auto px-3 pb-6 flex flex-col gap-0">
                        {bottomNavigationItems.map((item, index) => (
                              <Button
                                    key={index}
                                    variant="ghost"
                                    className="w-full h-auto py-3 justify-start px-4 hover:bg-primary hover:text-white text-textPrimary"
                                    onClick={onClose} // optional, close on click
                              >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                              </Button>
                        ))}
                  </div>
            </nav>
      );
};