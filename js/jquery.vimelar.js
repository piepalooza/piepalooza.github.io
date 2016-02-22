/**
 * jQuery Vimelar plugin
 * @author: Sozonov Alexey
 * @version: v.1.0
 * licensed under the MIT License
 * updated: July 5, 2015
 * since 2015
 * Enjoy.
 */

;
(function( $, window ) {

    // defaults
    var defaults = {
        ratio: 16 / 9, // usually either 4/3 or 16/9 -- tweak as needed
        videoId: '8970192',
        width: $( window ).width(),
        wrapperZIndex: 1,

    };
    var $node;

    // methods
    var vimelar = function( node, options ) { // should be called on the wrapper div
        var options = $.extend( {}, defaults, options );
        $node = $( node ); // cache wrapper node

        // set up css prereq's, inject vimelar container and set up wrapper defaults
        //$('html,body').css({'width': $(node ).width(), 'height': $(node ).height()});

        // build container
        $(
            '<iframe />', {
                name: 'myFrame',
                id: 'vimelar-player',
                src: '//player.vimeo.com/video/' + options.videoId + (typeof options.parameters !== "undefined" ? '?' + $.param( options.parameters ) : ''),
                style: 'position: absolute; width:100%; height: 100%;',
                frameborder: 0,
                webkitallowfullscreen: 1,
                mozallowfullscreen: 1,
                allowfullscreen: 1
            }
        ).appendTo( $node ).wrap( '<div id="vimelar-container" style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%"></div>' ).after( '<div id="vimelar-overlay" style="width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;"></div>' );

        $node.css( {position: 'relative', 'z-index': options.wrapperZIndex} );
        console.log( $node );
        // resize handler updates width, height and offset of player after resize/init
        var resize = function() {
            var targetWidth = $node.outerWidth(),
                targetHeight = $node.outerHeight(),
                pWidth, // player width, to be defined
                pHeight, // player height, tbd
                $vimelarPlayer = $( '#vimelar-player' );
            var ratio;

            var newWidth = $node.outerWidth();
            var newHeight = $node.outerHeight();
            var newWidthToHeight = newWidth / newHeight;

            if (newWidthToHeight > options.ratio) {
                newWidth = newHeight * options.ratio;
                if (newWidth < targetWidth) {

                    newWidth = targetWidth;
                }
                $vimelarPlayer.width( newWidth ).height( newHeight ).css( {left: (targetWidth - newWidth) / 2, top: 0} ); // player height is greater, offset top; reset left
            } else {
                newHeight = newWidth / options.ratio;
                if (newHeight < targetHeight) {
                    newHeight += 50;
                    newWidth = targetWidth;
                }
                $vimelarPlayer.width( newWidth ).height( newHeight ).css( {left: 0, top: (targetHeight - newHeight) / 2} ); // player height is greater, offset top; reset left
            }

            //
            //// when screen aspect ratio differs from video, video must center and underlay one dimension
            //if ( width / options.ratio < height ) { // if new video height < window height (gap underneath)
            //
            //} else { // new video width < window width (gap to right)
            //    pHeight = width; // get new player height
            //    $vimelarPlayer.width( width ).height( pHeight ).css( {left: 0, top: (height - pHeight) / 2} ); // player height is greater, offset top; reset left
            //}

        }

        // events
        $( window ).load(
            function() {
                resize();
            }
        )

        $( window ).on(
            'resize.vimelar', function() {
                resize();
            }
        )

    }

    // create plugin
    $.fn.vimelar = function( options ) {
        return this.each(
            function() {
                if ( !$.data( this, 'vimelar_instantiated' ) ) { // let's only run one
                    $.data(
                        this, 'vimelar_instantiated',
                        vimelar( this, options )
                    );
                }
            }
        );
    }

})( jQuery, window );