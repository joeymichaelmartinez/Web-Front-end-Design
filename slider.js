(($) => {
    $.fn.slider = function (options) {
        const $this = this;

        let $current = null;
        let anchorX = 0;
        let deltaX = 0;
        $this.addClass("slider").mousedown(function (event) {
            $current = $(this);
            deltaX = event.screenX - $current.offset().left;
            anchorX = event.screenX - ($current.data('swivel-angle') || 0);
        });

        $(document).mousemove(event => {

            let sliderBox = $(".slider-box");
            let min = sliderBox.offset().left;
            let max = sliderBox.offset().left + sliderBox.outerWidth();
            let sliderBoxRight = sliderBox.offset().left + sliderBox.outerWidth();
            let currentSliderPosition = event.screenX - deltaX;
            const newPosition = event.screenX - anchorX;

            if ($current) {
                if (currentSliderPosition >= min && currentSliderPosition + $current.outerWidth() <= max){
                    $current.offset({
                        left: currentSliderPosition
                    }).data({
                        'slide-distance': newPosition
                    });
                } else if (currentSliderPosition < min) {
                    $current.offset({
                        left: min
                    }).data({
                        'slide-distance': newPosition
                    });
                } else if (currentSliderPosition + $current.outerWidth() > max) {
                    $current.offset({
                        left: sliderBoxRight - $current.outerWidth()
                    }).data({
                        'slide-distance': newPosition
                    });
                }


                let percentage = ($current.position().left - min) / (sliderBox.outerWidth() - $current.outerWidth()) * 100;
                if ($.isPlainObject(options) && $.isFunction(options.change)) {
                    options.change.call($current, percentage);
                }
            }
        }).mouseup(() => {
            $current = null;
        });

        return $this;
    };
})(jQuery);
