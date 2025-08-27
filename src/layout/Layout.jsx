import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Users, Sparkles, History } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import home from "../pages/Home.jsx";
import debate from "../pages/Debate.jsx";

const navigationItems = [
  {
    title: "Home",
    url: "/home",
    icon: MessageCircle,
    description: "Converse with historical figures",
  },
  {
    title: "Debate Arena",
    url: "/debate",
    icon: Users,
    description: "Watch personalities debate",
  },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Left Sidebar */}
        <Sidebar className="border-r border-slate-200/80 academic-shadow">
          <SidebarHeader className="border-b border-slate-200/80 p-6 elegant-gradient">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl elegant-gradient flex items-center justify-center border border-slate-300/30">
                <Sparkles className="w-5 h-5 gold-accent" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg tracking-tight">Historica</h2>
                <p className="text-xs text-slate-300 font-medium">Conversations Through Time</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-6 bg-white/95 backdrop-blur-sm">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-0 mb-4">
                Experience
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 rounded-xl px-4 py-3 ${
                          location.pathname === item.url
                            ? "bg-slate-100 text-slate-900 border-l-4 border-slate-800"
                            : "text-slate-600"
                        }`}
                      >
                        <Link to={item.url} className="flex items-start gap-4">
                          <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="font-semibold text-sm block leading-tight">
                              {item.title}
                            </span>
                            <span className="text-xs text-slate-500 font-normal">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-8 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/50">
              <div className="flex items-center gap-3 mb-2">
                <History className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Recent Activity</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your conversations and debates are automatically saved for future reference.
              </p>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Right Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 px-6 py-4 md:hidden academic-shadow">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-800">Historica</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
