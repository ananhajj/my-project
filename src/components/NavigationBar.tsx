
import HeaderNavigation from "./HeaderNavigation";

const NavigationBar = () => {
  return (
    <div className="sticky top-16 z-40 border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-primary-navy/95 via-primary-blue/90 to-primary-teal/85 shadow-sm" dir="rtl">
      {/* Subtle decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex justify-center items-center py-2 sm:py-3">
          <HeaderNavigation />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
