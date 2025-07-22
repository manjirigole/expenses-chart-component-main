document.addEventListener("DOMContentLoaded", () => {
  const barGraphGrid = document.querySelector(".bar-graph-grid");
  const template = document.querySelector(".graph-template");
  const totalAmountElement = document.querySelector(".total");

  fetch("data.json")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const maxAmount = Math.max(...data.map((d) => d.amount));
      const sum = data.reduce((acc, s) => acc + s.amount, 0);

      // Get JS day and map it to your data (where 0 is "mon", 6 is "sun")
      const today = new Date();
      const jsDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const dataIndex = (jsDayIndex + 6) % 7; // Converts JS format to your format
      const currentDay = data[dataIndex].day;

      data.forEach((details) => renderGraph(details, maxAmount, currentDay));
      totalBalance(sum);
      displayCurrentAmount(data[dataIndex]);
    })
    .catch((error) => console.error("failed to fetch data:", error));

  function renderGraph(details, maxAmount, currentDay) {
    const clone = template.content.cloneNode(true);
    const bar = clone.querySelector(".bar");
    const dayLabel = clone.querySelector(".day");
    const amountWrapper = clone.querySelector(".amount-wrapper");

    // Set bar height
    bar.style.height = `${(details.amount / maxAmount) * 150}px`;

    // Highlight current day
    bar.style.backgroundColor =
      details.day === currentDay ? "hsl(186, 34%, 65%)" : "hsl(10, 79%, 65%)";

    // Set day label
    dayLabel.textContent = details.day;

    bar.addEventListener("mouseenter", () => {
      amountWrapper.textContent = `$${details.amount.toFixed(2)}`;
    });

    bar.addEventListener("mouseleave", () => {
      amountWrapper.textContent = "";
    });

    barGraphGrid.appendChild(clone);
  }

  function totalBalance(sum) {
    if (totalAmountElement) {
      totalAmountElement.textContent = `$${sum.toFixed(2)}`;
    }
  }
});
