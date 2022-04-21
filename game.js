// Model
class Game {
  constructor() {
    this.board = [];
    this.board = Array.from(Array(4), () => new Array(4).fill(0));
    
    for (let k = 0; k < 5; k++) {
      this.addRandom(2);
    }
    this.addRandom(4);
  }

  fuse(rowOrColArray) {
    let num = 0;
    let newnums = [];
    for (let j = 0; j < 4; ++j) {
      const cell = rowOrColArray[j];
      if (cell == 0) continue;
      if (cell == num) {
        newnums.push(cell*2);
        //changed = true;
        num = 0;
      } else if (num == 0) {
        num = cell;
      } else {
        newnums.push(num);
        num = cell;
      }
    }
    if (num != 0) {
      newnums.push(num);
    }
    return newnums;
  }

  move(dir) {
    let boardCpy = JSON.parse(JSON.stringify(this.board));
    for (let i = 0; i < 4; ++i) {
      this.board[i].fill(0);
    }
    console.log(this.board);
    let changed = false;
    if (dir == 'right' || dir == 'left') {
      // horizontal
      for (let row = 0; row < 4; ++row) {
        let boardRow = boardCpy[row];
        if (dir == 'right') {
          boardRow.reverse();
        }
        let newnums = this.fuse(boardRow);
        if (dir == 'right') {
          newnums.reverse();
        }
        console.log(newnums);
        // fill zeros
        if (dir == 'left') {
          // Left
          newnums = padArrayEnd(newnums, 4, 0);
        } else {
          // Right
          newnums = padArrayStart(newnums, 4, 0);
        }
        for (let j = 0; j < newnums.length; ++j) {
          this.board[row][j] = newnums[j];
        }
      }
    } else {
      // vertical
      for (let col = 0; col < 4; ++col) {
        let boardCol = [];
        for (let i = 0; i < 4; ++i) {
          boardCol.push(boardCpy[i][col]);
        }
        if (dir == 'down') {
          boardCol.reverse();
        }
        let newnums = this.fuse(boardCol);
        if (dir == 'down') {
          newnums.reverse();
        }
        console.log(newnums);
        // fill zeros
        if (dir == 'up') {
          // Up
          newnums = padArrayEnd(newnums, 4, 0);
        } else {
          // Down
          newnums = padArrayStart(newnums, 4, 0);
        }
        for (let i = 0; i < newnums.length; ++i) {
          this.board[i][col] = newnums[i];
        }
      }
    }
    
    this.addRandom(2);
    console.log(this.board);
  }

  getFree() {
    let ret = [];
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.board[i][j] == 0) {
          ret.push([i, j]);
        }
      }
    }
    return ret;
  }

  addRandom(num) {
    const freeSpaces = this.getFree();
    if (freeSpaces.length == 0) return;
    const idx = Math.floor(Math.random() * freeSpaces.length);
    const pos = freeSpaces[idx];
    this.board[pos[0]][pos[1]] = num;
  }

  getBoard() {
    return this.board;
  }
}

function padArrayStart(arr, len, padding){
  return Array(len - arr.length).fill(padding).concat(arr);
}

function padArrayEnd(arr, len, padding){
  return arr.concat(Array(len - arr.length).fill(padding));
}


let game = new Game();
render();


// View
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
  };
}

function rgb2html(r, g, b){
  return "rgb("+r+","+g+","+b+")";
}

function getHueForCell(n) {
  switch(n) {
    case 1: return 0.0/360.0;
    case 2: return 10.0/360.0;
    case 4: return 20.0/360.0;
    case 8: return 30.0/360.0;
    case 16: return 40.0/360.0;
    case 32: return 50.0/360.0;
    case 64: return 60.0/360.0;
    case 128: return 100.0/360.0;
    case 256: return 140.0/360.0;
    case 512: return 180.0/360.0;
    case 1024: return 240.0/360.0;
    case 2048: return 300.0/360.0;
  }
}

function render() {
  document.getElementById('game').innerHTML = '';

  game.getBoard().forEach(
    row => {
      row.forEach(
        cell => {
          const element = document.createElement('div');
          element.style.fontSize = '24pt';
          if (cell != 0) {
            const color = HSVtoRGB(getHueForCell(cell), 1.0, 1.0);
            element.style.backgroundColor = rgb2html(color.r, color.g, color.b);
            element.innerHTML = cell;
          }
          
          element.style.width = '100px';
          element.style.height = '100px';
          element.style.margin = '2px';
          element.style.verticalAlign = 'top';
          document.getElementById('game').appendChild(element);
        }
      );
    }
  );
}


// Controller
document.addEventListener('keydown', function(event) {
  console.log(event.key);
  if(event.key === 'ArrowRight') {
    game.move('right');
  }
  else if(event.key === 'ArrowDown') {
    game.move('down');
  }
  else if(event.key === 'ArrowLeft') {
    game.move('left');
  }
  else if(event.key === 'ArrowUp') {
    game.move('up');
  }
  render();
});

function restartGame() {
  console.log('HI');
  game = new Game();
  render();
}

window._exportFuncs = {restartGame};

