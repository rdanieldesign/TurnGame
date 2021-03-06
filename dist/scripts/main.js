// Global variables
var playerHealth;
var playerDamage;
var weaponClicked;
var chosenWeapon;
var currentLevel;
var currentLevelNum = 0;
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
  $('.container').css({'width': winWidth + 'px', 'height': winHeight + 'px'});
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
};

var pistol = new Player({
  name: 'pistol',
  damage: 15
});

var shotgun = new Player({
  name: 'shotgun',
  damage: 25
});

var rifle = new Player({
  name: 'rifle',
  damage: 40
});

// Define enemy
var Target = function(options){
  options = options || {};
  this.species = options.species;
  this.health = options.health;
  this.maxHealth = options.maxHealth;
  this.damage = options.damage;
  this.speed = options.speed;
  this.targeted = options.targeted;
  this.deathWord = options.deathWord;
  this.extraN = options.extraN;
};

var possum = new Target({
  species: 'possum',
  health: 100,
  maxHealth: 100,
  damage: 20,
  speed: 2000,
  targeted: false,
  deathWord: 'wasted',
  extraN: ' '
});

var armadillo = new Target({
  species: 'armadillo',
  health: 200,
  maxHealth: 200,
  damage: 50,
  speed: 3000,
  targeted: false,
  deathWord: 'destroyed',
  extraN: 'n '
});

var deer = new Target({
  species: 'deer',
  health: 400,
  maxHealth: 400,
  damage: 40,
  speed: 1500,
  targeted: false,
  deathWord: 'annihilated',
  extraN: ' '
});

// Game setup
var Game = function(options){
  options = options || {};
  this.scene = options.scene;
  this.enemy = options.enemy;
  this.weapon = options.weapon;
};

// Define Levels
var level1 = new Game({
  scene: 'yard',
  enemy: possum
});

var level2 = new Game({
  scene: 'desert',
  enemy: armadillo
});

var level3 = new Game({
  scene: 'road',
  enemy: deer
});

// Weapon Choice
$('.playerChoice').on('click', function(){
  weaponClicked = $(this).attr('name');
});

// Setup Level
$('.container').on('click', '.nextLevel', function(){
  currentLevelNum++;
  currentLevel = window['level' + currentLevelNum];
  chosenWeapon = window[weaponClicked];
  currentLevel.weapon = chosenWeapon;
  $('.container').html(renderFightTemp(currentLevel));
  fight(currentLevel);
});

var fight = function(){

  // Reset Enemy
  levelEnemy = currentLevel.enemy;

  // Reset Health
  playerHealth = 100;
  targetHealth = levelEnemy.health;

  // Fight Variables
  target = $('.' + levelEnemy.species);
  isTargeted = false;
  targHeight = target.height();
  targWidth = target.width();
  targSpeed = levelEnemy.speed;
  targDamage = levelEnemy.damage;

  // Target Moves Randomly
  targMoveInt = setInterval(function(){
    $(target).animate({ top: Math.random() * (winHeight - targHeight), right: Math.random() * (winWidth - targWidth)});
    // Target run sprite
    $(target).css('background-position', '0 0');
    setTimeout(function(){
      $(target).css('background-position', '33% 0');
    }, 250);
  }, 500);

  // Target Attacks on Interval
  targAttackInt = setInterval(function(){
    playerHealth -= targDamage;
    // Show target attack screen when attacked, then remove
    $('.attack').css('display', 'block');
    setTimeout(function(){
      $('.attack').css('display', 'none');
    }, 500);
    // Reduce player healthbar
    $('.playerStats .redline').css('width', playerHealth + '%');
    // If player dies, stop target attacks and display death modal.
    if(playerHealth <= 0){
      window.clearInterval(targAttackInt);
      $('.death').css('display', 'block');
      console.log('You are dead!');
    }
  }, targSpeed);

  // Detect if Player is aiming at Target
  $(target).mouseenter(function(){
    isTargeted = true;
  }).mouseleave(function(){
    isTargeted = false;
  });

  // If Target is targeted, enable shooting with keypress
  var attack = $(window).keypress(function(event){
    event.preventDefault();
    if(isTargeted){
      // Shift to shot-view and quickly back
      $(target).css('background-position', '67% 0');
      setTimeout(function(){
        $(target).css('background-position', '0 0');
      }, 250);
      // Decrease target's health when shot (Divided by level number - needs fix)
      targetHealth -= (currentLevel.weapon.damage / currentLevelNum);
      // Reduce target health bar
      $('.targetStats .redline').css('width', ((targetHealth / levelEnemy.maxHealth) * 100) + '%');
    }
    // If you kill the target, it stops moving & attacking and turns upside down
    if(targetHealth <= 0){
      window.clearInterval(targAttackInt);
      window.clearInterval(targMoveInt);
      setTimeout(function(){
        $(target).css('background-position', '100% 0');
      }, 250);
      if (currentLevelNum !== 3){
        $('.win').css('display', 'block');
      }
      else {
        $('.finale').css('display', 'block');
      }
    }
  });
};