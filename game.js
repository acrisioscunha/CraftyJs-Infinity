Crafty.init(500, 350, document.getElementById('game'));

var loading = window.document.getElementById('loading');
var viewport = window.document.getElementById('viewport');
var lifeDisplay = window.document.getElementById('life');
var pontosDisplay = window.document.getElementById('pontos');
var pontos = 0;

var assetsObj = {
    'audio': {
        'explosion': ['explosion.ogg'],
        'luck': ['luck.mp3']
    },
//    "images": ["badguy.bmp", "goodguy.png"],
    'sprites': {
        'asteroide.png': {
            'tile': 32,
            'tileh': 32,
            'map': {'asteroide': [0, 0]},
            'paddingX': 5,
            'paddingY': 5,
            'paddingAroundBorder': 10
        },
        'robo.png': {
            'tile': 60,
            'tileh': 50,
            'map': {'Robo': [0, 0]},
            'paddingX': 5,
            'paddingY': 5,
            'paddingAroundBorder': 10
        },
        'explosion.png': {
            'tile': 32,
            'tileh': 32,
            'map': {'Explosion': [0, 0]},
            'paddingX': 5,
            'paddingY': 5,
            'paddingAroundBorder': 10
        }
    }
};

Crafty.load(assetsObj, // preload assets
    function () { //when loaded

        document.getElementById('UP_ARROW').addEventListener('touchstart', function () {                        
            Crafty.trigger('KeyDown', { key: Crafty.keys.UP_ARROW });
        });

        document.getElementById('UP_ARROW').addEventListener('touchend', function () {            
            Crafty.trigger('KeyUp', { key: Crafty.keys.UP_ARROW });
        });

        loading.classList.add('displayNone');
        viewport.classList.remove('displayNone');

        Crafty.sprite(32, 'asteroide.png', {
            Asteroide: [0, 0]
        });

        Crafty.sprite(60, 50, 'robo.png', {
            Player: [0, 0]
        });

        Crafty.sprite(100, 'explosion.png', {
            Explosion: [0, 0]
        });

        Crafty.c('Explode', {
            init: function () {

                this.requires('2D, Canvas, Delay, SpriteAnimation, Explosion')
                    .reel('Fire', 600, 0, 0, 6);

                this.animate('Fire');

                this.delay(function () {
                    this.destroy();
                }, 600, 1);

            }

        });


        Crafty.c('Background', {
            init: function () {
                this.requires('2D, Canvas, Image, Tween')
                    .attr({x: 500, y: 0, z: -1})
                    .image('space.jpg')
                    .tween({x: -1921}, 30000, 'linear')
                    .bind('EnterFrame', function (data) {

                        if (this.x < -1920) {
                            this.destroy();
                        }

                    });
            }
        });

        Crafty.c('BulletPlayer', {
            init: function () {
                this.requires('2D, Canvas, Color, Delay, Collision, Bullet')
                    .attr({x: player.x + 60, y: player.y + 16, w: 10, h: 3})
                    .color('#ff0000')
                    .onHit('Asteroide', function () {

                        setTimeout(function (obg) {
                            obg.destroy();
                        }, 50, this);

                    })
                    .delay(function () {

                        this.x += 3;

                        if (this.x > 510) {

                            this.destroy();

                        }

                    }, 10, -1);
            }
        });

        Crafty.c('Asteroid', {
            init: function () {

                var sprite = getRandomInt(0, 2);
                var speed = getRandomInt(5, 20);
                var y = getRandomInt(0, 450);

                this.requires('2D, Canvas, Delay, Collision, SpriteAnimation, Asteroide')
                    .attr({x: 501, y: y, w: 50, h: 50, life: 4})
                    .reel('Turning', 500, 0, sprite, 5) // setup animation
                    .animate('Turning', -1) // start animation
                    .onHit('Bullet', function () {

                        this.life -= 1;

                        if (this.life <= 0) {

                            Crafty.e('Explode').attr({x: this.x - (this.w / 2), y: this.y});
                            Crafty.audio.play('explosion');
                            pontos += 1;

                            if (pontos === 15) {
                                Crafty.audio.play('luck');
                            }

                            pontosDisplay.innerHTML = pontos;
                            this.destroy();
                        }

                    })
                    .delay(function () {

                        this.x -= speed;

                        if (this.x < 0) {

                            this.destroy();

                        }

                    }, 100, -1);

            }
        });

        Crafty.e('Background');
        setInterval(function () {
            Crafty.e('Background');
        }, 22000);

        var player = Crafty.e('2D, Canvas, Fourway, SpriteAnimation, Player, Collision, Delay')
            .attr({x: 0, y: 0, w: 60, h: 50, life: 2000})
            .fourway(200)
            .reel('Wait', 500, 3, 0, 4) // setup animation
            .reel('Move', 500, 0, 0, 2) // setup animation
            .animate('Wait', -1) // start animation
            .bind('NewDirection', function (data) {
                if (data.x === 0 && data.y === 0) {
                    this.animate('Wait', -1);
                } else {
                    this.animate('Move', -1);
                }
            })
            .onHit('Asteroide', function () {

                this.life -= 1;

                lifeDisplay.innerHTML = this.life;
                if (this.life <= 0) {

                    Crafty.e('Explode').attr({x: this.x - (this.w / 2), y: this.y});
                    Crafty.audio.play('explosion');
                    this.destroy();

                }

            })
            .delay(function () {
                Crafty.e('BulletPlayer').attr({x: this.x + 60, y: this.y + 16, w: 10, h: 3});
            }, 200, -1);


        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        setInterval(function () {

            var quantidade = getRandomInt(0, 10);

            for (var x = 0; x < 2; x++) {
                Crafty.e('Asteroid');
            }

        }, 1000);

    },
    function (e) { //progress
    },
    function (e) { //uh oh, error loading
        console.log(e);
    }
);
