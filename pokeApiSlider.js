$(() => {

    $(".slide-this").slider({
        change: function (percentage) {
            $(".image").css({
                'transform': 'rotate(' + percentage * 3.6 + 'deg)'
            });

        }
    });
});
