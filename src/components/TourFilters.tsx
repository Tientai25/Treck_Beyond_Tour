import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TourFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: string | null;
  startLocation: string | null;
  destination: string | null;
  date: Date | undefined;
  tourType: string | null;
  transportation: string | null;
}

export const TourFilters = ({ onFilterChange }: TourFiltersProps) => {
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState<string>("hanoi");
  const [destination, setDestination] = useState<string>("all");
  const [date, setDate] = useState<Date>();
  const [tourType, setTourType] = useState<string | null>(null);
  const [transportation, setTransportation] = useState<string | null>(null);

  const handleApply = () => {
    onFilterChange({
      priceRange,
      startLocation,
      destination: destination === "all" ? null : destination,
      date,
      tourType,
      transportation,
    });
  };

  const handleClearTourType = () => {
    setTourType(null);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">BỘ LỌC TÌM KIẾM</h2>

      {/* Ngân sách */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Ngân sách</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={priceRange === "0-5" ? "default" : "outline"}
            onClick={() => setPriceRange(priceRange === "0-5" ? null : "0-5")}
            className="text-sm"
          >
            Dưới 5 triệu
          </Button>
          <Button
            variant={priceRange === "5-10" ? "default" : "outline"}
            onClick={() => setPriceRange(priceRange === "5-10" ? null : "5-10")}
            className="text-sm"
          >
            Từ 5 - 10 triệu
          </Button>
          <Button
            variant={priceRange === "10-20" ? "default" : "outline"}
            onClick={() => setPriceRange(priceRange === "10-20" ? null : "10-20")}
            className="text-sm"
          >
            Từ 10 - 20 triệu
          </Button>
          <Button
            variant={priceRange === "20+" ? "default" : "outline"}
            onClick={() => setPriceRange(priceRange === "20+" ? null : "20+")}
            className="text-sm"
          >
            Trên 20 triệu
          </Button>
        </div>
      </div>

      {/* Điểm khởi hành */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Điểm khởi hành</h3>
        <Select value={startLocation} onValueChange={setStartLocation}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="hanoi">Hà Nội</SelectItem>
            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
            <SelectItem value="danang">Đà Nẵng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Điểm đến */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Điểm đến</h3>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="bac-ninh">Bắc Ninh</SelectItem>
            <SelectItem value="hung-yen">Hưng Yên</SelectItem>
            <SelectItem value="tam-dao">Tam Đảo</SelectItem>
            <SelectItem value="ha-giang">Hà Giang</SelectItem>
            <SelectItem value="sapa">Sapa</SelectItem>
            <SelectItem value="ha-long">Hạ Long</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ngày đi */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Ngày đi</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-background",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Dòng tour */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Dòng tour</h3>
          {tourType && (
            <button
              onClick={handleClearTourType}
              className="text-sm text-primary hover:underline"
            >
              Xóa
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={tourType === "premium" ? "default" : "outline"}
            onClick={() => setTourType(tourType === "premium" ? null : "premium")}
            className="text-sm"
          >
            Cao cấp
          </Button>
          <Button
            variant={tourType === "standard" ? "default" : "outline"}
            onClick={() => setTourType(tourType === "standard" ? null : "standard")}
            className="text-sm"
          >
            Tiêu chuẩn
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            variant={tourType === "budget" ? "default" : "outline"}
            onClick={() => setTourType(tourType === "budget" ? null : "budget")}
            className="text-sm"
          >
            Tiết kiệm
          </Button>
          <Button variant="outline" className="text-sm">
            Giá tốt
          </Button>
        </div>
      </div>

      {/* Phương tiện */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Phương tiện</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={transportation === "xe" ? "default" : "outline"}
            onClick={() => setTransportation(transportation === "xe" ? null : "xe")}
            className="text-sm"
          >
            Xe
          </Button>
          <Button
            variant={transportation === "may-bay" ? "default" : "outline"}
            onClick={() => setTransportation(transportation === "may-bay" ? null : "may-bay")}
            className="text-sm"
          >
            Máy bay
          </Button>
        </div>
      </div>

      {/* Áp dụng */}
      <Button onClick={handleApply} className="w-full">
        Áp dụng
      </Button>
    </div>
  );
};
