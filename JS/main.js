// ============================================================
// MAIN.JS - All functionality for Job Me website (unified)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // 1. SHARED UTILITIES (Toast, Scroll, Menu, etc.)
  // ==========================================================

  // ---- Toast system ----
  window.showToast = function (message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "fa-circle-check" : "fa-circle-xmark";
    toast.innerHTML = `<i class="fa-regular ${icon}" aria-hidden="true"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // ---- Mobile menu toggle ----
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const menuIcon = menuToggle?.querySelector("i");

  if (menuToggle && navLinks && menuIcon) {
    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle("open");
      menuIcon.className = isOpen ? "fas fa-xmark" : "fas fa-bars";
      menuToggle.setAttribute("aria-expanded", isOpen);
    };
    menuToggle.addEventListener("click", toggleMenu);

    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuIcon.className = "fas fa-bars";
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Header scroll effect ----
  const header = document.querySelector(".main-header");
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    },
    { passive: true },
  );

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ---- Ratings dots interaction ----
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      dots.forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
    });
  });

  // ==========================================================
  // 2. REGISTER PAGE LOGIC (only if form exists)
  // ==========================================================

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    // Toggle password
    const toggleBtn = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("comp-password");
    if (toggleBtn && passwordInput) {
      toggleBtn.addEventListener("click", () => {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        const icon = toggleBtn.querySelector("i");
        icon.className = isPassword
          ? "fa-regular fa-eye-slash"
          : "fa-regular fa-eye";
      });
    }

    // Validation helpers
    const getErrorSpan = (fieldId) =>
      document.getElementById(fieldId + "-error");

    const validateField = (field) => {
      const errorSpan = getErrorSpan(field.id);
      if (!errorSpan) return true;

      if (field.hasAttribute("required") && !field.value.trim()) {
        field.classList.add("error");
        errorSpan.style.display = "block";
        return false;
      }
      if (field.type === "email" && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          field.classList.add("error");
          errorSpan.style.display = "block";
          return false;
        }
      }
      if (
        field.id === "comp-password" &&
        field.value.length > 0 &&
        field.value.length < 8
      ) {
        field.classList.add("error");
        errorSpan.style.display = "block";
        return false;
      }
      field.classList.remove("error");
      errorSpan.style.display = "none";
      return true;
    };

    // Real-time validation
    const inputs = registerForm.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("error")) validateField(input);
      });
      input.addEventListener("change", () => {
        if (input.classList.contains("error")) validateField(input);
      });
    });

    // Submit
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;
      registerForm.querySelectorAll("[required]").forEach((field) => {
        if (!validateField(field)) isValid = false;
      });

      const termsCheck = document.getElementById("terms");
      const termsError = document.getElementById("terms-error");
      if (!termsCheck.checked) {
        termsCheck.classList.add("error");
        termsError.style.display = "block";
        isValid = false;
      } else {
        termsCheck.classList.remove("error");
        termsError.style.display = "none";
      }

      if (!isValid) {
        window.showToast("Please fix all errors before submitting.", "error");
        return;
      }

      window.showToast(
        "Account created successfully! Redirecting...",
        "success",
      );
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  }

  // ==========================================================
  // 3. CONTACT PAGE LOGIC (only if form exists)
  // ==========================================================

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = contactForm.querySelectorAll("input, textarea");
      let isValid = true;
      inputs.forEach((input) => {
        if (input.hasAttribute("required") && !input.value.trim()) {
          input.style.borderColor = "#e53e3e";
          isValid = false;
        } else {
          input.style.borderColor = "";
        }
      });

      if (!isValid) {
        window.showToast("Please fill in all required fields.", "error");
        return;
      }

      const btn = contactForm.querySelector(".btn-send");
      const originalText = btn.innerHTML;
      btn.innerHTML =
        '<i class="fa-regular fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        window.showToast("Your message has been sent successfully!", "success");
        contactForm.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 1500);
    });

    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("focus", () => {
        input.style.borderColor = "";
      });
    });
  }
}); // end DOMContentLoaded
// ==========================================================
// 4. SIGN IN PAGE LOGIC (only if form exists)
// ==========================================================

const signinForm = document.getElementById("signinForm");
if (signinForm) {
  // Toggle password
  const toggleBtn = signinForm.querySelector(".toggle-password");
  const passwordInput = signinForm.querySelector("#signin-password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      const icon = toggleBtn.querySelector("i");
      icon.className = isPassword
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye";
    });
  }

  // Validation helpers (reuse from register but simplified)
  const validateField = (field) => {
    const errorSpan = document.getElementById(field.id + "-error");
    if (!errorSpan) return true;

    if (field.hasAttribute("required") && !field.value.trim()) {
      field.classList.add("error");
      errorSpan.textContent = "This field is required.";
      errorSpan.style.display = "block";
      return false;
    }
    if (field.type === "email" && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        field.classList.add("error");
        errorSpan.textContent = "Please enter a valid email address.";
        errorSpan.style.display = "block";
        return false;
      }
    }
    field.classList.remove("error");
    errorSpan.style.display = "none";
    return true;
  };

  // Real-time validation
  const inputs = signinForm.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("error")) validateField(input);
    });
  });

  // Submit
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    signinForm.querySelectorAll("[required]").forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      window.showToast("Please fix all errors before submitting.", "error");
      return;
    }

    // Simulate sign-in
    const btn = signinForm.querySelector(".btn-signin-submit");
    const originalText = btn.innerHTML;
    btn.innerHTML =
      '<i class="fa-regular fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;

    setTimeout(() => {
      window.showToast("Welcome back! Redirecting to dashboard...", "success");
      // Redirect to index or dashboard
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1200);
  });
}
// ============================================================
// 5. CV BUILDER LOGIC (Live Preview, Stepper, Auto-Save)
// ============================================================

const cvForm = document.getElementById("cvForm");
if (cvForm) {
  // --- LocalStorage Auto-Save ---
  const SAVE_KEY = "cv_builder_data";
  const saveStatus = document.getElementById("saveStatus");
  let saveTimeout = null;

  const saveToLocalStorage = () => {
    const data = {};
    const inputs = cvForm.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      if (input.id) data[input.id] = input.value;
    });

    // Experience
    const expItems = document.querySelectorAll(".experience-item");
    data.experience = [];
    expItems.forEach((item) => {
      const fields = item.querySelectorAll("input");
      data.experience.push({
        company: fields[0]?.value || "",
        role: fields[1]?.value || "",
        start: fields[2]?.value || "",
        end: fields[3]?.value || "",
      });
    });

    // Education
    const eduItems = document.querySelectorAll(".education-item");
    data.education = [];
    eduItems.forEach((item) => {
      const fields = item.querySelectorAll("input");
      data.education.push({
        school: fields[0]?.value || "",
        degree: fields[1]?.value || "",
        year: fields[2]?.value || "",
      });
    });

    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    if (saveStatus) {
      saveStatus.textContent = "Saved ✓";
      saveStatus.classList.add("saved");
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveStatus.textContent = "Auto Saving...";
        saveStatus.classList.remove("saved");
      }, 2000);
    }
  };

  // Auto-save on input
  cvForm.addEventListener("input", () => {
    saveToLocalStorage();
  });

  // --- Stepper Wizard ---
  const steps = document.querySelectorAll(".cv-stepper .step");
  const stepContents = document.querySelectorAll(".form-step-content");
  const btnNext = document.querySelector(".btn-wizard-next");
  const btnPrev = document.querySelector(".btn-wizard-prev");
  let currentStep = 1;

  const updateWizard = () => {
    stepContents.forEach((content) => content.classList.remove("active"));
    steps.forEach((st) => st.classList.remove("active"));

    const activeContent = document.querySelector(
      `[data-step-content="${currentStep}"]`,
    );
    if (activeContent) activeContent.classList.add("active");

    const activeStep = document.querySelector(
      `.cv-stepper [data-step="${currentStep}"]`,
    );
    if (activeStep) activeStep.classList.add("active");

    // Buttons
    if (btnPrev) btnPrev.disabled = currentStep === 1;
    if (btnNext) {
      if (currentStep === 4) {
        btnNext.innerHTML =
          '<i class="fa-solid fa-check" aria-hidden="true"></i> Finish & Review';
      } else {
        btnNext.innerHTML =
          'Next Step <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
      }
    }

    // Mark completed steps
    steps.forEach((st) => {
      const stepNum = parseInt(st.getAttribute("data-step"));
      st.classList.toggle("completed", stepNum < currentStep);
    });
  };

  if (btnNext && btnPrev) {
    btnNext.addEventListener("click", () => {
      if (currentStep < 4) {
        currentStep++;
        updateWizard();
        // Scroll to top of form panel on mobile
        const formPanel = document.querySelector(".form-panel");
        if (formPanel && window.innerWidth <= 768) {
          formPanel.scrollTop = 0;
        }
      } else {
        if (typeof window.showToast === "function") {
          window.showToast(
            "Your CV is ready! You can download it as PDF.",
            "success",
          );
        }
      }
    });

    btnPrev.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizard();
      }
    });
  }

  // Click on step to navigate
  steps.forEach((step) => {
    step.addEventListener("click", () => {
      const target = parseInt(step.getAttribute("data-step"));
      if (target >= 1 && target <= 4) {
        currentStep = target;
        updateWizard();
      }
    });
  });

  // --- Live Preview (Personal Info) ---
  const inputsMap = {
    "cv-fullname": { viewId: "view-fullname", defaultText: "Your Full Name" },
    "cv-title": { viewId: "view-title", defaultText: "Professional Title" },
    "cv-email": {
      viewId: "view-email",
      boxId: "view-email-box",
      defaultText: "",
    },
    "cv-phone": {
      viewId: "view-phone",
      boxId: "view-phone-box",
      defaultText: "",
    },
    "cv-location": {
      viewId: "view-location",
      boxId: "view-location-box",
      defaultText: "",
    },
    "cv-linkedin": {
      viewId: "view-linkedin",
      boxId: "view-linkedin-box",
      defaultText: "",
    },
    "cv-summary": {
      viewId: "view-summary",
      defaultText: "Your profile summary will appear here...",
    },
  };

  Object.keys(inputsMap).forEach((inputId) => {
    const inputEl = document.getElementById(inputId);
    if (inputEl) {
      inputEl.addEventListener("input", () => {
        const config = inputsMap[inputId];
        const viewEl = document.getElementById(config.viewId);
        const boxEl = config.boxId
          ? document.getElementById(config.boxId)
          : null;
        const val = inputEl.value.trim();

        if (val) {
          viewEl.innerText = val;
          if (boxEl) boxEl.style.display = "inline-flex";
          if (inputId === "cv-summary") viewEl.innerText = val;
        } else {
          viewEl.innerText = config.defaultText;
          if (boxEl && inputId !== "cv-summary") boxEl.style.display = "none";
        }
      });
    }
  });

  // --- Skills & Languages as Tags ---
  const bindTags = (inputId, containerId, sectionId) => {
    const inputEl = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    const section = document.getElementById(sectionId);
    if (inputEl && container && section) {
      inputEl.addEventListener("input", () => {
        const values = inputEl.value
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v !== "");
        container.innerHTML = "";
        if (values.length > 0) {
          section.style.display = "flex";
          values.forEach((val) => {
            const tag = document.createElement("span");
            tag.className = "cv-skill-tag";
            tag.textContent = val;
            container.appendChild(tag);
          });
        } else {
          section.style.display = "none";
        }
      });
    }
  };
  bindTags("cv-skills-input", "view-skills-list", "view-skills-section");
  bindTags(
    "cv-languages-input",
    "view-languages-list",
    "view-languages-section",
  );

  // --- Dynamic Experience & Education ---
  const expContainer = document.getElementById("experienceItemsContainer");
  const eduContainer = document.getElementById("educationItemsContainer");

  const createItemCard = (type, data = {}) => {
    const wrapper = document.createElement("div");
    wrapper.className = `dynamic-item-card ${type}-item`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete-item";
    deleteBtn.innerHTML =
      '<i class="fa-regular fa-trash-can" aria-hidden="true"></i>';
    deleteBtn.setAttribute("aria-label", "Delete item");
    deleteBtn.addEventListener("click", () => {
      wrapper.remove();
      saveToLocalStorage();
      updatePreviewExperience();
      updatePreviewEducation();
    });

    wrapper.appendChild(deleteBtn);

    if (type === "experience") {
      wrapper.innerHTML += `
        <div class="form-row">
          <div class="input-group">
            <label>Company Name *</label>
            <input type="text" class="exp-company" placeholder="Google" value="${data.company || ""}" />
          </div>
          <div class="input-group">
            <label>Role / Title *</label>
            <input type="text" class="exp-role" placeholder="Senior Developer" value="${data.role || ""}" />
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Start Date</label>
            <input type="text" class="exp-start" placeholder="Jan 2020" value="${data.start || ""}" />
          </div>
          <div class="input-group">
            <label>End Date</label>
            <input type="text" class="exp-end" placeholder="Present" value="${data.end || ""}" />
          </div>
        </div>
      `;
      wrapper.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", () => {
          updatePreviewExperience();
          saveToLocalStorage();
        });
      });
      if (expContainer) expContainer.appendChild(wrapper);
    } else if (type === "education") {
      wrapper.innerHTML += `
        <div class="form-row">
          <div class="input-group">
            <label>Institution *</label>
            <input type="text" class="edu-school" placeholder="Harvard University" value="${data.school || ""}" />
          </div>
          <div class="input-group">
            <label>Degree *</label>
            <input type="text" class="edu-degree" placeholder="B.Sc. Computer Science" value="${data.degree || ""}" />
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Year of Graduation</label>
            <input type="text" class="edu-year" placeholder="2022" value="${data.year || ""}" />
          </div>
        </div>
      `;
      wrapper.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", () => {
          updatePreviewEducation();
          saveToLocalStorage();
        });
      });
      if (eduContainer) eduContainer.appendChild(wrapper);
    }
    return wrapper;
  };

  const updatePreviewExperience = () => {
    const list = document.getElementById("view-experience-list");
    const section = document.getElementById("view-experience-section");
    if (!list || !section) return;
    const items = document.querySelectorAll(".experience-item");
    list.innerHTML = "";
    if (items.length === 0) {
      section.style.display = "none";
      return;
    }
    section.style.display = "flex";
    items.forEach((item) => {
      const company = item.querySelector(".exp-company")?.value || "Company";
      const role = item.querySelector(".exp-role")?.value || "Role";
      const start = item.querySelector(".exp-start")?.value || "";
      const end = item.querySelector(".exp-end")?.value || "";
      const div = document.createElement("div");
      div.className = "preview-item";
      div.innerHTML = `
        <div class="preview-item-row">
          <span class="preview-item-title">${role}</span>
          <span class="preview-item-date">${start} - ${end}</span>
        </div>
        <div class="preview-item-subtitle">${company}</div>
      `;
      list.appendChild(div);
    });
  };

  const updatePreviewEducation = () => {
    const list = document.getElementById("view-education-list");
    const section = document.getElementById("view-education-section");
    if (!list || !section) return;
    const items = document.querySelectorAll(".education-item");
    list.innerHTML = "";
    if (items.length === 0) {
      section.style.display = "none";
      return;
    }
    section.style.display = "flex";
    items.forEach((item) => {
      const school = item.querySelector(".edu-school")?.value || "Institution";
      const degree = item.querySelector(".edu-degree")?.value || "Degree";
      const year = item.querySelector(".edu-year")?.value || "";
      const div = document.createElement("div");
      div.className = "preview-item";
      div.innerHTML = `
        <div class="preview-item-row">
          <span class="preview-item-title">${degree}</span>
          <span class="preview-item-date">${year}</span>
        </div>
        <div class="preview-item-subtitle">${school}</div>
      `;
      list.appendChild(div);
    });
  };

  // --- Add Buttons ---
  document.getElementById("addExperienceBtn")?.addEventListener("click", () => {
    createItemCard("experience");
    updatePreviewExperience();
    saveToLocalStorage();
  });

  document.getElementById("addEducationBtn")?.addEventListener("click", () => {
    createItemCard("education");
    updatePreviewEducation();
    saveToLocalStorage();
  });

  // --- Load saved data from localStorage ---
  const loadSavedData = () => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      // Simple fields
      Object.keys(data).forEach((key) => {
        const el = document.getElementById(key);
        if (
          el &&
          (el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT")
        ) {
          el.value = data[key];
          el.dispatchEvent(new Event("input"));
        }
      });
      // Experience
      if (data.experience && data.experience.length > 0) {
        data.experience.forEach((exp) => createItemCard("experience", exp));
        updatePreviewExperience();
      }
      // Education
      if (data.education && data.education.length > 0) {
        data.education.forEach((edu) => createItemCard("education", edu));
        updatePreviewEducation();
      }
    } catch (e) {
      // Ignore parse errors
    }
  };
  loadSavedData();

  // --- Mobile Preview Toggle ---
  const toggleBtn = document.querySelector(".btn-preview-toggle");
  const previewPanel = document.querySelector(".preview-panel");
  if (toggleBtn && previewPanel) {
    toggleBtn.addEventListener("click", () => {
      previewPanel.classList.toggle("show-mobile");
      toggleBtn.classList.toggle("btn-filled");
      // Update icon
      const icon = toggleBtn.querySelector("i");
      if (previewPanel.classList.contains("show-mobile")) {
        icon.className = "fa-solid fa-eye-slash";
      } else {
        icon.className = "fa-solid fa-eye";
      }
    });
  }

  // --- Download PDF (simulated) ---
  // --- Download PDF (Actual Professional Feature) ---
  document.getElementById("downloadCvBtn")?.addEventListener("click", () => {
    // إظهار تنبيه سريع للمستخدم قبل فتح نافذة الحفظ
    if (typeof window.showToast === "function") {
      window.showToast("Preparing your PDF document...", "success");
    }

    // تأخير بسيط جداً ليعطي فرصة للتنبيه ثم فتح نافذة الطباعة/الحفظ للمتصفح
    setTimeout(() => {
      window.print();
    }, 500);
  });
  // --- Initial preview update for existing data ---
  setTimeout(() => {
    updatePreviewExperience();
    updatePreviewEducation();
  }, 100);
}

// ============================================================
// 6. SEND CV PAGE LOGIC
// ============================================================

const sendCvForm = document.getElementById("sendCvForm");
if (sendCvForm) {
  // --- Source toggle (Live vs Upload) ---
  const sourceLive = document.getElementById("source-live");
  const sourceUpload = document.getElementById("source-upload");
  const uploadZone = document.getElementById("uploadZone");
  const sourceCards = document.querySelectorAll(".source-card");

  const toggleSource = () => {
    sourceCards.forEach((c) => c.classList.remove("active"));
    if (sourceLive.checked) {
      sourceLive.closest(".source-card")?.classList.add("active");
      if (uploadZone) uploadZone.style.display = "none";
    } else if (sourceUpload.checked) {
      sourceUpload.closest(".source-card")?.classList.add("active");
      if (uploadZone) uploadZone.style.display = "flex";
    }
  };

  if (sourceLive && sourceUpload) {
    sourceLive.addEventListener("change", toggleSource);
    sourceUpload.addEventListener("change", toggleSource);

    // Update live CV status from localStorage
    const savedData = localStorage.getItem("cv_builder_data");
    const statusText = document.getElementById("live-cv-status");
    if (savedData && statusText) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed["cv-fullname"]) {
          statusText.textContent = `Ready: ${parsed["cv-fullname"]}'s built CV`;
        }
      } catch (e) {
        // ignore
      }
    }
  }

  // --- File upload handling ---
  const fileInput = document.getElementById("fileInput");
  const attachedFileBadge = document.getElementById("attachedFileBadge");
  const fileNameSpan = document.getElementById("fileNameSpan");
  const btnRemoveFile = document.getElementById("btnRemoveFile");

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowedTypes = [".pdf", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      window.showToast?.(
        "Invalid format. Only PDF and DOCX are supported.",
        "error",
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.showToast?.("File is too large. Maximum size is 5MB.", "error");
      return;
    }
    if (fileNameSpan && attachedFileBadge) {
      fileNameSpan.textContent = file.name;
      attachedFileBadge.style.display = "inline-flex";
    }
  };

  if (uploadZone && fileInput) {
    uploadZone.addEventListener("click", (e) => {
      if (!btnRemoveFile?.contains(e.target)) {
        fileInput.click();
      }
    });

    uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadZone.classList.add("dragover");
    });

    uploadZone.addEventListener("dragleave", () => {
      uploadZone.classList.remove("dragover");
    });

    uploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadZone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        handleFileSelect(fileInput.files[0]);
      }
    });
  }

  if (btnRemoveFile && attachedFileBadge && fileInput) {
    btnRemoveFile.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.value = "";
      attachedFileBadge.style.display = "none";
    });
  }

  // --- Cover letter templates ---
  const coverLetterTextarea = document.getElementById("cover-letter");
  const tplButtons = document.querySelectorAll(".btn-tpl");

  const letterTemplates = {
    formal: `Dear Hiring Team,

I am writing to express my strong interest in the target role at your company. With a solid background in executing industry standard practices, I am confident in my ability to deliver substantial value to your goals.

Thank you for considering my application.

Best regards,`,
    tech: `Hello Team,

I am excited to apply for this technical position. I possess strong skills in building efficient, robust solutions and following clean architecture. I look forward to bringing my engineering expertise and hands-on problem-solving drive to your team.

Cheers,`,
    clear: "",
  };

  if (coverLetterTextarea && tplButtons.length) {
    tplButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-tpl");
        if (letterTemplates[type] !== undefined) {
          coverLetterTextarea.value = letterTemplates[type];
          coverLetterTextarea.dispatchEvent(new Event("input"));
        }
      });
    });
  }

  // --- Form validation helpers ---
  const getErrorSpan = (fieldId) => document.getElementById(fieldId + "-error");

  const validateSendField = (field) => {
    const errorSpan = getErrorSpan(field.id);
    if (!errorSpan) return true;
    if (field.hasAttribute("required") && !field.value.trim()) {
      field.classList.add("error");
      errorSpan.style.display = "block";
      return false;
    }
    if (field.type === "email" && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        field.classList.add("error");
        errorSpan.style.display = "block";
        return false;
      }
    }
    field.classList.remove("error");
    errorSpan.style.display = "none";
    return true;
  };

  // Real-time validation
  sendCvForm.querySelectorAll("input").forEach((input) => {
    input.addEventListener("blur", () => validateSendField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("error")) validateSendField(input);
    });
  });

  // --- Sending overlay ---
  const sendingOverlay = document.getElementById("sendingOverlay");
  const spinnerBox = document.getElementById("spinnerBox");
  const successBox = document.getElementById("successBox");
  const sendingStatusTitle = document.getElementById("sendingStatusTitle");
  const sendingStatusDesc = document.getElementById("sendingStatusDesc");
  const btnCloseOverlay = document.getElementById("btnCloseOverlay");

  // --- Submit ---
  sendCvForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all required fields
    let isValid = true;
    sendCvForm.querySelectorAll("[required]").forEach((field) => {
      if (!validateSendField(field)) isValid = false;
    });

    // Check file upload if selected
    if (
      sourceUpload?.checked &&
      (!fileInput?.files || fileInput.files.length === 0)
    ) {
      window.showToast?.("Please attach a custom CV file first.", "error");
      return;
    }

    if (!isValid) {
      window.showToast?.("Please fix all errors before sending.", "error");
      return;
    }

    // Show overlay
    if (sendingOverlay) {
      sendingOverlay.classList.add("active");
      spinnerBox.style.display = "block";
      successBox.style.display = "none";
      btnCloseOverlay.style.display = "none";
      sendingStatusTitle.textContent = "Sending Application...";
      sendingStatusDesc.textContent =
        "We are securely encrypting and transmitting your profile to the hiring manager.";
    }

    // Simulate sending
    setTimeout(() => {
      if (sendingOverlay) {
        spinnerBox.style.display = "none";
        successBox.style.display = "block";
        sendingStatusTitle.textContent = "Application Transmitted!";
        sendingStatusDesc.textContent =
          "Success! Your CV along with the cover letter has been successfully dispatched to the employer's inbox.";
        btnCloseOverlay.style.display = "inline-block";
      }
    }, 2500);
  });

  // --- Close overlay & reset ---
  if (btnCloseOverlay && sendingOverlay) {
    btnCloseOverlay.addEventListener("click", () => {
      sendingOverlay.classList.remove("active");
      sendCvForm.reset();
      if (attachedFileBadge) attachedFileBadge.style.display = "none";
      if (fileInput) fileInput.value = "";
      window.location.href = "index.html";
    });
  }
}
