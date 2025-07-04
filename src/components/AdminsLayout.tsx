// AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";  // هذا لتضمين المسارات الفرعية داخل الـ Layout

const AdminsLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminsLayout;
