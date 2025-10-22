import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Mountain, Users, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import ZaloContact from "@/components/ZaloContact";
import Chatbot from "@/components/Chatbot";
import heroImage from "@/assets/hero-trekking.jpg";
import campingImage from "@/assets/camping-night.jpg";
import teamBuildingImage from "@/assets/team-building.jpg";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [featuredTours, setFeaturedTours] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Load featured tours
    loadFeaturedTours();

    return () => subscription.unsubscribe();
  }, []);

  const loadFeaturedTours = async () => {
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("featured", true)
      .eq("active", true)
      .limit(6);

    if (!error && data) {
      setFeaturedTours(data);
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      window.location.href = `/tours?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Trekking adventure"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Khám phá thiên nhiên
            <br />
            <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
              Vượt qua giới hạn
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in">
            Trải nghiệm những chuyến trekking an toàn và chuyên nghiệp tại Việt Nam
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-2 animate-fade-in">
            <Input
              type="text"
              placeholder="Tìm kiếm điểm đến, độ khó..."
              className="h-12 bg-white/95 backdrop-blur"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button size="lg" className="h-12" onClick={handleSearch}>
              <Search className="h-5 w-5 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">100+ Tours</h3>
              <p className="text-sm text-muted-foreground">Đa dạng tuyến đường khắp Việt Nam</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Hướng dẫn viên chuyên nghiệp</h3>
              <p className="text-sm text-muted-foreground">Được đào tạo bài bản, giàu kinh nghiệm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Bảo hiểm toàn diện</h3>
              <p className="text-sm text-muted-foreground">An toàn tuyệt đối cho mọi hành trình</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">5000+ khách hài lòng</h3>
              <p className="text-sm text-muted-foreground">Đánh giá tích cực từ khách hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tours Nổi Bật</h2>
              <p className="text-muted-foreground">Những chuyến đi được yêu thích nhất</p>
            </div>
            <Link to="/tours">
              <Button variant="outline">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Types Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Loại hình trải nghiệm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/tours?type=trekking" className="group">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img src={heroImage} alt="Trekking" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Trekking</h3>
                  <p className="text-white/90">Chinh phục những đỉnh núi hùng vĩ</p>
                </div>
              </div>
            </Link>
            <Link to="/tours?type=experience" className="group">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img src={campingImage} alt="Experience" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Trải nghiệm</h3>
                  <p className="text-white/90">Camping, survival, đêm trong rừng</p>
                </div>
              </div>
            </Link>
            <Link to="/tours?type=team_building" className="group">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img src={teamBuildingImage} alt="Team Building" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Team Building</h3>
                  <p className="text-white/90">Gắn kết đội ngũ trong thiên nhiên</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Sẵn sàng cho cuộc phiêu lưu?</h2>
          <p className="text-xl mb-8 opacity-90">
            Kiểm tra sức khỏe và tìm tour phù hợp với bạn
          </p>
          <Link to="/health-check">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Đánh giá sức khỏe ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <ZaloContact />
      <Chatbot />
    </div>
  );
};

export default Index;
