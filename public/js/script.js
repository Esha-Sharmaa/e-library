
document.addEventListener("DOMContentLoaded", function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: stop observing once it's visible
            }
        });
    });

    document.querySelectorAll('.animate').forEach((element) => {
        observer.observe(element);
    });
});



