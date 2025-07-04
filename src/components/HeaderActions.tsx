
import { Button } from "@/components/ui/button";
import { User, LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeaderActions = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-3">
      <Link to="/school/profile">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 lg:gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm text-xs px-3 lg:px-4 py-2 rounded-xl shadow-lg hover:shadow-xl">
          <User className="h-3 w-3 lg:h-4 lg:w-4" />
          <span className="hidden lg:inline">حسابي</span>
        </Button>
      </Link>
      
      <Link to="/school">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 lg:gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm text-xs px-3 lg:px-4 py-2 rounded-xl shadow-lg hover:shadow-xl">
          <Home className="h-3 w-3 lg:h-4 lg:w-4" />
          <span className="hidden lg:inline">الرئيسية</span>
        </Button>
      </Link>
      
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1.5 lg:gap-2 border-red-300/50 text-red-200 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300 backdrop-blur-sm text-xs px-3 lg:px-4 py-2 rounded-xl shadow-lg hover:shadow-xl"
      >
        <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
        <span className="hidden lg:inline">خروج</span>
      </Button>
    </div>
  );
};

export default HeaderActions;
