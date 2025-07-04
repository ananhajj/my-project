import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState({
    contact_email: 'support@school-system.com',
    contact_phone: '+966 50 123 4567',
    contact_address: 'المملكة العربية السعودية'
  });

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContactInfo({
        contact_email: data.contact_email || 'support@school-system.com',
        contact_phone: data.contact_phone || '+966 50 123 4567',
        contact_address: data.contact_address || 'المملكة العربية السعودية'
      });
    }
  }, []);

  return (
    <footer className="bg-primary-navy text-white mt-8" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ح</span>
              </div>
              <h3 className="text-xl font-bold text-primary-green">
                منصة حاضرون التعليمية
              </h3>
            </div>
            <p className="text-neutral-gray leading-relaxed">
              منصة شاملة ومتقدمة لرصد الحضور اليومي للطلاب مع الإحصائيات المتقدمة والتقارير التفصيلية.
            </p>
            <div className="flex items-center gap-2 text-primary-teal">
              <Heart className="h-4 w-4" />
              <span className="text-sm">صُنع بحب للتعليم</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-green">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-neutral-gray hover:text-primary-teal transition-colors">الصفحة الرئيسية</Link></li>
              <li><Link to="/school/students" className="text-neutral-gray hover:text-primary-teal transition-colors">إدارة الطلاب</Link></li>
              <li><Link to="/school/attendance" className="text-neutral-gray hover:text-primary-teal transition-colors">تسجيل الحضور</Link></li>
              <li><Link to="/school/reports" className="text-neutral-gray hover:text-primary-teal transition-colors">التقارير والإحصائيات</Link></li>
              <li><Link to="/school/school-settings" className="text-neutral-gray hover:text-primary-teal transition-colors">إعدادات المدرسة</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-green">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-gray">
                <Mail className="h-4 w-4 text-primary-teal" />
                <span>{contactInfo.contact_email}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-gray">
                <Phone className="h-4 w-4 text-primary-teal" />
                <span>{contactInfo.contact_phone}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-gray">
                <MapPin className="h-4 w-4 text-primary-teal" />
                <span>{contactInfo.contact_address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-blue/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-gray text-sm">
              © {currentYear} منصة حاضرون التعليمية. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4 text-sm text-neutral-gray">
              <Link to="/privacy-policy" className="hover:text-primary-teal transition-colors">سياسة الخصوصية</Link>
              <span>|</span>
              <Link to="/terms-of-service" className="hover:text-primary-teal transition-colors">شروط الاستخدام</Link>
              <span>|</span>
              <Link to="/help" className="hover:text-primary-teal transition-colors">المساعدة</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
