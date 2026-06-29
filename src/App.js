import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "milwaukee2024";
const GEMINI_API_KEY = "AQ.Ab8RN6LAi5ktQ7QaEMHT7PNQDPclJQcxcw8D-aRPw6SAduIOOw";
const DEPARTMENTS = ["Production", "PMC", "OPM", "AME", "Quality", "ESG", "IE"];

const SAMPLE_DATA = [
  { id: "1", type: "qa", department: "Sales", question: "Quy trình báo giá cho khách hàng là gì?", answer: "1. Tiếp nhận yêu cầu từ khách hàng\n2. Kiểm tra tồn kho & lead time\n3. Tạo quotation trên hệ thống SAP\n4. Gửi cho Sales Manager duyệt nếu discount > 10%\n5. Gửi cho khách hàng qua email chính thức", tags: ["quotation", "SAP", "discount"], createdAt: Date.now() - 86400000 },
  { id: "2", type: "article", department: "Finance", title: "Quy trình thanh toán nhà cung cấp", content: "Tất cả các hóa đơn nhà cung cấp cần được xử lý trong vòng 30 ngày.\n\nBước 1: Nhận hóa đơn và kiểm tra với PO\nBước 2: Nhập vào hệ thống AP\nBước 3: 3 chiều matching: PO - GR - Invoice\nBước 4: Finance Manager phê duyệt nếu > $10,000\nBước 5: Chạy payment run vào thứ 6 hàng tuần", tags: ["AP", "payment", "invoice"], createdAt: Date.now() - 172800000 },
  { id: "3", type: "qa", department: "Operations", question: "KPI của bộ phận Operations được đo như thế nào?", answer: "Các KPI chính của Operations:\n- OEE (Overall Equipment Effectiveness): mục tiêu > 85%\n- On-time delivery: > 95%\n- Defect rate: < 0.5%\n- Inventory turnover: đo hàng quý\nBáo cáo được review hàng tháng trong buổi management meeting.", tags: ["KPI", "OEE", "delivery"], createdAt: Date.now() - 259200000 },
  { id: "4", type: "article", department: "HR", title: "Chính sách nghỉ phép năm", content: "Nhân viên chính thức được hưởng 12 ngày phép/năm.\n\n- Phép năm không được chuyển sang năm sau\n- Cần xin phép trước ít nhất 3 ngày làm việc\n- Nghỉ từ 3 ngày trở lên cần HRBP phê duyệt\n- Phép thai sản: 6 tháng theo quy định pháp luật", tags: ["phép", "HR", "policy"], createdAt: Date.now() - 300000000 },
  { id: "5", type: "article", department: "Marketing", title: "Quy trình phê duyệt nội dung truyền thông", content: "Mọi nội dung đăng tải ra bên ngoài đều cần đi qua quy trình phê duyệt:\n\n1. Content team soạn thảo\n2. Brand Manager review về tone & visual\n3. Legal team check nếu có claim sản phẩm\n4. Marketing Director phê duyệt cuối\n5. Thời gian xử lý: 3-5 ngày làm việc", tags: ["content", "approval", "brand"], createdAt: Date.now() - 350000000 }
];

const SUB_DEPTS = {
  Quality: ["Parts Quality", "Operation Quality"]
};
const DEPT_COLORS = {
  Production: { bg: "#FAEEDA", text: "#854F0B", icon: "🏭" },
  PMC: { bg: "#E6F1FB", text: "#185FA5", icon: "📅" },
  OPM: { bg: "#EEEDFE", text: "#533AB7", icon: "📊" },
  AME: { bg: "#E1F5EE", text: "#0F6E56", icon: "🔧" },
  Quality: { bg: "#FBEAF0", text: "#993556", icon: "✅" },
  ESG: { bg: "#E1F5EE", text: "#0F6E56", icon: "🌱" },
  IE: { bg: "#F1EFE8", text: "#5F5E5A", icon: "⚙️" }
};

function formatDate(ts) { return new Date(ts).toLocaleDateString("vi-VN"); }

function EntryCard({ entry, isAdmin, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const content = entry.type === "qa" ? entry.answer : entry.content;
  const title = entry.type === "qa" ? entry.question : entry.title;
  const preview = content.length > 200 ? content.slice(0, 200) + "..." : content;

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: 12, transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: entry.type === "qa" ? "#E6F1FB" : "#E1F5EE", color: entry.type === "qa" ? "#185FA5" : "#0F6E56" }}>
          {entry.type === "qa" ? "Q&A" : "Bài viết"}
        </span>
        <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 99, background: DEPT_COLORS[entry.department]?.bg || "#f5f5f5", color: DEPT_COLORS[entry.department]?.text || "#666" }}>
          {entry.department}
        </span>
        <span style={{ fontSize: 12, color: "#aaa", marginLeft: "auto" }}>{formatDate(entry.createdAt)}</span>
        {isAdmin && (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onEdit(entry)} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, border: "1px solid #ddd", background: "none", cursor: "pointer", color: "#555" }}>Sửa</button>
            <button onClick={() => onDelete(entry.id)} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, border: "1px solid #ddd", background: "none", cursor: "pointer", color: "#A32D2D" }}>Xóa</button>
          </div>
        )}
      </div>
      <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 8px", color: "#111", lineHeight: 1.5 }}>{title}</p>
      <p style={{ fontSize: 13.5, color: "#555", margin: "0 0 10px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{expanded ? content : preview}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {entry.tags?.map(t => <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#f5f5f5", color: "#888", border: "1px solid #eee" }}>#{t}</span>)}
        </div>
        {content.length > 200 && (
          <button onClick={() => setExpanded(!expanded)} style={{ fontSize: 12, color: "#185FA5", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 12 }}>
            {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
          </button>
        )}
      </div>
    </div>
  );
}

function AddEditForm({ entry, onSave, onCancel }) {
  const [type, setType] = useState(entry?.type || "qa");
  const [dept, setDept] = useState(entry?.department || "Sales");
  const [question, setQuestion] = useState(entry?.question || "");
  const [answer, setAnswer] = useState(entry?.answer || "");
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [tags, setTags] = useState((entry?.tags || []).join(", "));

  function handleSave() {
    const base = { id: entry?.id || Date.now().toString(), type, department: dept, tags: tags.split(",").map(t => t.trim()).filter(Boolean), createdAt: entry?.createdAt || Date.now() };
    if (type === "qa") onSave({ ...base, question, answer });
    else onSave({ ...base, title, content });
  }

  const inp = { width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box", marginBottom: 12, outline: "none" };
  const lbl = { fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 };

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "1.5rem", marginBottom: 20 }}>
      <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 16px" }}>{entry ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Loại nội dung</label><select value={type} onChange={e => setType(e.target.value)} style={{ ...inp, marginBottom: 0 }}><option value="qa">Q&A</option><option value="article">Bài viết</option></select></div>
        <div><label style={lbl}>Phòng ban</label><select value={dept} onChange={e => setDept(e.target.value)} style={{ ...inp, marginBottom: 0 }}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
      </div>
      {type === "qa" ? (<>
        <label style={lbl}>Câu hỏi</label><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Nhập câu hỏi..." style={inp} />
        <label style={lbl}>Câu trả lời</label><textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Nhập câu trả lời..." rows={4} style={{ ...inp, resize: "vertical" }} />
      </>) : (<>
        <label style={lbl}>Tiêu đề</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề bài viết..." style={inp} />
        <label style={lbl}>Nội dung</label><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Nội dung bài viết..." rows={5} style={{ ...inp, resize: "vertical" }} />
      </>)}
      <label style={lbl}>Tags (cách nhau bằng dấu phẩy)</label>
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="vd: SAP, quotation, finance" style={inp} />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd", background: "none", fontSize: 13, cursor: "pointer" }}>Hủy</button>
        <button onClick={handleSave} style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: "#185FA5", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Lưu</button>
      </div>
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [view, setView] = useState("ai");
  const [activeDept, setActiveDept] = useState(null);
  const [activeSubDept, setActiveSubDept] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ldp_kb_entries");
    setEntries(stored ? JSON.parse(stored) : SAMPLE_DATA);
  }, []);

  function save(data) { setEntries(data); localStorage.setItem("ldp_kb_entries", JSON.stringify(data)); }
  function handleLogin() {
    if (pwInput === ADMIN_PASSWORD) { setIsAdmin(true); setShowLogin(false); setPwError(""); setPwInput(""); }
    else setPwError("Sai mật khẩu!");
  }
  function handleSaveEntry(entry) {
    const updated = editEntry ? entries.map(e => e.id === entry.id ? entry : e) : [entry, ...entries];
    save(updated); setShowForm(false); setEditEntry(null);
  }
  function handleDelete(id) { if (window.confirm("Xóa mục này?")) save(entries.filter(e => e.id !== id)); }

// --- HANDLE SEARCH INTERACTION VIA VERCEL API & GOOGLE SDK ---
  const handleSearch = async () => {
    if (!searchQ.trim()) return;

    setAiLoading(true);
    setSearched(true);
    setAiAnswer("");

    try {
      // Gọi đến Serverless Function trên Vercel trung gian
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userPrompt: searchQ,
          knowledge: localStorage.getItem("ldp_kb_entries")
        }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Cập nhật câu trả lời từ SDK Google Gen AI vào State UI
      setAiAnswer(data.text);
    } catch (error) {
      console.error("Lỗi kết nối bộ lọc câu hỏi AI:", error);
      setAiAnswer("⚠️ Đã xảy ra lỗi khi kết nối với hệ thống AI Trí tuệ nhân tạo. Vui lòng thử lại sau.");
    } finally {
      setAiLoading(false);
    }
  };
  // --- END SEARCH HANDLE ---

  const deptCounts = DEPARTMENTS.reduce((acc, d) => { acc[d] = entries.filter(e => e.department === d).length; return acc; }, {});
  const deptEntries = activeDept ? entries.filter(e => e.department === activeDept) : [];

 return (
    <div style={{ minHeight: "100vh", background: "url('https://i.postimg.cc/9MsZw6gc/Image-(62).jpg') center/cover no-repeat fixed", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ background: "rgba(0,0,0,0.85)", borderBottom: "1px solid #444", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://i.pinimg.com/originals/a8/34/c0/a834c07428306ef30cf7d679abffba8b.jpg" alt="Milwaukee Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, margin: 0, color: "#fff" }}>Milwaukee LDP KB</p>
            <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>Leadership Development Program · {entries.length} tài liệu</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setView("ai")} style={{ fontSize: 13, fontWeight: view === "ai" ? 600 : 400, color: view === "ai" ? "#fff" : "#aaa", background: "none", border: "none", cursor: "pointer", padding: "4px 0", borderBottom: view === "ai" ? "2px solid #E31D21" : "2px solid transparent" }}>Tìm kiếm AI</button>
          <button onClick={() => { setView("docs"); setActiveDept(null); }} style={{ fontSize: 13, fontWeight: view === "docs" ? 600 : 400, color: view === "docs" ? "#fff" : "#aaa", background: "none", border: "none", cursor: "pointer", padding: "4px 0", borderBottom: view === "docs" ? "2px solid #E31D21" : "2px solid transparent" }}>Tài liệu tham khảo</button>
          {isAdmin ? (
            <>
              <button onClick={() => { setShowForm(true); setEditEntry(null); }} style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, border: "none", background: "#E31D21", color: "#fff", cursor: "pointer", fontWeight: 500 }}>+ Thêm mới</button>
              <button onClick={() => setIsAdmin(false)} style={{ fontSize: 13, padding: "7px 14px", borderRadius: 8, border: "1px solid #555", background: "none", cursor: "pointer", color: "#aaa" }}>Thoát Admin</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, border: "1px solid #555", background: "none", cursor: "pointer", color: "#aaa" }}>Admin</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        {showLogin && (
          <div style={{ background: "#2a2a2a", border: "1px solid #444", borderRadius: 12, padding: "1.5rem", marginBottom: 20, maxWidth: 400 }}>
            <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 14px", color: "#fff" }}>Đăng nhập Admin</p>
            <input type="password" value={pwInput} onChange={e => setPwInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Nhập mật khẩu..." style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid #555", boxSizing: "border-box", marginBottom: 8, background: "#333", color: "#fff" }} />
            {pwError && <p style={{ fontSize: 12, color: "#ff6b6b", margin: "0 0 8px" }}>{pwError}</p>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleLogin} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "#E31D21", color: "#fff", fontSize: 13, cursor: "pointer" }}>Đăng nhập</button>
              <button onClick={() => { setShowLogin(false); setPwError(""); }} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #555", background: "none", fontSize: 13, cursor: "pointer", color: "#aaa" }}>Hủy</button>
            </div>
          </div>
        )}

        {showForm && <AddEditForm entry={editEntry} onSave={handleSaveEntry} onCancel={() => { setShowForm(false); setEditEntry(null); }} />}

        {view === "ai" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
            <div>
              <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 12, border: "1px solid #444", padding: "1.5rem", marginBottom: 20 }}>
                <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 4px", color: "#fff" }}>Bạn cần biết gì về Milwaukee PT SHTP</p>
                <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 16px" }}>AI sẽ tìm kiếm và tổng hợp câu trả lời từ toàn bộ tài liệu của nhóm LDP</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Nhập câu hỏi của bạn..." style={{ flex: 1, fontSize: 14, padding: "10px 14px", borderRadius: 8, border: "1px solid #555", outline: "none", background: "#333", color: "#fff" }} />
                  <button onClick={handleSearch} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#E31D21", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Giúp tôi</button>
                </div>
              </div>
              {(aiLoading || aiAnswer) && (
                <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 12, padding: "1.5rem" }}>
                  <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 4px", color: "#E31D21" }}>Từ những gì chúng tôi có </p>
                  {aiLoading ? <p style={{ fontSize: 14, color: "#aaa", margin: 0 }}>Đang tìm kiếm...</p>
                    : <p style={{ fontSize: 14, color: "#eee", margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>{aiAnswer}</p>}
                </div>
              )}
              {!searched && (
                <div style={{ textAlign: "center", padding: "4rem 0", color: "#555" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
                  <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px", color: "#fff" }}>Đặt câu hỏi để bắt đầu</p>
                  <p style={{ fontSize: 13, margin: "0 0 4px", color: "#fff" }}>Ví dụ: "Nhà máy lên plan sản xuất như thế nào?" hoặc "KPI của Operations"</p>
                </div>
              )}
            </div>
            <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 12, padding: "1.5rem" }}>
              <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 14px", color: "#fff" }}>Tài liệu theo phòng ban</p>
              {DEPARTMENTS.map(d => {
                const c = DEPT_COLORS[d];
                return (
                  <div key={d} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #333" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{c.icon}</span>
                      <span style={{ fontSize: 13, color: "#fff" }}>{d}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: c.bg, color: c.text }}>{deptCounts[d]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "docs" && !activeDept && (
          <>
            <p style={{ fontSize: 14, color: "#aaa", margin: "0 0 16px" }}>Chọn phòng ban để xem tài liệu</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {DEPARTMENTS.map(dept => {
                const c = DEPT_COLORS[dept];
                return (
                  <button key={dept} onClick={() => setActiveDept(dept)}
                    style={{ background: "#2a2a2a", border: "1px solid #444", borderRadius: 12, padding: "1.25rem", textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#E31D21"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(227,29,33,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: "#fff" }}>{dept}</p>
                    <p style={{ fontSize: 12, margin: 0, color: "#aaa" }}>{deptCounts[dept]} tài liệu</p>
                      {SUB_DEPTS[dept] && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                          {SUB_DEPTS[dept].map(sub => (
                            <span key={sub} style={{ fontSize: 11, color: "#aaa" }}>↳ {sub}</span>
                          ))}
                        </div>
                      )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {view === "docs" && activeDept && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <button onClick={() => setActiveDept(null)} style={{ fontSize: 13, color: "#E31D21", background: "none", border: "none", padding: 0, cursor: "pointer" }}>← Tất cả phòng ban</button>
              <span style={{ color: "#555" }}>/</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{DEPT_COLORS[activeDept]?.icon} {activeDept}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {deptEntries.length === 0
                ? <p style={{ fontSize: 14, color: "#aaa", gridColumn: "1/-1", textAlign: "center", padding: "3rem 0" }}>Chưa có tài liệu nào</p>
                : deptEntries.map(e => <EntryCard key={e.id} entry={e} isAdmin={isAdmin} onEdit={entry => { setEditEntry(entry); setShowForm(true); }} onDelete={handleDelete} />)
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
