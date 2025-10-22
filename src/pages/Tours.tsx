import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { TourFilters, FilterState } from "@/components/TourFilters";
import { Loader2 } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  duration_days: number;
  price: number;
  location: string;
  main_image: string | null;
  tour_type: string;
}

const Tours = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: null,
    startLocation: null,
    destination: null,
    date: undefined,
    tourType: null,
    transportation: null,
  });

  useEffect(() => {
    loadTours();
  }, [searchQuery, filters]);

  const loadTours = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("tours")
        .select("*")
        .eq("active", true);

      // Search by location
      if (searchQuery) {
        query = query.ilike("location", `%${searchQuery}%`);
      }

      // Filter by destination
      if (filters.destination) {
        query = query.ilike("location", `%${filters.destination}%`);
      }

      // Filter by price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-");
        if (max === "+") {
          query = query.gte("price", parseInt(min) * 1000000);
        } else {
          query = query
            .gte("price", parseInt(min) * 1000000)
            .lte("price", parseInt(max) * 1000000);
        }
      }

      // Filter by tour type/quality
      if (filters.tourType) {
        query = query.eq("quality_tier", filters.tourType);
      }

      // Filter by transportation
      if (filters.transportation) {
        query = query.contains("transportation", [filters.transportation]);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error("Error loading tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <TourFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Tours Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : "Tất cả các chuyến đi"}
              </h1>
              <p className="text-muted-foreground">
                {loading ? "Đang tải..." : `Tìm thấy ${tours.length} chuyến đi`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Không có chuyến đi nào phù hợp với tìm kiếm của bạn.
                </p>
                <p className="text-muted-foreground mt-2">
                  Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tours;
