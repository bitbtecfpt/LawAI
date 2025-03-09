require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/chatbot", async (req, res) => {
    try {
        const { message } = req.body;

        // Kiểm tra nếu người dùng gửi câu hỏi cụ thể
        if (message.toLowerCase().includes("nguyên tắc sử dụng đất")) {
            return res.json({
                response: `Nguyên tắc sử dụng đất theo Luật Đất đai gồm:\n
                1️⃣ Đúng mục đích sử dụng đất.\n
                2️⃣ Bền vững, tiết kiệm, có hiệu quả.\n
                3️⃣ Bảo vệ môi trường, thích ứng với biến đổi khí hậu.\n
                4️⃣ Không xâm phạm quyền, lợi ích hợp pháp của người sử dụng đất xung quanh.\n
                📜 (Nguồn: Luật Đất đai 18/01/2024)`,
            });
        }

        const openaiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ response: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error("Lỗi chatbot:", error);
        res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại sau!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
