// script.js
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Render 后端接口
const API_URL = "https://ai-assistant-backend-l09a.onrender.com/api/ask";

// 创建消息元素
function addMessage(content, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message");
  msgDiv.classList.add(sender);

  msgDiv.textContent = content;

  chatBox.appendChild(msgDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

// 发送消息
async function sendMessage() {

  const prompt = userInput.value.trim();

  if (!prompt) return;

  // 显示用户消息
  addMessage(prompt, "user");

  userInput.value = "";

  // AI思考中
  const loadingMsg = document.createElement("div");

  loadingMsg.classList.add("chat-message", "ai");

  loadingMsg.textContent = "AI 正在思考...";

  chatBox.appendChild(loadingMsg);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      // 这里修复
      body: JSON.stringify({
        question: prompt
      })
    });

    const data = await response.json();

    // 删除等待消息
    chatBox.removeChild(loadingMsg);

    // 输出AI回复
    if (data.answer) {

      addMessage(data.answer, "ai");

    } else {

      addMessage("AI 没有返回有效答案，请稍后再试。", "ai");

      console.log(data);
    }

  } catch (err) {

    chatBox.removeChild(loadingMsg);

    addMessage("请求失败：" + err.message, "ai");

    console.error(err);
  }
}

// 点击发送
sendBtn.addEventListener("click", sendMessage);

// 回车发送
userInput.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {

    sendMessage();
  }
});