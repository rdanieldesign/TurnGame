// Global variables
var playerHealth;
var chosenPlayer;
var currentLevel;
var winWidth;
var winHeight;

// Continuosly resize game window according to browser window size
setInterval(function(){
  winWidth = $(window).width();
  winHeight = $(window).height();
  // Set screen
  $('.container').css({'width': winWidth + 'px', 'height': winHeight + 'px'})
}, 0);

// Templates
var fightTemp = $('#fight').html();
var renderFightTemp = _.template(fightTemp);

var gameoverTemp = $('#gameover').html();
var rendergameoverTemp = _.template(gameoverTemp);

// Constructors
// Define players
var Player = function(options){
  options = options || {};
  this.weapon = options.weapon;
  this.health = 100;
  this.damage = options.damage;
  this.ammo = options.ammo;
};

var pistol = new Player({
  weapon: 'pistol',
  damage: 20,
  ammo: 20
});

var shotgun = new Player({
  weapon: 'shotgun',
  damage: 30,
  ammo: 10
});

var rifle = new Player({
  weapon: 'rifle',
  damage: 50,
  ammo: 5
});

// Define enemy
var Target = function(options){
  options = options || {};
  this.species = options.species;
  this.health = options.health;
  this.damage = options.damage;
  this.speed = options.speed;
  this.targeted = options.targeted;
};

var possum = new Target({
  species: 'possum',
  health: 50,
  damage: 30,
  speed: 2000,
  targeted: false
});

var armadillo = new Target({
  species: 'armadillo',
  health: 200,
  damage: 50,
  speed: 3000,
  targeted: false
});

var deer = new Target({
  species: 'deer',
  health: 100,
  damage: 50,
  speed: 1000,
  targeted: false
});

// Game setup
var Game = function(options){
  options = options || {};
  this.scene = options.scene;
  this.enemy = options.enemy;
};

// Define Levels
var level1 = new Game({
  scene: 'yard',
  enemy: possum
});

var level2 = new Game({
  scene: 'yard',
  enemy: armadillo
});

var level1 = new Game({
  scene: 'yard',
  enemy: possum
});

var fight = function(){

  // Reset Health
  playerHealth = 100;
  var targetHealth = level1.enemy.health;
  var playerDamage;

  // Fight Variables
  var fighting = true;
  var levelEnemy = level1.enemy;
  var target = $('.target');
  var isTargeted = false;
  var targHeight = $('.target').height();
  var targWidth = $('.target').width();
  var targSpeed = level1.enemy.speed;
  var targDamage = level1.enemy.damage;

  // Target Moves Randomly
  var targMoveInt = setInterval(function(){
    $(target).animate({ top: Math.random() * (winHeight - targHeight), right: Math.random() * (winWidth - targWidth)});
  }, 500);

  // Target Attacks on Interval
  var targAttackInt = setInterval(function(){
    playerHealth -= (Math.random() * targDamage);
    // Show target attack screen when attacked, then remove
    $('.attack').css('display', 'block');
    setTimeout(function(){
      $('.attack').css('display', 'none');;
    }, 250);
    console.log(playerHealth);
    // If player dies, stop target attacks and display death modal.
    if(playerHealth <= 0){
      clearInterval(targAttackInt);
      $('.death').css('display', 'block');
      console.log('You are dead!');
    };
  }, targSpeed);

  // Detect if Player is aiming at Target
  $(target).mouseenter(function(){
    isTargeted = true;
  }).mouseleave(function(){
    isTargeted = false;
  });

  // If Target is targeted, enable shooting with keypress
  $(document).keypress(function(event){
    event.preventDefault();
    if(isTargeted){
      // Shift to shot-view and quickly back
      $(target).css({'background-position': '-636px 0', 'width': '340px'});
      setTimeout(function(){
        $(target).css({'background-position': '0 0', 'width': '300px'});
      }, 250);
      // Decrease target's health when shot
      targetHealth -= (Math.random() * 10);
      console.log(targetHealth);
    }
    // If you kill the target, it stops moving & attacking and turns red
    if(targetHealth <= 0){
      clearInterval(targAttackInt);
      clearInterval(targMoveInt);
      $(target).addClass('deadTarget');
      $('.win').css('display', 'block');
      console.log('Target is dead!');
    }
  });

};

// Setup
$('.playerChoice').on('click', function(){
  level1.weapon = $(this).attr('name');
  currentLevel = level1;
  $('.container').html(renderFightTemp(currentLevel));
  fight(level1);
});