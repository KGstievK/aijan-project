"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation, useRegisterMutation } from "@/redux/api/auth";

// Схемы валидации
const citizenRegisterSchema = z.object({
  lastName: z
    .string()
    .min(3, "Фамилия должно быть не менее 3 символов")
    .max(50, "Фамилия должно быть не более 50 символов"),
  firstName: z
    .string()
    .min(3, "Имя должно быть не менее 3 символов")
    .max(50, "Имя должно быть не более 50 символов"),
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Введите корректный email адрес")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email должен содержать @ и домен"),
  password: z
    .string()
    .min(6, "Пароль должен быть не менее 6 символов")
    .max(30, "Пароль должен быть не более 30 символов"),
});

const citizenLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Введите корректный email адрес")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email должен содержать @ и домен"),
  password: z.string().min(1, "Введите пароль"),
});

const adminSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Введите корректный email адрес")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email должен содержать @ и домен"),
  password: z.string().min(1, "Введите пароль"),
});

// Типы для форм
type CitizenRegisterData = z.infer<typeof citizenRegisterSchema>;
type CitizenLoginData = z.infer<typeof citizenLoginSchema>;
type AdminData = z.infer<typeof adminSchema>;

export const AuthForm = () => {
  const [activeTab, setActiveTab] = useState<"citizen" | "admin">("citizen");
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  // Формы для граждан
  const {
    register: citizenRegRegister,
    handleSubmit: citizenRegHandleSubmit,
    formState: { errors: citizenRegErrors },
    reset: citizenRegReset,
  } = useForm<CitizenRegisterData>({
    resolver: zodResolver(citizenRegisterSchema),
  });

  const {
    register: citizenLoginRegister,
    handleSubmit: citizenLoginHandleSubmit,
    formState: { errors: citizenLoginErrors },
  } = useForm<CitizenLoginData>({
    resolver: zodResolver(citizenLoginSchema),
  });

  // Форма для админа
  const {
    register: adminRegister,
    handleSubmit: adminHandleSubmit,
    formState: { errors: adminErrors },
  } = useForm<AdminData>({
    resolver: zodResolver(adminSchema),
  });

  // Обработчик регистрации гражданина
  const handleCitizenRegister = async (data: CitizenRegisterData) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const response = await register({
        email: data.email,
        password: data.password,
        lastName: data.lastName,
        firstName: data.firstName,
      }).unwrap();

      console.log("Регистрация успешна:", response);
      localStorage.setItem("accessToken", response.accessToken);
      window.location.href = "/citizen";
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);
      if (error.status === 400) {
        setAuthError("Пользователь с таким email уже существует");
      } else {
        setAuthError("Произошла ошибка при регистрации");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик входа гражданина
  const handleCitizenLogin = async (data: CitizenLoginData) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      console.log("Вход успешен:", response);
      localStorage.setItem("accessToken", response.accessToken);
      window.location.href = "/citizen";
    } catch (error: any) {
      console.error("Ошибка входа админа:", error);
      if (error.status === 401) {
        if (error.data?.error === "Неверные учетные данные") {
          setAuthError(
            "Неверный email или пароль. Проверьте введенные данные."
          );
        } else {
          setAuthError("Ошибка аутентификации. Попробуйте позже.");
        }
      } else {
        setAuthError(
          `Произошла ошибка: ${error.message || "Неизвестная ошибка"}`
        );
      }
    }
  };

  // Обработчик входа админа
  const handleAdminLogin = async (data: AdminData) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      console.log("Вход админа успешен:", response);
      localStorage.setItem("accessToken", response.accessToken);
      window.location.href = "/admin";
    } catch (error: any) {
      console.error("Ошибка входа админа:", error);
      if (error.status === 401) {
        if (error.data?.error === "Неверные учетные данные") {
          setAuthError(
            "Неверный email или пароль. Проверьте введенные данные."
          );
        } else {
          setAuthError("Ошибка аутентификации. Попробуйте позже.");
        }
      } else {
        setAuthError(
          `Произошла ошибка: ${error.message || "Неизвестная ошибка"}`
        );
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 text-black ${
            activeTab === "citizen" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setActiveTab("citizen");
            setAuthError(null);
          }}
        >
          Для граждан
        </button>
        <button
          className={`px-4 py-2 text-black ${
            activeTab === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setActiveTab("admin");
            setAuthError(null);
          }}
        >
          Для админа
        </button>
      </div>

      {authError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {authError}
        </div>
      )}

      {activeTab === "citizen" ? (
        isRegister ? (
          // Форма регистрации гражданина
          <form
            onSubmit={citizenRegHandleSubmit(handleCitizenRegister)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-2 text-black">Фамилия</label>
              <input
                {...citizenRegRegister("lastName")}
                className={`w-full p-2 border rounded text-black ${
                  citizenRegErrors.lastName ? "border-red-500" : ""
                }`}
              />
              {citizenRegErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {citizenRegErrors.lastName.message}
                </p>
              )}
              <label className="block mb-2 text-black mt-3">Имя</label>
              <input
                {...citizenRegRegister("firstName")}
                className={`w-full p-2 border rounded text-black ${
                  citizenRegErrors.firstName ? "border-red-500" : ""
                }`}
              />
              {citizenRegErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {citizenRegErrors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-black">Email</label>
              <input
                type="email"
                {...citizenRegRegister("email")}
                className={`w-full p-2 border rounded text-black ${
                  citizenRegErrors.email ? "border-red-500" : ""
                }`}
                placeholder="example@domain.com"
              />
              {citizenRegErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {citizenRegErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-black">Пароль</label>
              <input
                type="password"
                {...citizenRegRegister("password")}
                className={`w-full p-2 border rounded text-black ${
                  citizenRegErrors.password ? "border-red-500" : ""
                }`}
              />
              {citizenRegErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {citizenRegErrors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-blue-500 text-sm"
                onClick={() => {
                  setIsRegister(false);
                  setAuthError(null);
                }}
              >
                Уже есть аккаунт? Войти
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white p-2 rounded ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>
        ) : (
          // Форма входа гражданина
          <form
            onSubmit={citizenLoginHandleSubmit(handleCitizenLogin)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-2 text-black">Email</label>
              <input
                type="email"
                {...citizenLoginRegister("email")}
                className={`w-full p-2 border rounded text-black ${
                  citizenLoginErrors.email ? "border-red-500" : ""
                }`}
                placeholder="example@domain.com"
              />
              {citizenLoginErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {citizenLoginErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-black">Пароль</label>
              <input
                type="password"
                {...citizenLoginRegister("password")}
                className={`w-full p-2 border rounded text-black ${
                  citizenLoginErrors.password ? "border-red-500" : ""
                }`}
              />
              {citizenLoginErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {citizenLoginErrors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-blue-500 text-sm"
                onClick={() => {
                  setIsRegister(true);
                  setAuthError(null);
                }}
              >
                Нет аккаунта? Зарегистрироваться
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white p-2 rounded ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>
        )
      ) : (
        // Форма входа админа
        <form
          onSubmit={adminHandleSubmit(handleAdminLogin)}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 text-black">Email</label>
            <input
              type="email"
              {...adminRegister("email")}
              className={`w-full p-2 border rounded text-black ${
                adminErrors.email ? "border-red-500" : ""
              }`}
              placeholder="admin@example.com"
            />
            {adminErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {adminErrors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-black">Пароль</label>
            <input
              type="password"
              {...adminRegister("password")}
              className={`w-full p-2 border rounded text-black ${
                adminErrors.password ? "border-red-500" : ""
              }`}
            />
            {adminErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {adminErrors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white p-2 rounded ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      )}
    </div>
  );
};
