"use client";

import Link from "next/link";
import { useState } from "react";

type Message = {
  sender: "ai" | "user";
  text: string;
};

export default function ChatPage() {
  const [userMsg, setUserMsg] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMsg.trim() || loading) return;

    const currentMessage = userMsg.trim();

    // แสดงข้อความของ user ใน console
    console.log("User:", currentMessage);

    setChat((prev) => [...prev, { sender: "user", text: currentMessage }]);
    setUserMsg("");
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY in environment variables");
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey || "",
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [
                {
                  text: "You are a Thai HealthCare Assistant AI from TU-PINE Care app",
                },
              ],
            },
            contents: [
              {
                parts: [{ text: currentMessage }],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "ขออภัยค่ะ/ครับ ไม่สามารถตอบกลับได้";

      // แสดงข้อความของ AI ใน console
      console.log("AI:", aiText);

      setChat((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (error) {
      console.error("API Error:", error);

      const errorText = "เกิดข้อผิดพลาดในการเชื่อมต่อ API";

      // แสดงข้อความ error ของ AI ใน console
      console.log("AI:", errorText);

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorText,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between rounded-sm border border-gray-300 bg-white px-5 py-4 shadow-sm">
          <h1 className="text-[22px] font-bold text-green-600">
            ปรึกษาคุณหมอ (AI)
          </h1>

          <Link
            href="/"
            className="rounded-md bg-[#e9edf3] px-5 py-3 text-base font-semibold text-gray-700"
          >
            กลับหน้าแรก
          </Link>
        </div>

        <div className="rounded-md border border-gray-300 bg-[#eef1f5] p-6 shadow-sm">
          <div className="h-[560px] overflow-y-auto rounded-sm border border-gray-200 bg-[#eef1f5] p-4">
            <div className="space-y-6">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <div className="max-w-[78%] rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[16px] leading-8 text-gray-800 shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[220px] rounded-2xl bg-blue-600 px-6 py-5 text-center text-[16px] font-semibold text-white shadow-sm">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[78%] rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[16px] leading-8 text-gray-500 shadow-sm">
                    กำลังตอบ...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-sm border border-gray-200 bg-white p-4">
            <input
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="พิมพ์ข้อความสอบถามอาการเบื้องต้น..."
              className="h-[58px] flex-1 rounded-md border border-gray-300 px-4 text-[16px] text-gray-700 outline-none placeholder:text-gray-400"
            />

            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="h-[58px] rounded-md bg-green-500 px-8 text-[16px] font-semibold text-white disabled:opacity-70"
            >
              ส่ง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
