
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

// blog page js
$(document).ready(function () {
    $('.additional-content').hide();
    $('.read-more').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var $card = $this.closest('.blog-post');
        $card.find('.additional-content').slideToggle();
        $this.text($this.text() === 'Read More' ? 'Show Less' : 'Read More');
    });
});

