class GameEngine {
  constructor(canvas, level, updateGameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.level = level;
    this.updateGameState = updateGameState;
    
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.player = {
      x: 100,
      y: this.height / 2,
      width: 40,
      height: 30,
      velocityY: 0,
      speed: 5,
      health: 100,
      color: '#00FF94',
    };
    
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.stars = [];
    
    this.score = 0;
    this.isPaused = false;
    this.isRunning = false;
    
    this.keys = {};
    this.lastShot = 0;
    this.shootCooldown = 250;
    
    this.gravity = 0.5;
    this.jumpPower = -12;
    this.isGrounded = false;
    
    this.enemySpawnTimer = 0;
    this.enemySpawnRate = 2000;
    this.enemiesDefeated = 0;
    this.totalEnemies = 5 + (level * 3);
    
    this.setupControls();
    this.initStars();
  }
  
  setupControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      if (e.key === ' ' && !this.isPaused) {
        e.preventDefault();
        this.shoot();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }
  
  initStars() {
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
  }
  
  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  stop() {
    this.isRunning = false;
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
  }
  
  restart() {
    this.player.x = 100;
    this.player.y = this.height / 2;
    this.player.velocityY = 0;
    this.player.health = 100;
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.score = 0;
    this.enemiesDefeated = 0;
    this.isPaused = false;
    this.updateGameState({ 
      score: 0, 
      health: 100, 
      isGameOver: false,
      isVictory: false,
    });
  }
  
  gameLoop() {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (!this.isPaused) {
      this.update(deltaTime);
    }
    this.render();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  update(deltaTime) {
    this.updatePlayer();
    this.updateBullets();
    this.updateEnemies(deltaTime);
    this.updateParticles();
    this.updateStars();
    this.checkCollisions();
    this.spawnEnemies(deltaTime);
    
    if (this.player.health <= 0) {
      this.updateGameState({ isGameOver: true, isVictory: false });
      this.isPaused = true;
    }
    
    if (this.enemiesDefeated >= this.totalEnemies && this.enemies.length === 0) {
      this.updateGameState({ isGameOver: true, isVictory: true });
      this.isPaused = true;
    }
  }
  
  updatePlayer() {
    if (this.keys['arrowup'] || this.keys['w']) {
      this.player.y -= this.player.speed;
    }
    if (this.keys['arrowdown'] || this.keys['s']) {
      this.player.y += this.player.speed;
    }
    if (this.keys['arrowleft'] || this.keys['a']) {
      this.player.x -= this.player.speed;
    }
    if (this.keys['arrowright'] || this.keys['d']) {
      this.player.x += this.player.speed;
    }
    
    this.player.x = Math.max(0, Math.min(this.width - this.player.width, this.player.x));
    this.player.y = Math.max(0, Math.min(this.height - this.player.height, this.player.y));
  }
  
  shoot() {
    const now = performance.now();
    if (now - this.lastShot < this.shootCooldown) return;
    
    this.lastShot = now;
    this.bullets.push({
      x: this.player.x + this.player.width,
      y: this.player.y + this.player.height / 2,
      width: 10,
      height: 4,
      speed: 10,
      color: '#00FF94',
    });
  }
  
  updateBullets() {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.x += bullet.speed;
      return bullet.x < this.width;
    });
  }
  
  spawnEnemies(deltaTime) {
    if (this.enemiesDefeated >= this.totalEnemies) return;
    
    this.enemySpawnTimer += deltaTime;
    if (this.enemySpawnTimer > this.enemySpawnRate) {
      this.enemySpawnTimer = 0;
      
      const enemyType = Math.random();
      let enemy;
      
      if (enemyType < 0.5) {
        enemy = {
          x: this.width,
          y: Math.random() * (this.height - 40),
          width: 35,
          height: 35,
          speed: 2 + (this.level * 0.3),
          health: 2,
          color: '#FF0055',
          type: 'basic',
        };
      } else {
        enemy = {
          x: this.width,
          y: Math.random() * (this.height - 50),
          width: 45,
          height: 45,
          speed: 1.5 + (this.level * 0.2),
          health: 3,
          color: '#BD00FF',
          type: 'tank',
        };
      }
      
      this.enemies.push(enemy);
    }
  }
  
  updateEnemies(deltaTime) {
    this.enemies.forEach((enemy) => {
      enemy.x -= enemy.speed;
      
      if (enemy.type === 'tank') {
        enemy.y += Math.sin(Date.now() / 500) * 2;
      }
    });
    
    this.enemies = this.enemies.filter((enemy) => enemy.x + enemy.width > 0);
  }
  
  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      return particle.life > 0;
    });
  }
  
  updateStars() {
    this.stars.forEach((star) => {
      star.x -= star.speed;
      if (star.x < 0) {
        star.x = this.width;
        star.y = Math.random() * this.height;
      }
    });
  }
  
  checkCollisions() {
    this.bullets.forEach((bullet, bulletIndex) => {
      this.enemies.forEach((enemy, enemyIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          this.bullets.splice(bulletIndex, 1);
          enemy.health--;
          
          this.createParticles(enemy.x, enemy.y, enemy.color);
          
          if (enemy.health <= 0) {
            this.enemies.splice(enemyIndex, 1);
            this.score += enemy.type === 'tank' ? 150 : 100;
            this.enemiesDefeated++;
            this.updateGameState({ score: this.score });
            this.createExplosion(enemy.x, enemy.y, enemy.color);
          }
        }
      });
    });
    
    this.enemies.forEach((enemy) => {
      if (
        this.player.x < enemy.x + enemy.width &&
        this.player.x + this.player.width > enemy.x &&
        this.player.y < enemy.y + enemy.height &&
        this.player.y + this.player.height > enemy.y
      ) {
        this.player.health -= 10;
        this.updateGameState({ health: this.player.health });
        enemy.x = -100;
      }
    });
  }
  
  createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color,
        size: Math.random() * 3 + 2,
        life: 30,
      });
    }
  }
  
  createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color,
        size: Math.random() * 5 + 3,
        life: 40,
      });
    }
  }
  
  render() {
    this.ctx.fillStyle = '#050505';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.stars.forEach((star) => {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(this.player.x + 5, this.player.y + 10, 10, 10);
    
    this.bullets.forEach((bullet) => {
      this.ctx.fillStyle = bullet.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = bullet.color;
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      this.ctx.shadowBlur = 0;
    });
    
    this.enemies.forEach((enemy) => {
      this.ctx.fillStyle = enemy.color;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = enemy.color;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      this.ctx.shadowBlur = 0;
      
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(enemy.x + 10, enemy.y + 10, 10, 10);
      this.ctx.fillRect(enemy.x + enemy.width - 20, enemy.y + 10, 10, 10);
    });
    
    this.particles.forEach((particle) => {
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.life / 30;
      this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      this.ctx.globalAlpha = 1;
    });
  }
  
  getGameState() {
    return {
      player_x: this.player.x,
      player_y: this.player.y,
      player_health: this.player.health,
      score: this.score,
      current_level: this.level,
      enemies: this.enemies,
      bullets: this.bullets,
    };
  }
}

export default GameEngine;