import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const HealthAssessment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    fitness_level: 5,
    experience_level: 5,
    medical_conditions: [] as string[],
    has_heart_conditions: false,
    has_respiratory_conditions: false,
    has_mobility_issues: false,
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thực hiện đánh giá sức khỏe",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const handleMedicalConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medical_conditions: prev.medical_conditions.includes(condition)
        ? prev.medical_conditions.filter(c => c !== condition)
        : [...prev.medical_conditions, condition]
    }));
  };

  const calculateScore = () => {
    let score = 0;
    const age = parseInt(formData.age);
    
    // Age scoring (max 20 points)
    if (age < 30) score += 20;
    else if (age < 40) score += 15;
    else if (age < 50) score += 10;
    else if (age < 60) score += 5;
    
    // BMI scoring (max 20 points)
    const height = parseFloat(formData.height) / 100; // convert to meters
    const weight = parseFloat(formData.weight);
    const bmi = weight / (height * height);
    
    if (bmi >= 18.5 && bmi < 25) score += 20;
    else if (bmi >= 25 && bmi < 30) score += 15;
    else if (bmi >= 17 && bmi < 35) score += 10;
    else score += 5;
    
    // Fitness level (max 30 points)
    score += formData.fitness_level * 3;
    
    // Experience level (max 20 points)
    score += formData.experience_level * 2;
    
    // Medical conditions penalty
    if (formData.has_heart_conditions) score -= 15;
    if (formData.has_respiratory_conditions) score -= 10;
    if (formData.has_mobility_issues) score -= 10;
    if (formData.medical_conditions.length > 0) score -= formData.medical_conditions.length * 5;
    
    return Math.max(0, Math.min(100, score));
  };

  const getRecommendedDifficulty = (score: number) => {
    if (score >= 80) return "extreme";
    if (score >= 60) return "challenging";
    if (score >= 40) return "moderate";
    return "easy";
  };

  const getWarnings = () => {
    const warnings: string[] = [];
    const age = parseInt(formData.age);
    
    if (age > 60) {
      warnings.push("Do tuổi cao, bạn nên tham khảo ý kiến bác sĩ trước khi tham gia các tour mạo hiểm");
    }
    
    if (formData.has_heart_conditions) {
      warnings.push("Bệnh tim mạch có thể gây nguy hiểm khi tham gia hoạt động thể chất mạnh. Vui lòng tham khảo bác sĩ");
    }
    
    if (formData.has_respiratory_conditions) {
      warnings.push("Bệnh hô hấp có thể gây khó khăn ở độ cao. Cần có sự giám sát y tế");
    }
    
    if (formData.has_mobility_issues) {
      warnings.push("Vấn đề vận động có thể hạn chế khả năng tham gia các tour khó");
    }
    
    if (formData.fitness_level < 3) {
      warnings.push("Thể lực yếu, nên bắt đầu với các tour dễ và tăng dần độ khó");
    }
    
    if (formData.experience_level < 3) {
      warnings.push("Kinh nghiệm hạn chế, nên đi cùng hướng dẫn viên có kinh nghiệm");
    }
    
    return warnings;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập",
        variant: "destructive",
      });
      return;
    }

    if (!formData.age || !formData.height || !formData.weight) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const score = calculateScore();
      const recommended_difficulty = getRecommendedDifficulty(score);
      const warnings = getWarnings();

      const { error } = await supabase
        .from("health_assessments")
        .insert({
          user_id: user.id,
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          fitness_level: formData.fitness_level,
          experience_level: formData.experience_level,
          medical_conditions: formData.medical_conditions,
          has_heart_conditions: formData.has_heart_conditions,
          has_respiratory_conditions: formData.has_respiratory_conditions,
          has_mobility_issues: formData.has_mobility_issues,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          score,
          recommended_difficulty,
          warnings,
        });

      if (error) throw error;

      toast({
        title: "Đánh giá hoàn tất",
        description: `Điểm của bạn: ${score}/100. Độ khó phù hợp: ${recommended_difficulty}`,
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Đánh Giá Sức Khỏe</CardTitle>
            <CardDescription>
              Hoàn thành bảng đánh giá để chúng tôi có thể gợi ý tour phù hợp với sức khỏe của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Tuổi *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Chiều cao (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    required
                    min="50"
                    max="250"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Cân nặng (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                    min="20"
                    max="300"
                  />
                </div>
              </div>

              {/* Fitness Level */}
              <div>
                <Label>Mức độ thể lực (1-10): {formData.fitness_level}</Label>
                <Slider
                  value={[formData.fitness_level]}
                  onValueChange={(value) => setFormData({ ...formData, fitness_level: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  1 = Không tập luyện, 10 = Vận động viên
                </p>
              </div>

              {/* Experience Level */}
              <div>
                <Label>Kinh nghiệm leo núi/trekking (1-10): {formData.experience_level}</Label>
                <Slider
                  value={[formData.experience_level]}
                  onValueChange={(value) => setFormData({ ...formData, experience_level: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  1 = Chưa có kinh nghiệm, 10 = Chuyên nghiệp
                </p>
              </div>

              {/* Medical Conditions */}
              <div className="space-y-3">
                <Label>Tình trạng sức khỏe</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="heart"
                    checked={formData.has_heart_conditions}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_heart_conditions: checked as boolean })
                    }
                  />
                  <label htmlFor="heart" className="text-sm">
                    Bệnh tim mạch
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="respiratory"
                    checked={formData.has_respiratory_conditions}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_respiratory_conditions: checked as boolean })
                    }
                  />
                  <label htmlFor="respiratory" className="text-sm">
                    Bệnh hô hấp (hen suyễn, COPD...)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobility"
                    checked={formData.has_mobility_issues}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_mobility_issues: checked as boolean })
                    }
                  />
                  <label htmlFor="mobility" className="text-sm">
                    Vấn đề về xương khớp/vận động
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Bệnh nền khác (chọn nếu có)</Label>
                  {["Đái tháo đường", "Cao huyết áp", "Thiếu máu", "Dị ứng nghiêm trọng"].map(
                    (condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.medical_conditions.includes(condition)}
                          onCheckedChange={() => handleMedicalConditionToggle(condition)}
                        />
                        <label htmlFor={condition} className="text-sm">
                          {condition}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_name">Người liên hệ khẩn cấp</Label>
                  <Input
                    id="emergency_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    placeholder="Tên người thân"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_phone">Số điện thoại khẩn cấp</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                    placeholder="0123456789"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Hoàn thành đánh giá
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default HealthAssessment;
