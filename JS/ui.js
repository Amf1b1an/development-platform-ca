export function displayMessage(container, messageType, message) {
  let parent = container;

  if (typeof container === "string") {
    parent = document.querySelector(container);
  }

  const messageClasses = {
    error: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded",
    success:
      "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded",
    warning:
      "bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded",
    info: "bg-blue100 border border-blue-400 text-blue-700 px-4 py-3 rounded",
  };

  const classes = messageClasses[messageType] || messageClasses.info;

  parent.innerHTML = `<div class="${classes}">${message}</div>`;
}
