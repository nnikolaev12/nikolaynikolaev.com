/**
 * Wires up the "View Case Study" dialogs rendered by ProjectSlide.astro.
 *
 * Markup contract:
 *   <button data-dialog-open="<dialog-id>">…</button>
 *   <dialog id="<dialog-id>" data-project-dialog>
 *     <button data-dialog-close>…</button>
 *     …
 *   </dialog>
 *
 * Uses the native <dialog> element (showModal / close) and adds
 * click-outside-to-close plus body scroll locking while open.
 */
function initProjectDialogs() {
	const openers =
		document.querySelectorAll<HTMLButtonElement>("[data-dialog-open]");

	openers.forEach((opener) => {
		const id = opener.getAttribute("data-dialog-open");
		if (!id) return;
		const dialog = document.getElementById(id);
		if (!(dialog instanceof HTMLDialogElement)) return;

		opener.addEventListener("click", () => {
			dialog.showModal();
			document.body.style.overflow = "hidden";
		});

		dialog
			.querySelectorAll<HTMLButtonElement>("[data-dialog-close]")
			.forEach((closer) => {
				closer.addEventListener("click", () => dialog.close());
			});

		// Click on the backdrop (outside the inner panel) closes the dialog.
		dialog.addEventListener("click", (event) => {
			if (event.target === dialog) dialog.close();
		});

		dialog.addEventListener("close", () => {
			document.body.style.overflow = "";
		});
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initProjectDialogs);
} else {
	initProjectDialogs();
}
