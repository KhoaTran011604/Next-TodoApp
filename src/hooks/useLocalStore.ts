import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { UserTokenPayload } from "types/MainType";
function useLocalStore(key, initialValue) {
  // Lấy giá trị từ localStorage hoặc dùng giá trị mặc định
  const [value, setValue] = useState(() => {
    return getItemLocalStore(key, initialValue);
  });

  // Cập nhật localStorage khi giá trị thay đổi
  useEffect(() => {
    setItemLocalStore(key, value);
  }, [key, value]);

  return [value, setValue];
}

// Phương thức lấy dữ liệu từ localStorage
export function getItemLocalStore(key, defaultValue = null) {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
}

// Phương thức lưu dữ liệu vào localStorage
export function setItemLocalStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDataFromToken(token) {


  try {
    const decoded = jwtDecode(token);
    return decoded as UserTokenPayload; // Giả sử backend lưu email hoặc username trong token
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export default useLocalStore;