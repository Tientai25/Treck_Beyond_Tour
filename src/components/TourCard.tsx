import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp } from "lucide-react";
import campingImage from "@/assets/camping-night.jpg";

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  duration_days: number;
  price: number;
  location: string;
  main_image?: string;
  tour_type: string;
}

interface TourCardProps {
  tour: Tour;
}

const difficultyColors = {
  easy: "bg-secondary text-secondary-foreground",
  moderate: "bg-primary text-primary-foreground",
  challenging: "bg-accent text-accent-foreground",
  extreme: "bg-destructive text-destructive-foreground",
};

const difficultyLabels = {
  easy: "Dễ",
  moderate: "Trung bình",
  challenging: "Khó",
  extreme: "Cực khó",
};

const TourCard = ({ tour }: TourCardProps) => {
  return (
    <Link to={`/tour/${tour.slug}`}>
      <Card className="group overflow-hidden h-full transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={tour.main_image || campingImage}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge 
            className={`absolute top-3 right-3 ${difficultyColors[tour.difficulty as keyof typeof difficultyColors]}`}
          >
            {difficultyLabels[tour.difficulty as keyof typeof difficultyLabels]}
          </Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {tour.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {tour.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{tour.duration_days} ngày</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>{tour.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <span className="text-2xl font-bold text-primary">
                {tour.price.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-sm text-muted-foreground ml-1">/người</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TourCard;
