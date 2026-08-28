(() => {
    const config = window.BARBERSHOP_CONFIG;
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("galleryPrev");
    const nextButton = document.getElementById("galleryNext");
    const galleryItems = Array.from(document.querySelectorAll("[data-gallery-index]"));

    if (
        !config?.gallery ||
        !lightbox ||
        !lightboxImage ||
        !lightboxTitle ||
        !closeButton ||
        !previousButton ||
        !nextButton ||
        !galleryItems.length
    ) {
        return;
    }

    let currentGalleryIndex = 0;

    const updateLightbox = (index) => {
        currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
        const title = config.gallery[currentGalleryIndex];
        const imageSource = galleryItems[currentGalleryIndex].dataset.image;

        lightboxImage.src = imageSource;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
    };

    const openLightbox = (index) => {
        updateLightbox(index);
        lightbox.showModal();
        document.body.classList.add("modal-open");
    };

    const closeLightbox = () => {
        if (lightbox.open) {
            lightbox.close();
        }

        document.body.classList.remove("modal-open");
    };

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => openLightbox(Number(item.dataset.galleryIndex)));
    });

    closeButton.addEventListener("click", closeLightbox);
    previousButton.addEventListener("click", () => updateLightbox(currentGalleryIndex - 1));
    nextButton.addEventListener("click", () => updateLightbox(currentGalleryIndex + 1));

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.addEventListener("close", () => {
        document.body.classList.remove("modal-open");
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox.open) {
            return;
        }

        if (event.key === "ArrowLeft") {
            updateLightbox(currentGalleryIndex - 1);
        }

        if (event.key === "ArrowRight") {
            updateLightbox(currentGalleryIndex + 1);
        }
    });
})();
