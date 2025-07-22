document.addEventListener("DOMContentLoaded", () => {
  fetch("navBar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;
    });
});