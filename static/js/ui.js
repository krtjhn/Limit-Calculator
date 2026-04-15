document.addEventListener("DOMContentLoaded", function () {
  const tooltip = document.getElementById("latex-tooltip");
  const tableCells = document.querySelectorAll(
    ".sequence-table tr:nth-child(1) td[data-latex]"
  );

  tableCells.forEach(function (td) {
    td.addEventListener("mouseenter", function () {
      const latex = td.getAttribute("data-latex");
      if (!tooltip || !latex || !latex.trim()) {
        return;
      }

      tooltip.innerHTML = `\\(${latex}\\)`;
      tooltip.style.display = "block";

      if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise([tooltip]).catch(function () {});
      }
    });

    td.addEventListener("mousemove", function () {
      if (!tooltip || tooltip.style.display !== "block") {
        return;
      }

      const rect = td.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      const tooltipHeight = tooltip.offsetHeight || 36;
      tooltip.style.left =
        rect.left + rect.width / 2 + scrollX - tooltip.offsetWidth / 2 + "px";
      tooltip.style.top = rect.top + scrollY - tooltipHeight - 8 + "px";
    });

    td.addEventListener("mouseleave", function () {
      if (!tooltip) {
        return;
      }
      tooltip.style.display = "none";
      tooltip.innerHTML = "";
    });
  });

  const resultsPanel = document.getElementById("results-panel");
  const tableModal = document.getElementById("table-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");

  function showModal() {
    if (!tableModal) {
      return;
    }

    tableModal.style.display = "flex";
    setTimeout(function () {
      tableModal.classList.add("active");
    }, 10);

    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise([tableModal]).catch(function () {});
    }
  }

  function hideModal() {
    if (!tableModal) {
      return;
    }

    tableModal.classList.remove("active");
    setTimeout(function () {
      tableModal.style.display = "none";
    }, 250);
  }

  if (resultsPanel && tableModal) {
    resultsPanel.addEventListener("click", function (event) {
      if (!event.target.closest(".empty-state")) {
        showModal();
      }
    });
  }

  if (closeModalBtn && tableModal) {
    closeModalBtn.addEventListener("click", function () {
      hideModal();
    });
  }

  if (tableModal) {
    tableModal.addEventListener("click", function (event) {
      if (event.target === tableModal) {
        hideModal();
      }
    });
  }

  const flipCard = document.getElementById("modal-flip-card");
  if (flipCard) {
    flipCard.addEventListener("click", function (event) {
      if (!event.target.closest("#close-modal-btn")) {
        flipCard.classList.toggle("flipped");
      }
    });
  }
});
