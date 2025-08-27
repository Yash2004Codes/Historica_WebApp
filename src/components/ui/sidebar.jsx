import React from "react";
export function Sidebar({ children, className }) {
  return <aside className={`w-72 bg-white ${className || ""}`}>{children}</aside>;
}
export function SidebarHeader({ children, className }) {
  return <div className={`${className || ""}`}>{children}</div>;
}
export function SidebarContent({ children, className }) {
  return <div className={`${className || ""}`}>{children}</div>;
}
export function SidebarGroup({ children }) { return <div>{children}</div>; }
export function SidebarGroupLabel({ children, className }) {
  return <div className={className}>{children}</div>;
}
export function SidebarGroupContent({ children }) { return <div>{children}</div>; }
export function SidebarMenu({ children, className }) {
  return <ul className={className}>{children}</ul>;
}
export function SidebarMenuItem({ children }) { return <li>{children}</li>; }
export function SidebarMenuButton({ children, className, asChild }) {
  const Comp = asChild ? React.Fragment : "button";
  return asChild ? <span className={className}>{children}</span> : <Comp className={className}>{children}</Comp>;
}
export function SidebarProvider({ children }) { return <>{children}</>; }
export function SidebarTrigger({ className }) {
  return <button className={`border rounded ${className || ""}`}>☰</button>;
}
export function SidebarContentWrapper({ children, className }) {
  return <div className={`fixed left-0 top-0 h-full ${className || ""}`}>{children}</div>;
}