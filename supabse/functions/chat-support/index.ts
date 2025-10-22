import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Bạn là trợ lý ảo thân thiện của Trek Beyond - một công ty tổ chức tour du lịch chuyên nghiệp tại Việt Nam.

Nhiệm vụ của bạn:
- Tư vấn về các tour du lịch, trekking, camping và team building
- Giải đáp thắc mắc về lịch trình, giá cả, dịch vụ
- Hỗ trợ thông tin về đặt tour, thanh toán
- Tư vấn về kiểm tra sức khỏe trước khi tham gia tour
- Cung cấp thông tin liên hệ: Hotline 0978 785 678, Email: support@trekbeyond.vn

Phong cách giao tiếp:
- Lịch sự, thân thiện, chuyên nghiệp
- Trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin
- Sử dụng tiếng Việt tự nhiên
- Khuyến khích khách hàng đặt tour hoặc liên hệ để được tư vấn chi tiết hơn

Nếu không chắc chắn về thông tin cụ thể, hãy đề nghị khách hàng liên hệ hotline để được tư vấn trực tiếp.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
