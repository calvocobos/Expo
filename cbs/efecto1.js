$('.carousel').each(function () {
    const $carousel = $(this);
    const $slides = $carousel.find('.contenido .slide');
    let currentIndex = 0;

    // Inicialmente mostrar solo la primera slide
    $slides.hide('slow').eq(currentIndex).show('slow');

    // Botón adelante
    $carousel.find('.adelante').on('click', function () {
        $slides.eq(currentIndex).hide('slow');
        currentIndex = (currentIndex + 1) % $slides.length;
        $slides.eq(currentIndex).show('slow');
    });

    // Botón atrás
    $carousel.find('.atras').on('click', function () {
        $slides.eq(currentIndex).hide('slow');
        currentIndex = (currentIndex - 1 + $slides.length) % $slides.length;
        $slides.eq(currentIndex).show('slow');
    });
});
