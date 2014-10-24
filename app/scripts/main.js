// Global variables
var fight;
var targetDamage = 0;
var playerDamage = 0;
var chosenPlayer;
var chosenLevel;
var targeted;
var winWidth = $(window).width();
var winHeight = $(window).height();

// Constructors
var Player = function(options){
  options = options || {};
  this.weapon = options.weapon;
  this.health = 100;
  this.damage = options.damage;
  this.ammo = options.ammo;
};

var Target = function(options){
  options = options || {};
  this.species = options.species;
  this.health = options.health;
  this.damage = options.damage;
  this.speed = options.speed;
  this.number = options.number || 0;
};

var Game = function(options){
  options = options || {};
  this.scene = options.scene;
  // this.player = chosenPlayer;
  this.enemies = options.enemies;
};

// Define enemies
var possum = new Target({
  species: 'possum',
  health: 50,
  damage: 30,
  speed: 1000,
  number: 1
});

// Define players
var pistol = new Player({
  weapon: 'pistol',
  damage: 20,
  ammo: 20
});

// Templates
var fightTemp = $('#fight').html();
var renderFightTemp = _.template(fightTemp);

var gameoverTemp = $('#gameover').html();
var rendergameoverTemp = _.template(gameoverTemp);

// Define Levels
var level1 = new Game({
  scene: 'yard',
  enemies: possum
});

// Setup
$('.playerChoice').on('click', function(){
  chosenPlayer = $(this).attr('name');
  level1.player = chosenPlayer;
  $('.container').html(renderFightTemp(level1));
  console.log(level1.player);
  fight();
});

// Fight
var fight = function(){
  // Target Movement
  var targWidth = $('.target').width();
  var targHeight = $('.target').height();
  var targMov = function(){
    $('.target').animate({ top: Math.random() * (winHeight - targHeight), right: Math.random() * (winWidth - targWidth)});
  };
  var targMovInt = setInterval(targMov, 1000);

  // Attack every 3 seconds until dead
  var targetAttackInt = setInterval(function(){
    // When attacked, random damge under 30 done and player turns red.
    playerDamage += (Math.random() * 30);
    console.log(playerDamage);
    // if the target kills you, the timed attacks end
    if(playerDamage >= 100){
      clearInterval(targetAttackInt);
      clearInterval(targMovInt);
      $('.player').css('background-color','red');
      console.log('You are dead!');
    }
  }, 3000);

  // Player attackes target
  $('.target').mouseenter(function(){
    targeted = true;
  }).mouseleave(function(){
    targeted = false;
  });
  // if targeted and keypress, cause damage
  $(document).keypress(function(event){
    event.preventDefault();
    if(targeted){
      $('.target').css({'background-position': '-636px 0', 'width': '340px'});
      setTimeout(function(){
        $('.target').css({'background-position': '0 0', 'width': '300px'});
      }, 250);
      targetDamage += (Math.random() * 100);
      console.log(targetDamage);
    }
    if(targetDamage >= 100){
      clearInterval(targetAttackInt);
      clearInterval(targMovInt);
      $('.target').removeClass('target').addClass('deadTarget');
      console.log('Target is dead!');
    }
  });
}; // End if(fighting)

