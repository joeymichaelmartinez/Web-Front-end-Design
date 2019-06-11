$(() => {

    $(".slide-this").slider({
        change: function (percentage) {
            $(".image").css({
                "width": percentage + 100,
                "height": percentage + 100
            });

        }
    });
});
