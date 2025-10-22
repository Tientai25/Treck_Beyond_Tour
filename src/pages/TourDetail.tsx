import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, Clock, DollarSign, Loader2, CreditCard, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface TourDetail {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_days: number;
  price: number;
  location: string;
  main_image: string | null;
  tour_type: string;
  max_participants: number;
  min_participants: number;
  itinerary: any;
  included_services: any;
  excluded_services: any;
  requirements: string | null;
  departure_dates: string[] | null;
  slug: string;
}

const TourDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [participants, setParticipants] = useState(1);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [contactName, setContactName] = useState("");
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadTourDetail();
  }, [slug]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadTourDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (error) throw error;
      setTour(data);
    } catch (error) {
      console.error("Error loading tour:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin chuyến đi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đặt tour",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "Chọn ngày khởi hành",
        description: "Vui lòng chọn ngày khởi hành trước khi thanh toán",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "bank_transfer") {
      setShowBankInfo(true);
      setIsPaymentOpen(false);
    } else {
      toast({
        title: "Đặt tour thành công",
        description: `Tour đã được đặt cho ngày ${selectedDate ? format(selectedDate, "PPP", { locale: vi }) : ""}. Phương thức thanh toán: ${paymentMethod === "credit_card" ? "Thẻ tín dụng" : "Ví điện tử"}`,
      });
      setIsPaymentOpen(false);
      navigate(`/booking/${slug}?date=${selectedDate?.toISOString()}&payment=${paymentMethod}`);
    }
  };

  const isDateAvailable = (date: Date) => {
    if (!tour?.departure_dates) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return tour.departure_dates.includes(dateStr);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "challenging":
        return "bg-orange-500";
      case "extreme":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Dễ";
      case "moderate":
        return "Trung bình";
      case "challenging":
        return "Khó";
      case "extreme":
        return "Cực khó";
      default:
        return difficulty;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy chuyến đi</h1>
            <Button onClick={() => navigate("/")}>Về trang chủ</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      
      <main className="flex-grow">
        {/* Hero Image */}
        <div className="relative h-[400px] bg-gray-200">
          {tour.main_image && (
            <img
              src={tour.main_image}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
              <div className="flex gap-2">
                <Badge className={getDifficultyColor(tour.difficulty)}>
                  {getDifficultyLabel(tour.difficulty)}
                </Badge>
                <Badge variant="secondary">{tour.tour_type}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Thông tin chuyến đi</h2>
                  <p className="text-muted-foreground mb-6">{tour.description}</p>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{tour.duration_days} ngày</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>{tour.min_participants} - {tour.max_participants} người</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-xl font-bold text-primary">
                        {tour.price.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>

                  {tour.requirements && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Yêu cầu</h3>
                        <p className="text-muted-foreground">{tour.requirements}</p>
                      </div>
                    </>
                  )}

                  {tour.itinerary && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Lộ trình chuyến đi</h3>
                        <div className="space-y-4">
                          {Array.isArray(tour.itinerary) ? (
                            tour.itinerary.map((day: any, index: number) => (
                              <div key={index} className="border-l-2 border-primary pl-4">
                                <h4 className="font-semibold mb-2">
                                  Ngày {day.day || index + 1}: {day.title}
                                </h4>
                                <p className="text-muted-foreground">{day.description}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">Thông tin lộ trình sẽ được cập nhật sớm</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-primary mb-2">
                      {tour.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-muted-foreground">Giá mỗi người</p>
                  </div>

                  <Separator className="my-4" />

                  {/* Participant Count */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Số người tham gia</h3>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipants(Math.max(tour.min_participants, participants - 1))}
                        disabled={participants <= tour.min_participants}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={participants}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || tour.min_participants;
                          setParticipants(Math.min(tour.max_participants, Math.max(tour.min_participants, val)));
                        }}
                        className="text-center"
                        min={tour.min_participants}
                        max={tour.max_participants}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipants(Math.min(tour.max_participants, participants + 1))}
                        disabled={participants >= tour.max_participants}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tối thiểu {tour.min_participants} - Tối đa {tour.max_participants} người
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Departure Date Selection */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Chọn ngày khởi hành</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isPast = date < today;
                            
                            // Nếu không có departure_dates, cho phép chọn tất cả ngày trong tương lai
                            if (!tour?.departure_dates || tour.departure_dates.length === 0) {
                              return isPast;
                            }
                            
                            // Nếu có departure_dates, chỉ cho phép chọn những ngày trong danh sách
                            const isAvailable = isDateAvailable(date);
                            return isPast || !isAvailable;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {tour?.departure_dates && tour.departure_dates.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Lịch khởi hành khả dụng: {tour.departure_dates.length} ngày
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Total Price */}
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Tổng tiền:</span>
                      <span className="text-2xl font-bold text-primary">
                        {(tour.price * participants).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {participants} người × {tour.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  
                  <Button onClick={handleBooking} className="w-full mb-4" size="lg">
                    Thanh toán
                  </Button>

                  {!user && (
                    <p className="text-sm text-center text-muted-foreground">
                      Bạn cần đăng nhập để đặt tour
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Method Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
            <DialogDescription>
              Vui lòng chọn phương thức thanh toán cho đơn hàng của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Bank Transfer Info Box */}
            

            <Separator className="my-2" />

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Chuyển khoản ngân hàng</p>
                    <p className="text-sm text-muted-foreground">Thanh toán qua chuyển khoản</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Thẻ tín dụng/Ghi nợ</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="e_wallet" id="e_wallet" />
                <Label htmlFor="e_wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Ví điện tử</p>
                    <p className="text-sm text-muted-foreground">Momo, ZaloPay, VNPay</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Ngày khởi hành:</span>
                <span className="font-medium">
                  {selectedDate ? format(selectedDate, "PPP", { locale: vi }) : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Số người:</span>
                <span className="font-medium">{participants} người</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="text-xl font-bold text-primary">
                  {(tour ? tour.price * participants : 0).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>

            <Button onClick={handleConfirmPayment} className="w-full" size="lg">
              Xác nhận đặt tour
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bank Transfer Information Dialog */}
      <Dialog open={showBankInfo} onOpenChange={setShowBankInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin chuyển khoản</DialogTitle>
            <DialogDescription>
              Vui lòng chuyển khoản theo thông tin bên dưới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Bank Account Info */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/20 p-2 rounded-lg border-2 border-primary/30">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-semibold text-primary text-lg">TP Bank</span>
                </div>
                <Separator /> 
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-mono font-bold text-xl">12090355425</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-medium">Công ty Du lịch Trekking</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-bold text-primary text-lg">
                    {(tour ? tour.price * participants : 0).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-2">Nội dung chuyển khoản số điện thoại và email:</p>
                  
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Quét mã QR để chuyển khoản</p>
              <img
                src={`https://img.vietqr.io/image/TPB-12090355425-compact2.png?amount=${tour ? tour.price * participants : 0}&addInfo=${encodeURIComponent(`${userProfile?.phone || ""} ${userProfile?.full_name || user?.email || ""}`)}`}
                alt="QR Code chuyển khoản"
                className="w-64 h-64 border-4 border-primary/20 rounded-lg"
              />
          
            </div>

            <Button 
              onClick={() => {
                setShowBankInfo(false);
                toast({
                  title: "Đặt tour thành công",
                  description: "Vui lòng chuyển khoản theo thông tin trên để hoàn tất đặt tour",
                });
              }} 
              className="w-full" 
              size="lg"
            >
              Đã hiểu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default TourDetail;
