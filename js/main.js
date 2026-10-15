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

  /**
   * Carrega e valida o estado salvo no localStorage.
   * Quando a data local muda, preserva os hábitos e reinicia as conclusões.
   */
  function loadStateFromStorage() {
    const today = getLocalDateString();

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          date: today,
          habits: getInitialHabits(),
        };
      }

      const parsed = JSON.parse(raw);
      if (
        !parsed ||
        typeof parsed !== "object" ||
        !isValidDateString(parsed.date) ||
        !Array.isArray(parsed.habits) ||
        parsed.habits.length > MAX_HABITS
      ) {
        return {
          date: today,
          habits: getInitialHabits(),
        };
      }

      // Valida cada item e garante ausência de nomes duplicados corrompidos
      const seenNames = new Set();
      const validHabits = [];

      for (const item of parsed.habits) {
        if (!isValidHabitItem(item)) {
          return {
            date: today,
            habits: getInitialHabits(),
          };
        }
        const cleanTitle = sanitizeHabitTitle(item.title);
        const normalized = normalizeHabitName(cleanTitle);
        if (seenNames.has(normalized)) {
          continue;
        }
        seenNames.add(normalized);
        validHabits.push({
          id: item.id,
          title: cleanTitle,
          icon: typeof item.icon === "string" ? item.icon : "leaf",
          completed: parsed.date === today ? Boolean(item.completed) : false,
        });
      }

      return {
        date: today,
        habits: validHabits,
      };
    } catch (_error) {
      // Fallback seguro em memória se localStorage estiver indisponível ou inválido
      return {
        date: today,
        habits: getInitialHabits(),
      };
    }
  }

  /**
   * Salva o estado atual no localStorage de maneira segura.
   */
  function saveStateToStorage(state) {
    try {
      const payload = JSON.stringify({
        date: state.date,
        habits: state.habits,
      });
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch (_error) {
      // Mantém funcionamento em memória caso o armazenamento falhe
    }
  }

  /**
   * Cria um elemento SVG para o ícone do hábito sem usar innerHTML com dados do usuário.
   */
  function createHabitIconSvg(iconKey) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const addPath = (d) => {
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    };

    switch (iconKey) {
      case "water":
        addPath("M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z");
        break;
      case "book":
        addPath("M4 19.5A2.5 2.5 0 0 1 6.5 17H20");
        addPath("M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z");
        break;
      case "stretch":
        {
          const circle = document.createElementNS(svgNS, "circle");
          circle.setAttribute("cx", "12");
          circle.setAttribute("cy", "5");
          circle.setAttribute("r", "2");
          svg.appendChild(circle);
          addPath("M7 10l5 2 5-2");
          addPath("M12 12v5");
          addPath("M9 21l3-4 3 4");
        }
        break;
      case "sun":
        {
          const circle = document.createElementNS(svgNS, "circle");
          circle.setAttribute("cx", "12");
          circle.setAttribute("cy", "12");
          circle.setAttribute("r", "4");
          svg.appendChild(circle);
          addPath("M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41");
        }
        break;
      case "heart":
        addPath("M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z");
        break;
      case "spark":
        addPath("M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z");
        break;
      case "leaf":
      default:
        addPath("M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z");
        addPath("M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12");
        break;
    }

    return svg;
  }

  /**
   * Cria o SVG de marcação do checkbox.
   */
  function createCheckmarkSvg() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "15");
    svg.setAttribute("height", "15");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "3");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const polyline = document.createElementNS(svgNS, "polyline");
    polyline.setAttribute("points", "20 6 9 17 4 12");
    svg.appendChild(polyline);
    return svg;
  }

  /**
   * Cria o SVG do botão de remover hábito.
   */
  function createTrashIconSvg() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const paths = [
      "M3 6h18",
      "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
      "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
      "M10 11v6",
      "M14 11v6",
    ];

    for (const d of paths) {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
    }

    return svg;
  }

  /**
   * Retorna a mensagem de incentivo apropriada para o progresso atual.
   */
  function getEncouragementMessage(completedCount, totalCount) {
    if (totalCount === 0 || completedCount === 0) {
      return "Comece pequeno. O primeiro passo já conta.";
    }
    if (completedCount === totalCount) {
      return "Você completou seus hábitos de hoje!";
    }
    return "Cada pequena ação está somando.";
  }

  /**
   * Inicializa a navegação responsiva e os botões de ação rápida.
   */
  function initNavigation(habitInput) {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    function closeMobileMenu() {
      if (!navToggle || !navMenu) return;
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu de navegação");
      navMenu.classList.remove("is-open");
    }

    function openMobileMenu() {
      if (!navToggle || !navMenu) return;
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Fechar menu de navegação");
      navMenu.classList.add("is-open");
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
        if (isExpanded) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      // Fecha o menu ao clicar em um link interno
      const navLinks = navMenu.querySelectorAll("a");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          closeMobileMenu();
        });
      });

      // Fecha com tecla Escape e devolve foco ao botão do menu
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
          closeMobileMenu();
          navToggle.focus();
        }
      });

      // Fecha ao clicar fora do cabeçalho
      document.addEventListener("click", (event) => {
        if (
          navMenu.classList.contains("is-open") &&
          !navMenu.contains(event.target) &&
          !navToggle.contains(event.target)
        ) {
          closeMobileMenu();
        }
      });
    }

    // Botões "Começar com um hábito" levam à demonstração e focam o campo de novo hábito
    const startButtons = document.querySelectorAll(".js-start-habit");
    const demoSection = document.getElementById("experimente");

    startButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        closeMobileMenu();
        if (demoSection) {
          demoSection.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
            block: "start",
          });
        }
        if (habitInput) {
          if (habitInput.disabled) {
            // Caso o limite de 6 hábitos já tenha sido atingido, foca o primeiro checkbox
            const firstCheckbox = document.querySelector(".habit-checkbox");
            if (firstCheckbox) {
              firstCheckbox.focus({ preventScroll: true });
            }
          } else {
            habitInput.focus({ preventScroll: true });
          }
        }
      });
    });
  }

  /**
   * Inicializa a demonstração interativa de acompanhamento de hábitos.
   */
  function initHabitDemo() {
    const habitListEl = document.getElementById("habit-list");
    const emptyStateEl = document.getElementById("empty-state");
    const counterEl = document.getElementById("demo-counter");
    const messageEl = document.getElementById("demo-message");
    const percentageEl = document.getElementById("demo-percentage");
    const progressBarEl = document.getElementById("demo-progressbar");
    const progressFillEl = document.getElementById("demo-progress-fill");
    const formEl = document.getElementById("habit-form");
    const inputEl = document.getElementById("habit-input");
    const submitBtnEl = document.getElementById("habit-submit-btn");
    const charCounterEl = document.getElementById("char-counter");
    const slotCounterEl = document.getElementById("habit-slot-counter");
    const feedbackEl = document.getElementById("habit-feedback");

    if (!habitListEl || !formEl || !inputEl) return;

    let state = loadStateFromStorage();
    saveStateToStorage(state);

    /**
     * Verifica se o dia local virou enquanto a página estava aberta.
     */
    function syncLocalDateIfNeeded() {
      const today = getLocalDateString();
      if (state.date !== today) {
        state.date = today;
        state.habits = state.habits.map((h) => ({ ...h, completed: false }));
        saveStateToStorage(state);
        return true;
      }
      return false;
    }

    /**
     * Exibe mensagem acessível de validação ou confirmação.
     */
    function setFeedback(text, type = "") {
      if (!feedbackEl) return;
      feedbackEl.textContent = text;
      feedbackEl.classList.remove("is-error", "is-success");
      if (type === "error") {
        feedbackEl.classList.add("is-error");
        inputEl.setAttribute("aria-invalid", "true");
      } else if (type === "success") {
        feedbackEl.classList.add("is-success");
        inputEl.removeAttribute("aria-invalid");
      } else {
        inputEl.removeAttribute("aria-invalid");
      }
    }

    /**
     * Atualiza o contador de caracteres do input.
     */
    function updateCharCounter() {
      if (!charCounterEl) return;
      const len = inputEl.value.length;
      charCounterEl.textContent = `${len}/${MAX_NAME_LENGTH}`;
    }

    /**
     * Atualiza os indicadores de progresso, contadores e estados do formulário.
     */
    function updateProgressSummary() {
      const total = state.habits.length;
      const completed = state.habits.filter((h) => h.completed).length;
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

      if (counterEl) {
        counterEl.textContent = `${completed} de ${total} hábitos concluídos`;
      }

      if (messageEl) {
        messageEl.textContent = getEncouragementMessage(completed, total);
      }

      if (percentageEl) {
        percentageEl.textContent = `${percentage}%`;
      }

      if (progressBarEl) {
        progressBarEl.setAttribute("aria-valuenow", String(percentage));
      }

      if (progressFillEl) {
        progressFillEl.style.width = `${percentage}%`;
      }

      if (slotCounterEl) {
        slotCounterEl.textContent = `${total} de ${MAX_HABITS} hábitos`;
      }

      if (emptyStateEl) {
        emptyStateEl.hidden = total > 0;
      }

      habitListEl.hidden = total === 0;

      const reachedLimit = total >= MAX_HABITS;
      if (submitBtnEl) {
        submitBtnEl.disabled = reachedLimit;
      }
    }

    /**
     * Constrói um item de hábito no DOM usando apenas textContent e createElement.
     */
    function createHabitElement(habit, index) {
      const li = document.createElement("li");
      li.className = "habit-item" + (habit.completed ? " is-completed" : "");
      li.dataset.habitId = habit.id;

      const label = document.createElement("label");
      label.className = "habit-label";
      const checkboxId = `checkbox-${habit.id}`;
      label.setAttribute("for", checkboxId);

      // Checkbox acessível
      const checkboxWrap = document.createElement("span");
      checkboxWrap.className = "habit-checkbox-wrap";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = checkboxId;
      checkbox.className = "habit-checkbox";
      checkbox.checked = Boolean(habit.completed);

      const checkboxVisual = document.createElement("span");
      checkboxVisual.className = "habit-checkbox-visual";
      checkboxVisual.appendChild(createCheckmarkSvg());

      checkboxWrap.appendChild(checkbox);
      checkboxWrap.appendChild(checkboxVisual);

      // Ícone do hábito
      const iconSpan = document.createElement("span");
      iconSpan.className = "habit-icon";
      iconSpan.appendChild(createHabitIconSvg(habit.icon));

      // Conteúdo textual (tratado estritamente como texto puro)
      const contentDiv = document.createElement("span");
      contentDiv.className = "habit-content";

      const titleSpan = document.createElement("span");
      titleSpan.className = "habit-title";
      titleSpan.textContent = habit.title;
      contentDiv.appendChild(titleSpan);

      if (habit.completed) {
        const badgeSpan = document.createElement("span");
        badgeSpan.className = "habit-state-badge";
        badgeSpan.textContent = "Concluído";
        contentDiv.appendChild(badgeSpan);
      }

      label.appendChild(checkboxWrap);
      label.appendChild(iconSpan);
      label.appendChild(contentDiv);

      // Botão de remover hábito
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "habit-remove-btn";
      removeBtn.setAttribute("aria-label", `Remover hábito: ${habit.title}`);
      removeBtn.setAttribute("title", "Remover hábito");
      removeBtn.appendChild(createTrashIconSvg());

      // Eventos
      checkbox.addEventListener("change", () => {
        syncLocalDateIfNeeded();
        const target = state.habits.find((h) => h.id === habit.id);
        if (!target) return;
        target.completed = checkbox.checked;
        saveStateToStorage(state);
        renderHabits();
        // Mantém o foco no checkbox correspondente após atualizar
        const updatedCheckbox = document.getElementById(checkboxId);
        if (updatedCheckbox) {
          updatedCheckbox.focus();
        }
      });

      removeBtn.addEventListener("click", () => {
        handleRemoveHabit(habit.id, index);
      });

      li.appendChild(label);
      li.appendChild(removeBtn);

      return li;
    }

    /**
     * Renderiza toda a lista de hábitos e atualiza o resumo de progresso.
     */
    function renderHabits() {
      habitListEl.textContent = "";
      state.habits.forEach((habit, index) => {
        habitListEl.appendChild(createHabitElement(habit, index));
      });
      updateProgressSummary();
    }

    /**
     * Remove um hábito pelo ID e encaminha o foco para um elemento coerente.
     */
    function handleRemoveHabit(habitId, removedIndex) {
      syncLocalDateIfNeeded();
      const targetHabit = state.habits.find((h) => h.id === habitId);
      if (!targetHabit) return;

      const removedTitle = targetHabit.title;
      state.habits = state.habits.filter((h) => h.id !== habitId);
      saveStateToStorage(state);
      renderHabits();

      setFeedback(`Hábito "${removedTitle}" removido.`, "success");

      // Encaminha o foco para o próximo botão de remoção, ou anterior, ou campo de novo hábito
      const removeButtons = habitListEl.querySelectorAll(".habit-remove-btn");
      if (removeButtons.length > 0) {
        const nextFocusIndex = Math.min(removedIndex, removeButtons.length - 1);
        removeButtons[nextFocusIndex].focus();
      } else {
        inputEl.focus();
      }
    }

    /**
     * Trata a adição de um novo hábito com validações completas.
     */
    function handleAddHabit(event) {
      event.preventDefault();
      syncLocalDateIfNeeded();

      if (state.habits.length >= MAX_HABITS) {
        setFeedback(
          `Limite de ${MAX_HABITS} hábitos atingido. Remova um hábito para adicionar outro.`,
          "error"
        );
        return;
      }

      const rawValue = inputEl.value;
      const cleanTitle = sanitizeHabitTitle(rawValue);

      if (cleanTitle.length === 0) {
        setFeedback("Digite um nome para o hábito antes de adicionar.", "error");
        inputEl.focus();
        return;
      }

      if (cleanTitle.length > MAX_NAME_LENGTH) {
        setFeedback(
          `O nome do hábito deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
          "error"
        );
        inputEl.focus();
        return;
      }

      const normalizedCandidate = normalizeHabitName(cleanTitle);
      const isDuplicate = state.habits.some(
        (h) => normalizeHabitName(h.title) === normalizedCandidate
      );

      if (isDuplicate) {
        setFeedback("Esse hábito já está na sua lista de hoje.", "error");
        inputEl.focus();
        return;
      }

      const iconKey =
        CUSTOM_ICON_KEYS[state.habits.length % CUSTOM_ICON_KEYS.length];
      const newHabit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: cleanTitle,
        icon: iconKey,
        completed: false,
      };

      state.habits.push(newHabit);
      saveStateToStorage(state);

      inputEl.value = "";
      updateCharCounter();
      renderHabits();
      setFeedback(`Hábito "${cleanTitle}" adicionado à sua rotina.`, "success");
      inputEl.focus();
    }

    inputEl.addEventListener("input", () => {
      updateCharCounter();
      if (inputEl.getAttribute("aria-invalid") === "true") {
        setFeedback("");
      }
    });

    formEl.addEventListener("submit", handleAddHabit);

    // Verifica mudança de dia quando a aba volta a ficar visível
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && syncLocalDateIfNeeded()) {
        renderHabits();
      }
    });

    updateCharCounter();
    renderHabits();
    initNavigation(inputEl);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHabitDemo);
  } else {
    initHabitDemo();
  }
})();
