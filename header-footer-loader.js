document.addEventListener("DOMContentLoaded", function() {
  fetch("header.html")
    .then(response => response.text())
    .then(headerHtml => document.getElementById("header-placeholder").innerHTML = headerHtml);

  fetch("footer.html")
    .then(response => response.text())
    .then(footerHtml => document.getElementById("footer-placeholder").innerHTML = footerHtml);
});
