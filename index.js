//阻止苹果电脑默认事件
$(document).on('touchmove', function(ev) {
    ev.preventDefault();
});
$(function() {
    var $main = $('#main');
    var $list = $('#list');
    var $li = $list.find('>li');
    var viewHeight = $(window).height();

    //设置main的高度
    $main.css('height', viewHeight);

    showLoading();
    slideCanvas();
    slideImg();

    //绘制canvas
    function slideCanvas() {
        var timer = null;
        var iNow = 0;
        var $c = $('#c1');
        var gc = $c.get(0).getContext('2d');
        $c.attr('height', viewHeight);
        //创建image对象加载
        var img = new Image();
        img.src = 'img/a.jpg';

        var moveImg = new Image();
        moveImg.src = 'img/Touch4.png';

        //moveImg比较大一点
        moveImg.onload = function() {
            //绘制到canvas中
            gc.drawImage(img, (640 - nowViewWidth()) / 2, 0, nowViewWidth(), viewHeight);
            gc.globalCompositeOperation = 'destination-out';

            //点击散开
            $c.on('touchstart', function() {
                //0:x坐标，400：y坐标,254宽,400高
                //gc.drawImage(moveImg,0,400,254,400,0,0,640,viewHeight);
                timer = setInterval(function() {
                    var i = iNow % 4;
                    var j = Math.floor(iNow / 4);
                    gc.drawImage(moveImg, i * 254, j * 400, 254, 400, 0, 0, 640, viewHeight);
                    iNow++;

                    if (iNow == 19) {
                        clearInterval(timer);
                        $c.remove();
                        cjAnimate.inAn(0);
                    }

                }, 100);

                showMusic();
            });
        }
    }
    //获取可视区width
    function nowViewWidth() {
        var w = 640 * viewHeight / 960; //宽高等比例
        w = w > 640 ? w : 640;
        return w;
    }

    //监听animation
    function beginEffect() {
        $('#text1').css('animation', '1s infinite flash linear');
        /*
        开始：animationstart
        迭代：animationiteration
        结束：animationend
        ev.originalEvent转为原生对象
        ev.originalEvent.elapsedTime:运动了多少次
        */
        $('#text1').on('webkitAnimationIteration animationIteration', function(ev) {
            if (ev.originalEvent.elapsedTime == 3) {
                $(this).remove();
                $('#text2').show().css('animation', '1s infinite flash linear');
                $('#beginEffect').on('touchstart', function() {
                    $(this).remove();
                    $('#c1').trigger('touchstart');
                })
            }
        });
    }

    //滑屏
    function slideImg() {
        var startY = 0;
        var nowIndex = 0;
        var nextorprevIndex = 0;
        var bBtn = true;
        var $span = $('#arrow').find('span');

        $li.on('touchstart', function(ev) {

            var touch = ev.originalEvent.changedTouches[0];
            startY = touch.pageY;
            nowIndex = $(this).index();
            $li.on('touchend', function(ev) {
                if (bBtn) {
                    bBtn = false;
                    var touch = ev.originalEvent.changedTouches[0];
                    if (touch.pageY < startY) { //↑
                        nextorprevIndex = nowIndex == $li.length - 1 ? 0 : nowIndex + 1;

                        $(this).css('transform', 'rotateX(50deg)');
                        $(this).css('transition', '0.5s');
                        $(this).css('opacity', 0);

                        $li.eq(nextorprevIndex).css('transform', 'rotateX(-50deg)');
                        $li.eq(nextorprevIndex).css('opacity', '0').show();

                        setTimeout(function() {
                            $li.eq(nextorprevIndex).css('transform', 'rotateX(0deg)');
                            $li.eq(nextorprevIndex).css('opacity', '1');
                            $li.eq(nextorprevIndex).css('transition', '0.5s');

                        }, 100);

                    } else if (touch.pageY > startY) { //下
                        nextorprevIndex = nowIndex == 0 ? $li.length - 1 : nowIndex - 1;

                        $(this).css('transform', 'rotateX(-50deg)');
                        $(this).css('transition', '0.5s');
                        $(this).css('opacity', 0);

                        $li.eq(nextorprevIndex).css('transform', 'rotateX(90deg)');
                        $li.eq(nextorprevIndex).css('opacity', '0').show();

                        setTimeout(function() {
                            $li.eq(nextorprevIndex).css('transform', 'rotateX(0deg)');
                            $li.eq(nextorprevIndex).css('opacity', '1');
                            $li.eq(nextorprevIndex).css('transition', '0.5s');

                        }, 100);

                    } else {
                        bBtn = true;
                    }

                    $li.off('touchend');
                    $span.html((nextorprevIndex + 1) + '/' + $li.length);
                }
            });

            //解决层级关系
            $li.on('webkitTransitionEnd transitionEnd', function(ev) {
                if (!$li.is(ev.target)) {
                    return;
                }
                resetFn();

                if (cjAnimate.inAn) {
                    cjAnimate.inAn(nextorprevIndex);
                }
                if (cjAnimate.outAn) {
                    cjAnimate.outAn(nowIndex);
                }

            });

            function resetFn() {
                $li.css('transform', '');
                $li.css('transition', '');
                $li.eq(nextorprevIndex).siblings().hide();
                bBtn = true;
            }

        });
    }

    var cjAnimate = {
        inAn: function(index) {
            var $img = $li.eq(index).find('img');
            setTimeout(function() {
                $img.eq(0).css('transform', 'scale(1)');
                $img.eq(0).css('transition', '1s');
                $img.eq(1).css('transform', 'translate(0,0)');
                $img.eq(1).css('opacity', 1);
                $img.eq(1).css('transition', '1s 0.5s');
                $img.eq(1).on('webkitTransitionEnd transitionEnd', function() {
                    $img.eq(2).attr('class', 'active');
                });
            }, 100);

        },
        outAn: function(index) {
            var $img = $li.eq(index).find('img');
            $img.eq(0).css('transform', 'scale(1.5)');
            $img.eq(1).css('transform', 'translate(0,200px)');
            $img.eq(1).css('opacity', 0);
            $img.eq(0).css('transition', '');
            $img.eq(1).css('transition', '');
            $img.eq(2).attr('class', '');
        }
    };
    //先所有li调用出场动画
    $li.each(function(i, elem) {
        cjAnimate.outAn(i);
    });


    function showMusic() {
        var $music = $('#music');
        var $a1 = $('#a1');
        var onOff = true;
        $music.on('touchstart', function() {
            if (onOff) {
                $(this).attr('class', 'active');
                $a1.get(0).play();
            } else {
                $(this).attr('class', '');
                $a1.get(0).pause();
            }
            onOff = !onOff;
        });

        $music.trigger('touchstart');
    }

    function showLoading() {
        var arr = ['img3.jpg', 'img4.jpg', 'img5.jpg','img6.jpg','img7.jpg','img8.jpg','img9.jpg','img10.jpg'];
        var num = 0;
        $.each(arr, function(i, imgSrc) {
            var imgObj = new Image();
            imgObj.src = 'img/' + imgSrc;
            imgObj.onload = function() {
                num++;
                if (num == arr.length) {
                    $('#loading').animate({opacity:0},function(){
                        $(this).remove();
                        beginEffect();
                    });                    
                }
            };
            imgObj.onerror=function(){
                $('#loading').animate({opacity:0},function(){
                        $(this).remove();
                        beginEffect();
                    }); 
            }
        })
    }

});
