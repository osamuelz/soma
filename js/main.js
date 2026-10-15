/**
 * SOMA — Comportamento da Landing Page e Demonstração Interativa
 * Desenvolvido em JavaScript puro (ES6+), sem dependências externas.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "soma_demo_state_v1";
  const MAX_HABITS = 6;
  const MAX_NAME_LENGTH = 60;

  /**
   * Hábitos iniciais padrão da demonstração.
   */
  const DEFAULT_HABITS = [
    {
      id: "habit-agua",
      title: "Beber um copo de água",
      icon: "water",
      completed: false,
    },
    {
      id: "habit-leitura",
      title: "Ler por 10 minutos",
      icon: "book",
      completed: false,
    },
    {
      id: "habit-alongar",
      title: "Fazer uma pausa para se alongar",
      icon: "stretch",
      completed: false,
    },
  ];

  const CUSTOM_ICON_KEYS = ["leaf", "sun", "heart", "spark"];

  /**
   * Retorna a data local do navegador no formato YYYY-MM-DD.
   * Evita toISOString() para não virar o dia antes da meia-noite local (UTC).
   */
  function getLocalDateString(dateObj = new Date()) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Normaliza o nome de um hábito para comparação de duplicidade
   * (remove espaços extras, pontuação final redundante e ignora caixa).
   */
  function normalizeHabitName(name) {
    return String(name || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[.!?]+$/, "")
      .toLocaleLowerCase("pt-BR");
  }

  /**
   * Limpa o texto inserido mantendo espaços simples e respeitando texto puro.
   */
  function sanitizeHabitTitle(rawName) {
    return String(rawName || "")
      .trim()
      .replace(/\s+/g, " ");
  }

  /**
   * Valida se uma string representa uma data YYYY-MM-DD válida.
   */
  function isValidDateString(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  /**
   * Valida um objeto de hábito vindo do localStorage.
   */
  function isValidHabitItem(item) {
    if (!item || typeof item !== "object") return false;
    if (typeof item.id !== "string" || item.id.trim().length === 0) return false;
    if (typeof item.title !== "string") return false;
    const cleanTitle = sanitizeHabitTitle(item.title);
    if (cleanTitle.length === 0 || cleanTitle.length > MAX_NAME_LENGTH) return false;
    if (typeof item.completed !== "boolean") return false;
    return true;
  }

  /**
   * Clona a lista inicial de hábitos.
   */
  function getInitialHabits() {
    return DEFAULT_HABITS.map((habit) => ({ ...habit }));
  }


