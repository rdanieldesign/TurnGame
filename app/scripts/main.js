// Global variables
var fight;
var playerHealth = 100;
var chosenPlayer;
var currentLevel;
var levelEnemy;
var winWidth = $(window).width();
var winHeight = $(window).height();

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
  speed: 1000,
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

var fight = function(){
  var levelEnemy = level1.enemy;
};

// Setup
$('.playerChoice').on('click', function(){
  level1.weapon = $(this).attr('name');
  fight(level1);
  $('.container').html(renderFightTemp(currentLevel));
});