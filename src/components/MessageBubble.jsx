const MessageBubble = ({ text, sender = "bot", timestamp }) => {
  // Tách đoạn văn bản thành các dòng
  const lines = text.split("\n").filter(line => line.trim() !== "");

  // Hàm để kiểm tra cấp độ thụt đầu dòng
  const getIndentLevel = (line) => {
    const match = line.match(/^(\s*[-\d.]+)\s+/);
    return match ? match[1].length : 0;
  };

  // Xây dựng danh sách có phân cấp
  const renderList = (lines) => {
    const listStack = [];
    let currentList = [];

    lines.forEach((line) => {
      const level = getIndentLevel(line);
      const cleanText = line.replace(/^(\s*[-\d.]+)\s+/, "");

      // Nếu cấp độ sâu hơn, tạo danh sách con
      if (listStack.length < level) {
        const newList = [];
        currentList.push(<ul className="pl-4">{newList}</ul>);
        listStack.push(currentList);
        currentList = newList;
      } 
      // Nếu cấp độ nông hơn, quay lại danh sách cha
      else while (listStack.length > level) {
        currentList = listStack.pop();
      }

      // Kiểm tra tiêu đề in đậm
      const formattedText = cleanText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      currentList.push(
        <li key={line} className="mb-1" dangerouslySetInnerHTML={{ __html: formattedText }} />
      );
    });

    return listStack.length > 0 ? listStack[0] : currentList;
  };

  return (
    <div className={`flex flex-col ${sender === "user" ? "items-end" : "items-start"} my-2 w-full`}>
      <div
        className={`p-3 rounded-xl w-fit max-w-[80%] md:max-w-[60%] text-white relative shadow-md break-words ${
          sender === "user"
            ? "bg-green-500 text-white self-end"
            : "bg-gray-700 text-white self-start"
        }`}
      >
        {lines.length > 1 ? <ul className="list-disc pl-5">{renderList(lines)}</ul> : <p>{text}</p>}
      </div>
      <span className="text-xs text-black mt-1">
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default MessageBubble;