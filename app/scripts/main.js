// Global variables
var playerHealth;
var playerDamage;
var chosenWeapon;
var currentLevel;
var currentLevelNum = 1;
var winWidth;
var winHeight;

// Fight variables
var levelEnemy;
var target;
var isTargeted;
var targHeight;
var targWidth;
var targSpeed;
var targetHealth;
var targDamage;
var targAttackInt;
var targMoveInt;

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
  this.name = options.name;
  this.health = 100;
  this.damage = options.damage;
  this.ammo = options.ammo;
};

var pistol = new Player({
  name: 'pistol',
  damage: 20,
  ammo: 20
});

var shotgun = new Player({
  name: 'shotgun',
  damage: 30,
  ammo: 10
});

var rifle = new Player({
  name: 'rifle',
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

var level3 = new Game({
  scene: 'yard',
  enemy: deer
});

var fight = function(){

  // Reset Enemy
  levelEnemy = currentLevel.enemy;

  // Reset Health
  playerHealth = 100;
  targetHealth = levelEnemy.health;

  // Fight Variables
  target = $('.target');
  isTargeted = false;
  targHeight = $('.target').height();
  targWidth = $('.target').width();
  targSpeed = levelEnemy.speed;
  targDamage = levelEnemy.damage;

  // Target Moves Randomly
  targMoveInt = setInterval(function(){
    $(target).animate({ top: Math.random() * (winHeight - targHeight), right: Math.random() * (winWidth - targWidth)});
    // Target run sprite
    $(target).css('background-position', '0 0');
    setTimeout(function(){
      $(target).css('background-position', '-100% 0');
    }, 250);
  }, 500);

  // Target Attacks on Interval
  targAttackInt = setInterval(function(){
    playerHealth -= targDamage;
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
      $(target).css('background-position', '-200% 0');
      setTimeout(function(){
        $(target).css('background-position', '0 0');
      }, 250);
      // Decrease target's health when shot
      targetHealth -= chosenWeapon.damage;
      console.log(targetHealth);
    }
    // If you kill the target, it stops moving & attacking and turns red
    if(targetHealth <= 0){
      $(target).css('background-position', '-300% 0');
      clearInterval(targAttackInt);
      clearInterval(targMoveInt);
      if (currentLevelNum !== 3){
        $('.win').css('display', 'block');
      }
      else {
        $('.finale').css('display', 'block');
      }
    }
  });

};

// Setup
$('.playerChoice').on('click', function(){
  var weaponClicked = $(this).attr('name');
  currentLevel = window['level' + currentLevelNum];
  chosenWeapon = window[weaponClicked];
  currentLevel.weapon = chosenWeapon;
  $('.container').html(renderFightTemp(currentLevel));
  fight(currentLevel);
});

// Next Level
$('.container').on('click', '.nextLevel', function(){
  currentLevelNum++;
  currentLevel = window['level' + currentLevelNum];
  currentLevel.weapon = chosenWeapon;
  $('.container').html(renderFightTemp(currentLevel));
  fight(currentLevel);
});