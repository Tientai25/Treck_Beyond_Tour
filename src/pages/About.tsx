import { useState, useEffect } from "react";
import { Mountain, Users, Award, Target, Heart, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-trekking.jpg";

const About = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="About Trek Beyond"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Về Trek Beyond</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Đồng hành cùng bạn trên mọi hành trình khám phá thiên nhiên
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-lg text-muted-foreground">
              Trek Beyond được thành lập với sứ mệnh mang đến những trải nghiệm trekking an toàn, 
              chuyên nghiệp và đáng nhớ cho mọi người. Chúng tôi tin rằng thiên nhiên là nơi tuyệt vời 
              để con người tìm thấy sự cân bằng, học hỏi và phát triển bản thân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tầm Nhìn</h3>
                <p className="text-muted-foreground">
                  Trở thành đơn vị dẫn đầu về tour trekking và trải nghiệm thiên nhiên tại Việt Nam
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Giá Trị</h3>
                <p className="text-muted-foreground">
                  An toàn, chuyên nghiệp, trách nhiệm với môi trường và cộng đồng địa phương
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Đổi Mới</h3>
                <p className="text-muted-foreground">
                  Liên tục cải tiến dịch vụ và tạo ra những trải nghiệm độc đáo cho khách hàng
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-10 w-10 text-primary" />
              </div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-muted-foreground">Tours đa dạng</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-secondary" />
              </div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-muted-foreground">Khách hàng hài lòng</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-accent" />
              </div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <p className="text-muted-foreground">Năm kinh nghiệm</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-muted-foreground">Hướng dẫn viên</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Đội Ngũ Chuyên Nghiệp</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Đội ngũ hướng dẫn viên của chúng tôi được đào tạo bài bản, có chứng chỉ chuyên môn 
            và giàu kinh nghiệm thực tế trên các cung đường trekking khó khăn nhất.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Chứng Chỉ Quốc Tế</h3>
                <p className="text-muted-foreground">
                  Tất cả hướng dẫn viên đều có chứng chỉ sơ cấp cứu, leo núi và 
                  định hướng địa hình được công nhận quốc tế.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Kinh Nghiệm Thực Tế</h3>
                <p className="text-muted-foreground">
                  Mỗi hướng dẫn viên có ít nhất 5 năm kinh nghiệm thực tế 
                  trên các cung đường trekking tại Việt Nam.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Đào Tạo Liên Tục</h3>
                <p className="text-muted-foreground">
                  Chương trình đào tạo và cập nhật kiến thức định kỳ 
                  để đảm bảo chất lượng dịch vụ tốt nhất.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Cam Kết Của Chúng Tôi</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6">
              Trek Beyond cam kết mang đến trải nghiệm an toàn, chuyên nghiệp và đáng nhớ 
              cho mọi khách hàng. Chúng tôi luôn đặt sự an toàn và trải nghiệm của bạn lên hàng đầu.
            </p>
            <ul className="text-left space-y-2 mb-8">
              <li>✓ Bảo hiểm toàn diện cho mọi chuyến đi</li>
              <li>✓ Trang thiết bị hiện đại và an toàn</li>
              <li>✓ Hướng dẫn viên chuyên nghiệp có chứng chỉ</li>
              <li>✓ Hỗ trợ y tế khẩn cấp 24/7</li>
              <li>✓ Cam kết bảo vệ môi trường</li>
              <li>✓ Hỗ trợ cộng đồng địa phương</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;