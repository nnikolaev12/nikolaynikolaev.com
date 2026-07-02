/**
 * <projects-slider> — progressive-enhancement carousel.
 *
 * Markup contract (rendered server-side by ProjectsSlider.astro):
 *   <projects-slider>
 *     <ol  data-slider-list>
 *       <li data-slider-slide>...</li>
 *       ...
 *     </ol>
 *     <button data-slider-prev>...</button>
 *     <button data-slider-next>...</button>
 *     <button data-slider-dot>...</button> (one per slide, in DOM order)
 *   </projects-slider>
 *
 * Touch swipe is handled natively by CSS scroll-snap; this class only
 * wires up the prev/next/dot controls, keyboard nav, and active-slide state.
 */
class ProjectsSlider extends HTMLElement {
	private list!: HTMLElement;
	private slides: HTMLElement[] = [];
	private dots: HTMLButtonElement[] = [];
	private prevBtn: HTMLButtonElement | null = null;
	private nextBtn: HTMLButtonElement | null = null;
	private observer?: IntersectionObserver;
	private currentIndex = -1;

	connectedCallback() {
		const list = this.querySelector<HTMLElement>("[data-slider-list]");
		if (!list) return;
		this.list = list;
		this.slides = Array.from(
			this.querySelectorAll<HTMLElement>("[data-slider-slide]"),
		);
		this.dots = Array.from(
			this.querySelectorAll<HTMLButtonElement>("[data-slider-dot]"),
		);
		this.prevBtn = this.querySelector<HTMLButtonElement>("[data-slider-prev]");
		this.nextBtn = this.querySelector<HTMLButtonElement>("[data-slider-next]");

		if (this.slides.length === 0) return;

		this.prevBtn?.addEventListener("click", this.onPrev);
		this.nextBtn?.addEventListener("click", this.onNext);
		this.dots.forEach((dot, i) => {
			dot.addEventListener("click", () => this.goTo(i));
		});
		this.addEventListener("keydown", this.onKeydown);

		this.observer = new IntersectionObserver(
			(entries) => {
				let best: IntersectionObserverEntry | null = null;
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					if (!best || entry.intersectionRatio > best.intersectionRatio) {
						best = entry;
					}
				}
				if (!best) return;
				const index = this.slides.indexOf(best.target as HTMLElement);
				if (index !== -1) this.setActive(index);
			},
			{ root: this.list, threshold: [0.5, 0.75, 1] },
		);
		this.slides.forEach((slide) => this.observer!.observe(slide));

		this.setActive(0);
	}

	disconnectedCallback() {
		this.observer?.disconnect();
		this.prevBtn?.removeEventListener("click", this.onPrev);
		this.nextBtn?.removeEventListener("click", this.onNext);
		this.removeEventListener("keydown", this.onKeydown);
	}

	private onPrev = () => this.goTo(this.currentIndex - 1);
	private onNext = () => this.goTo(this.currentIndex + 1);

	private onKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case "ArrowLeft":
				event.preventDefault();
				this.goTo(this.currentIndex - 1);
				break;
			case "ArrowRight":
				event.preventDefault();
				this.goTo(this.currentIndex + 1);
				break;
			case "Home":
				event.preventDefault();
				this.goTo(0);
				break;
			case "End":
				event.preventDefault();
				this.goTo(this.slides.length - 1);
				break;
		}
	};

	private goTo(index: number) {
		const clamped = Math.max(0, Math.min(this.slides.length - 1, index));
		const slide = this.slides[clamped];
		if (!slide) return;
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		this.list.scrollTo({
			left: slide.offsetLeft - this.list.offsetLeft,
			behavior: reduceMotion ? "auto" : "smooth",
		});
	}

	private setActive(index: number) {
		if (index === this.currentIndex) return;
		this.currentIndex = index;

		this.dots.forEach((dot, i) => {
			const isActive = i === index;
			if (isActive) {
				dot.setAttribute("aria-current", "true");
			} else {
				dot.removeAttribute("aria-current");
			}
		});

		this.slides.forEach((slide, i) => {
			slide.setAttribute("aria-hidden", i === index ? "false" : "true");
			slide.toggleAttribute("inert", i !== index);
		});

		if (this.prevBtn) this.prevBtn.disabled = index === 0;
		if (this.nextBtn) this.nextBtn.disabled = index === this.slides.length - 1;
	}
}

if (!customElements.get("projects-slider")) {
	customElements.define("projects-slider", ProjectsSlider);
}
