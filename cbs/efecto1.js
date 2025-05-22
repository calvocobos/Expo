$(document).ready(function () {
    let currentIndex = 0;
    const slides = $('.carousel-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.hide();
        slides.eq(index).fadeIn();
    }

    $('#prevBtn').click(function () {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    });

    $('#nextBtn').click(function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    });

    // Mostrar la primera slide
    showSlide(currentIndex);
});