function initMain() {
	const navItems = document.querySelectorAll(".go-to-section");

	navItems.forEach((item) => {
		item.addEventListener("click", (e) => {
			e.preventDefault();
			const section = document.getElementById(item.getAttribute("href")?.slice(1) ?? "");
			if (section) {
				section.scrollIntoView({ behavior: "smooth" });
			}
		});
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initMain);
} else {
	initMain();
}
