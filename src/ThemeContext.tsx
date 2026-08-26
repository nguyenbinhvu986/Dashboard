import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// Bước 2: Tạo Trạm phát (Provider) để bọc bên ngoài ứng dụng
export function ThemeProvider({ children }: any) {
  // Biến lưu trạng thái sáng/tối
  const [theme, setTheme] = useState("light");

  // Hàm đảo ngược trạng thái
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Tự động nhúng chữ "light" hoặc "dark" vào thẻ <body> của HTML
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Phát biến 'theme' và hàm 'toggleTheme' xuống cho các component con
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
