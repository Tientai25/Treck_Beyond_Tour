import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Profile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  is_default: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    avatar_url: "",
  });
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [newBank, setNewBank] = useState({
    bank_name: "",
    account_number: "",
    account_holder_name: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);
    await loadProfile(user.id);
    await loadBankAccounts(user.id);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        phone: data.phone || "",
        avatar_url: data.avatar_url || "",
      });
    }
  };

  const loadBankAccounts = async (userId: string) => {
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setBankAccounts(data);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (!user) return;
    if (!newBank.bank_name || !newBank.account_number || !newBank.account_holder_name) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("bank_accounts")
        .insert({
          user_id: user.id,
          bank_name: newBank.bank_name,
          account_number: newBank.account_number,
          account_holder_name: newBank.account_holder_name,
          is_default: bankAccounts.length === 0,
        });

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã thêm tài khoản ngân hàng",
      });

      setNewBank({ bank_name: "", account_number: "", account_holder_name: "" });
      setIsAddBankOpen(false);
      await loadBankAccounts(user.id);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBankAccount = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng",
      });

      await loadBankAccounts(user.id);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Tài Khoản Của Tôi</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="banking">Tài khoản ngân hàng</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email không thể thay đổi
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Họ và tên</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, full_name: e.target.value })
                      }
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <Separator />

                  <Button onClick={handleUpdateProfile} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cập nhật thông tin
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="banking">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Tài khoản ngân hàng</CardTitle>
                      <CardDescription>
                        Quản lý thông tin tài khoản ngân hàng của bạn
                      </CardDescription>
                    </div>
                    <Dialog open={isAddBankOpen} onOpenChange={setIsAddBankOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm tài khoản
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm tài khoản ngân hàng</DialogTitle>
                          <DialogDescription>
                            Nhập thông tin tài khoản ngân hàng của bạn
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bank_name">Tên ngân hàng</Label>
                            <Input
                              id="bank_name"
                              value={newBank.bank_name}
                              onChange={(e) =>
                                setNewBank({ ...newBank, bank_name: e.target.value })
                              }
                              placeholder="VD: Vietcombank, BIDV..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="account_number">Số tài khoản</Label>
                            <Input
                              id="account_number"
                              value={newBank.account_number}
                              onChange={(e) =>
                                setNewBank({ ...newBank, account_number: e.target.value })
                              }
                              placeholder="Nhập số tài khoản"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="account_holder_name">Tên chủ tài khoản</Label>
                            <Input
                              id="account_holder_name"
                              value={newBank.account_holder_name}
                              onChange={(e) =>
                                setNewBank({
                                  ...newBank,
                                  account_holder_name: e.target.value,
                                })
                              }
                              placeholder="Nhập tên chủ tài khoản"
                            />
                          </div>
                          <Button onClick={handleAddBankAccount} className="w-full">
                            Thêm tài khoản
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {bankAccounts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Chưa có tài khoản ngân hàng nào</p>
                      <p className="text-sm">Thêm tài khoản để thanh toán dễ dàng hơn</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bankAccounts.map((account) => (
                        <Card key={account.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                  <CreditCard className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{account.bank_name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {account.account_number}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {account.account_holder_name}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteBankAccount(account.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;