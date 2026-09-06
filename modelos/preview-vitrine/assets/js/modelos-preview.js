(function () {
    const videos = Array.from(document.querySelectorAll('.preview-video[data-autopause="true"]'));

    if (!('IntersectionObserver' in window) || videos.length === 0) {
        videos.forEach((video) => {
            video.play().catch(() => {});
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, {
        threshold: [0, 0.45, 0.8]
    });

    videos.forEach((video) => observer.observe(video));
})();
