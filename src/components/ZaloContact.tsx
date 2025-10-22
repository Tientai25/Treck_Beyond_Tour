import { MessageCircle, Phone } from "lucide-react";

const ZaloContact = () => {
  const phoneNumber = "0978785678";
  const zaloLink = `https://zalo.me/${phoneNumber}`;

  return (
    <a
      href={zaloLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group"
    >
      <div className="flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        <div className="hidden group-hover:block transition-all">
          <div className="text-xs font-semibold">Liên hệ Zalo</div>
          <div className="flex items-center gap-1 text-xs">
            <Phone className="w-3 h-3" />
            <span>0978 785 678</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ZaloContact;
