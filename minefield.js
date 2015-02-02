//var nohponex = nohponex || {};
minefield = {};

minefield.theme = {
    box : "#756C5D",
    box_open : "#B9BF9B",
    box_border : "rgba(8,21,78,0.45)",
    box_bomb : "#D01118",
    box_over : "rgba(8,21,78,0.45)",
    box_flag : "#F75F01",
    background : "#756C5D",
    numbers : ["", "#66CC00", "#4499DD", "#FAE13D", "#CD002F", "#C7002E", "#B5002A", "#940022"],
    dialog_gameover : "rgba(8,21,78,0.45)",
    dialog_gamewin : "rgba(48,31,68,0.45)",
    menu_title : "#B9BF9B",
    menu_sub_title : "#CD002F",
    menu_copyright : "#4499DD",
    menu_button : "#B9BF9B",
    menu_item : "#B9BF9B",
    menu_item_selected : "#F75F01"

};
//Box
minefield.Box = function(x, y) {
    this.x = x;
    this.y = y;
    this.open = false;
    this.bomb = false;
    this.flag = false;
    this.count = 0;
}
minefield.Box.prototype.getX = function() {
    return this.x;
};
minefield.Box.prototype.getY = function() {
    return this.y;
};
minefield.Box.prototype.getOpen = function() {
    return this.open;
};
minefield.Box.prototype.Open = function() {
    this.open = true;
};
minefield.Box.prototype.getBomb = function() {
    return this.bomb;
};
minefield.Box.prototype.setBomb = function(bomb) {
    this.bomb = bomb;
};
minefield.Box.prototype.getFlag = function() {
    return this.flag;
};
minefield.Box.prototype.setFlag = function(flag) {
    this.flag = flag;
};
minefield.Box.prototype.getCount = function() {
    return this.count;
};
minefield.Box.prototype.addCount = function() {++this.count;
};
//Game
minefield.Game = function(canvas) {
    if (minefield.Game.prototype._singletonInstance) {
        return minefield.Game.prototype._singletonInstance;
    }
    minefield.Game.prototype._singletonInstance = this;

    this.boxes = null;
    this.height = 15;
    this.width = 15;

    this.bombs = 5;

    this.box_height = 25;
    this.box_width = 25;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.canvas_width = canvas.width;
    this.canvas_height = canvas.height;

    this.game_over = true;
    this.show_menu = true;
    this.game_win = true;
    this.game_score = 0;

    this.is_mouse_over = false;
    this.mouse_over_x
    this.mouse_over_y

    this.mouse_over_events = false;

    this.menu_highlight = false;
    this.score_height = 30;
    this.start_time
    this.interval
    this.score_menu_position
    this.addToNeigbours = function(x, y) {
        if (x - 1 >= 0 && y - 1 >= 0)
            this.boxes[x - 1][y - 1].addCount();
        if (y - 1 >= 0)
            this.boxes[ x ][y - 1].addCount();
        if (x + 1 < this.width && y - 1 >= 0)
            this.boxes[x + 1][y - 1].addCount();
        if (x + 1 < this.width)
            this.boxes[x + 1][y].addCount();
        if (x + 1 < this.width && y + 1 < this.height)
            this.boxes[x + 1][y + 1].addCount();
        if (y + 1 < this.height)
            this.boxes[x][y + 1].addCount();
        if (x - 1 >= 0 && y + 1 < this.height)
            this.boxes[x - 1][y + 1].addCount();
        if (x - 1 >= 0)
            this.boxes[x - 1][y].addCount();
    };
    this.checkGameEnd = function() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.boxes[i][j].getBomb() && !this.boxes[i][j].getFlag()) {
                    return false;
                }
            }
        }
        return true;
    };
    this.checkForEmpty = function(x, y) {
        if (!this.boxes[x][y].getOpen() && !this.boxes[x][y].getBomb()) {
            this.boxes[x][y].Open();
        }
        if (!this.boxes[x][y].getCount()) {
            if (x - 1 >= 0 && y - 1 >= 0 && !this.boxes[x - 1][y - 1].getBomb() && !this.boxes[x - 1][y - 1].getOpen())
                this.checkForEmpty(x - 1, y - 1);
            if (y - 1 >= 0 && !this.boxes[x][y - 1].getBomb() && !this.boxes[x][y - 1].getOpen())
                this.checkForEmpty(x, y - 1);
            if (x + 1 < this.width && y - 1 >= 0 && !this.boxes[x + 1][y - 1].getBomb() && !this.boxes[x + 1][y - 1].getOpen())
                this.checkForEmpty(x + 1, y - 1);
            if (x + 1 < this.width && !this.boxes[x + 1][y].getBomb() && !this.boxes[x + 1][y].getOpen())
                this.checkForEmpty(x + 1, y);
            if (x + 1 < this.width && y + 1 < this.height && !this.boxes[x + 1][y + 1].getBomb() && !this.boxes[x +1 ][y + 1].getOpen())
                this.checkForEmpty(x + 1, y + 1);
            if (y + 1 < this.height && !this.boxes[x][y + 1].getBomb() && !this.boxes[x][y + 1].getOpen())
                this.checkForEmpty(x, y + 1);
            if (x - 1 >= 0 && y + 1 < this.height && !this.boxes[x - 1][y + 1].getBomb() && !this.boxes[x - 1][y + 1].getOpen())
                this.checkForEmpty(x - 1, y + 1);
            if (x - 1 >= 0 && !this.boxes[x - 1][y].getBomb() && !this.boxes[x - 1][y].getOpen())
                this.checkForEmpty(x - 1, y);
        }
        //return false;
    };
    this.boxClicked = function(x, y) {
        if (!this.boxes[x][y].getOpen() && !this.boxes[x][y].getFlag()) {
            this.boxes[x][y].Open();
            if (this.boxes[x][y].getBomb()) {
                //bomb
                //game over
                //
                this.game_over = true;
                //console.log("GAME OVER");
                //alert( "game over !");
            } else {
                if (!this.boxes[x][y].getCount()) {
                    this.checkForEmpty(x, y);
                }
                if (this.checkGameEnd()) {
                    this.game_win = true;
                    //console.log("You win!");
                }
            }
        }
        this.Draw();
    };
    this.boxRightClicked = function(x, y) {
        if (this.game_over) {
            return;
        }
        if (!this.boxes[x][y].getOpen()) {
            this.boxes[x][y].setFlag(!this.boxes[x][y].getFlag());
            if (this.checkGameEnd()) {
                this.game_win = true;
                //console.log("You win!");
            }
            this.Draw();
        }
    };
    this.MenuClick = function(e) {
        e.preventDefault();
        //console.log("MENU CLICK");
        //var box_x, box_y;
        var game = minefield.Game.prototype._singletonInstance;
        var mouse_position = game.MousePosition(e);
        game.MenuClicked(mouse_position[0], mouse_position[1]);
    };
    this.MenuMouseMove = function(e) {
        console.log('MenuMouseMove');
        //var box_x, box_y;
        var game = minefield.Game.prototype._singletonInstance;
        var mouse_position = game.MousePosition(e);
        game.MenuMouseMoved(mouse_position[0], mouse_position[1]);
    };
    this.MenuMouseMoved = function(x, y) {
        var selectedItem = this.MenuSelectedItem(x, y);
        if (selectedItem >= 0 && selectedItem != this.menu_highlight) {
            var game = minefield.Game.prototype._singletonInstance;

            this.menu_highlight = selectedItem;
            console.log(this.menu_highlight);
            this.DrawMenu();
            this.canvas.style.cursor = 'pointer';
            //minefield.Game[this.menu_items[ selectedItem ].action]();
            // console.log( this.menu_items[ selectedItem ]);
            //this.menu_items[ selectedItem ].action();
        } else if (selectedItem < 0 && this.menu_highlight >= 0) {
            this.menu_highlight = -1;
            this.canvas.style.cursor = 'default';
            this.DrawMenu();
        }
    };
    this.MenuSelectedItem = function(x, y) {
        var horizontal_start = 20;
        var hertical_start = this.canvas_height / 2;
        var menu_item_size = 20;
        //console.log( x + " , " + y );
        this.context.font = "bold " + menu_item_size + "px Arial";
        for (var i = 0; i < this.menu_items.length; i++) {
            var item_y = hertical_start + (i - this.menu_items.length / 2 ) * menu_item_size * 1.75;

            var width = this.context.measureText(this.menu_items[i].label).width;
            //console.log( width );
            var e = 0.05;
            var x_e = 0;
            //0.1;
            //console.log( this.context.measureText(this.menu_items[i].label) );
            if (x >= horizontal_start - x_e && x <= hertical_start + width + x_e && y >= item_y - e && y <= item_y + menu_item_size + e) {
                //console.log(this.menu_items[i].label);
                return i;
            }
        }
        return -1;
    };
    this.MenuClicked = function(x, y) {
        var selectedItem = this.MenuSelectedItem(x, y);
        if (selectedItem >= 0) {
            //minefield.Game[this.menu_items[ selectedItem ].action]();
            this.menu_items[selectedItem].action();
            this.canvas.style.cursor = 'default';
        }
    };
    this.Menu_Play = function() {
        console.log("PLAY");
        minefield.Game.prototype._singletonInstance.StartGame();
    };
    this.Menu_Settings = function() {
        console.log("SETTINGS");
    };
    this.Menu_About = function() {
        console.log("About");
        window.open('http://www.nohponex.gr', '_blank');
    };
    this.DrawMenu = function() {
        var c = this.context;
        c.clearRect(0, 0, this.canvas_width, this.canvas_height);
        c.fillStyle = minefield.theme.background;
        c.fillRect(0, 0, this.canvas_width, this.canvas_height);

        var title = 'Minefield';
        var title_sub = "by nohponex";
        var copyright = "©  NohponeX 2013";
        var quick_help = ["Quick help:", "Use left click button to open a box", "right click button to set flag"];
        c.font = "bold 28px Arial";
        c.fillStyle = minefield.theme.menu_title;
        c.textBaseline = 'top';
        c.textAlign = 'left';
        c.fillText(title, 20, 20);
        if (title_sub) {
            c.font = "18px Arial";
            c.fillStyle = minefield.theme.menu_sub_title;
            c.fillText(title_sub, 30, 50);
        }

        //var horizontal_align = left;
        var middle = 20;
        // this.canvas_width / 2;
        var center = this.canvas_height / 2;

        var menu_item_size = 20;

        var top = 70;
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        c.font = "bold " + menu_item_size + "px Arial";
        for (var i = 0; i < this.menu_items.length; i++) {
            var y = center + (i - this.menu_items.length / 2 ) * menu_item_size * 1.75;

            if (this.menu_highlight >= 0 && this.menu_highlight == i) {
                c.fillStyle = minefield.theme.menu_item_selected;
            } else {
                c.fillStyle = minefield.theme.menu_item;
            }
            c.fillText(this.menu_items[i].label, middle, y);
        }
        if (quick_help) {
            //var width  = c.measureText( quick_help ).width;
            c.font = "italic 14px Arial";
            c.fillStyle = minefield.theme.menu_item_selected;
            for (var i = 0; i < quick_help.length; i++) {
                c.fillText(quick_help[i], 20, this.canvas_height - 14 * (quick_help.length - i) - 30);
            }
        }
        if (copyright) {
            c.fillStyle = minefield.theme.menu_copyright;
            c.textAlign = 'left';
            c.font = "12px Arial";
            c.fillText(copyright, 20, this.canvas_height - 20);
        }
        if (this.running_game) {

        }

    };
    this.StartGame = function() {
        this.Initialize();
        this.running_game = true
        this.game_over = false;
        this.show_menu = false;
        this.game_win = false;
        this.game_score = 0;
        this.flags = 0;
        //remove listeners

        this.canvas.removeEventListener('click', this.MenuClick);
        $(this.canvas).off('contextmenu');
        //, this.canvas, this.MenuClick);
        this.canvas.removeEventListener('mousemove', this.MenuMouseMove);

        this.canvas.addEventListener('click', this.Click, false);
        $(this.canvas).on('contextmenu', canvas, this.RightClick);
        this.canvas.addEventListener('mousemove', this.MouseMove, false);
        //

        //Jquery
        //$('#canvas').on('mouseover', canvas, game.MouseOver);

        if (this.mouse_over_events) {
            this.canvas.addEventListener('mousemove', this.MouseMove, false);
            this.canvas.addEventListener('mouseover', this.MouseOver, false);
            this.canvas.addEventListener('mouseout', this.MouseOut, false);
        }
        this.start_time = new Date();
        this.interval = setInterval(this.DrawMenuBar, 1000);
        this.Draw();
    };
    this.ShowMenu = function(running) {
        console.log("SHOW MENU");
        clearInterval(this.interval);

        this.show_menu = true;

        this.running_game = running;
        console.log(running);
        if (running && this.menu_items[0].label != this.menu_items_continue.label) {
            this.menu_items.unshift(this.menu_items_continue);
        }
        if (!running && this.menu_items[0].label == this.menu_items_continue.label) {
            this.menu_items.shift();
        }
        this.DrawMenu();
        this.canvas.removeEventListener('click', this.Click, false);
        $(this.canvas).off('contextmenu');
        this.canvas.removeEventListener('mousemove', this.MouseMove, false);

        this.canvas.addEventListener('click', this.MenuClick, false);
        $(this.canvas).on('contextmenu');
        this.canvas.addEventListener('mousemove', this.MenuMouseMove, false);

    };
    this.ContinueGame = function() {
        if (this !== minefield.Game.prototype._singletonInstance) {
            minefield.Game.prototype._singletonInstance.ContinueGame();
            return;
        }
        console.log("CONTINUE GAME");
        this.interval = setInterval(this.DrawMenuBar, 1000);
        this.show_menu = false;
        this.canvas.removeEventListener('click', this.MenuClick);
        $(this.canvas).off('contextmenu');
        //, this.canvas, this.MenuClick);
        this.canvas.removeEventListener('mousemove', this.MenuMouseMove);

        this.canvas.addEventListener('click', this.Click, false);
        $(this.canvas).on('contextmenu', canvas, this.RightClick);
        this.canvas.addEventListener('mousemove', this.MouseMove, false);
        //

        //Jquery
        //$('#canvas').on('mouseover', canvas, game.MouseOver);

        if (this.mouse_over_events) {
            this.canvas.addEventListener('mousemove', this.MouseMove, false);
            this.canvas.addEventListener('mouseover', this.MouseOver, false);
            this.canvas.addEventListener('mouseout', this.MouseOut, false);
        }
        this.Draw();
    };
    this.DrawMenuBar = function() {
        if (this !== minefield.Game.prototype._singletonInstance) {
            minefield.Game.prototype._singletonInstance.DrawMenuBar();
            return;
        }
        var c = this.context;

        //menu
        c.fillStyle = minefield.theme.background;

        c.fillRect(0, 0, this.canvas_width, this.score_height);
        c.fillStyle = minefield.theme.menu_title;
        c.font = "Bold 16px Arial";
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        var menu_width = c.measureText('Menu').width;

        c.fillText('Menu', 10, this.score_height / 2);
        c.fillText('New', 25 + menu_width, this.score_height / 2);

        var now = new Date();
        var diff = now - this.start_time;
        c.font = "Bold 14px Arial";
        if (!this.game_over && !this.game_win) {
            this.game_score = Math.floor(diff / 1000);
        }
        c.fillText('Time : ' + this.game_score, this.canvas_width / 3, this.score_height / 2);

        c.fillStyle = minefield.theme.menu_title;
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        c.font = "14px Arial";
        c.fillText('Found : ' + this.flags + '/' + this.bombs, this.canvas_width / 1.5, this.score_height / 2);
        if (this.game_over || this.game_win) {
            clearInterval(this.interval);
        }
    };
    this.Draw = function() {
        if (this !== minefield.Game.prototype._singletonInstance) {
            minefield.Game.prototype._singletonInstance.Draw();
            return;
        }
        var c = this.context;
        c.clearRect(0, 0, this.canvas_width, this.canvas_height);

        this.flags = 0;
        var ratio = (this.box_height / 30 );
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                c.fillStyle = minefield.theme.box;
                if (this.boxes[i][j].getOpen()) {
                    c.fillStyle = minefield.theme.box_open;
                    /*if (this.boxes[i][j].getBomb()) {
                     //c.fillStyle = minefield.theme.box_bomb;
                     }*/
                    /*} else if (this.boxes[i][j].getFlag()) {
                     // c.fillStyle = minefield.theme.box_flag;*/
                } else if (this.is_mouse_over && i == this.mouse_over_x && j == this.mouse_over_y) {
                    c.fillStyle = minefield.theme.box_over;
                }

                c.fillRect(this.box_width * i + 0.5 * ratio, this.score_height + this.box_height * j + 0.5 * ratio, this.box_width - 1 * ratio, this.box_height - 1 * ratio);
                c.strokeStyle = minefield.theme.box_border;
                c.lineWidth = 1 * ratio;
                c.strokeRect(this.box_width * i + 2 * ratio, this.score_height + this.box_height * j + 2 * ratio, this.box_width - 4 * ratio, this.box_height - 4 * ratio);
                if (this.boxes[i][j].getOpen() && !this.boxes[i][j].getBomb() && this.boxes[i][j].getCount()) {
                    var count = this.boxes[i][j].getCount();
                    c.fillStyle = minefield.theme.numbers[count];
                    c.font = "bold " + this.box_height * 0.8 + "px Arial";
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillText(count, this.box_width * (i + 0.5 ), this.score_height + this.box_height * (j + 0.5));
                } else if (this.boxes[i][j].getFlag()) {
                    this.flags++;
                    c.fillStyle = minefield.theme.box_flag;
                    c.font = "italic " + this.box_height * 0.85 + "px Arial";
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillText('⚑', this.box_width * (i + 0.5 ), this.score_height + this.box_height * (j + 0.5));
                } else if (this.boxes[i][j].getBomb() && this.boxes[i][j].getOpen()) {
                    c.fillStyle = minefield.theme.box_bomb;
                    c.font = this.box_height * 0.85 + "px Arial";
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillText('☠', this.box_width * (i + 0.5 ), this.score_height + this.box_height * (j + 0.5));
                }
            }
        }
        /*
         c.fillStyle = minefield.theme.menu_title;
         c.textAlign = 'left';
         c.textBaseline = 'middle';
         c.font = "14px Arial";
         c.fillText('Found : ' + this.flags + '/' + this.bombs, this.canvas_width / 1.5, this.score_height / 2);
         */
        this.DrawMenuBar();
        if (this.game_over) {
            c.fillStyle = minefield.theme.dialog_gameover;
            var height = 100;
            var width = 200;
            c.fillRect(this.canvas_width / 2 - width / 2, this.canvas_height / 2 - height / 2, width, height);
            c.fillStyle = minefield.theme.menu_title;
            c.font = "16px Arial";
            c.textAlign = 'center';
            c.textBaseline = 'middle';

            c.fillText('Game over !', this.canvas_width / 2, this.canvas_height / 2);
            clearInterval(this.interval);

            this.running_game = false;
        } else if (this.game_win) {
            c.fillStyle = minefield.theme.dialog_gamewin;
            var height = 100;
            var width = 200;
            c.fillRect(this.canvas_width / 2 - width / 2, this.canvas_height / 2 - height / 2, width, height);
            c.fillStyle = minefield.theme.menu_title;
            c.font = "16px Arial";
            c.textAlign = 'center';
            c.textBaseline = 'middle';

            c.fillText('You win ! score ' + this.game_score, this.canvas_width / 2, this.canvas_height / 2);
            clearInterval(this.interval);
            this.running_game = false;
        }

    };
    this.MouseOver = function(e) {
        var game = minefield.Game.prototype._singletonInstance;
        game.is_mouse_over = true;
        //game.Draw();
    };
    this.MouseOut = function(e) {
        var game = minefield.Game.prototype._singletonInstance;
        game.is_mouse_over = false;
        //game.Draw();
    };
    this.MousePosition = function(e) {
        var x;
        var y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var element = (e.srcElement ? e.srcElement : e.target);
        x -= element.offsetLeft;
        y -= element.offsetTop;
        return [x, y];
    };
    this.MouseMove = function(e) {
        var box_x, box_y;
        var game = minefield.Game.prototype._singletonInstance;
        if (game.game_over) {
            return;
        }
        var mouse_position = game.MousePosition(e);
        box_x = Math.floor(mouse_position[0] / game.box_width);
        box_y = Math.floor((mouse_position[1] - game.score_height) / game.box_height);
        if (box_x >= 0 && box_x < game.width && box_y >= 0 && box_y < game.height) {
            //!game.boxes[box_x][box_y].getOpen() &&
            if ((game.mouse_over_x != box_x || game.mouse_over_y != box_y)) {
                game.mouse_over_x = box_x;
                game.mouse_over_y = box_y;
                game.Draw();
            }
        }
    };
    this.Click = function(e) {
        var box_x, box_y;
        var game = minefield.Game.prototype._singletonInstance;

        var mouse_position = game.MousePosition(e);
        if (mouse_position[1] < game.score_height) {
            //
            console.log("menu bar clicked");
            if (mouse_position[1] >= game.score_height / 2 - 10 && mouse_position[1] <= game.score_height / 2 + 10) {
                var menu_width = game.context.measureText('Menu').width;
                if (mouse_position[0] >= 10 && mouse_position[0] <= 10 + menu_width) {
                    game.ShowMenu(game.game_over == false && game.game_win == false);
                    console.log('menu');
                } else if (mouse_position[0] >= 25 + menu_width && mouse_position[0] <= 25 + menu_width + game.context.measureText('New').width) {
                    console.log('new');
                    game.StartGame();
                }
            }

            //this.score_menu_position= [ [20, this.score_height / 2 - 8], [ 20 + this.canvas.measureText('➦ Menu').width, this.score_height / 2 + 8 ] ];
        } else if (game.game_over || game.game_win) {
            return;
        }
        box_x = Math.floor(mouse_position[0] / game.box_width);
        box_y = Math.floor((mouse_position[1] - game.score_height) / game.box_height);
        if (box_x >= 0 && box_x < game.width && box_y >= 0 && box_y < game.height) {
            game.boxClicked(box_x, box_y);
        }
    };
    this.RightClick = function(e) {
        e.preventDefault();
        var game = minefield.Game.prototype._singletonInstance;
        if (game.game_over || game.game_win) {
            return;
        }
        var box_x, box_y;
        var mouse_position = game.MousePosition(e);
        box_x = Math.floor(mouse_position[0] / game.box_width);
        box_y = Math.floor((mouse_position[1] - game.score_height) / game.box_height);
        if (box_x >= 0 && box_x < game.width && box_y >= 0 && box_y < game.height) {
            game.boxRightClicked(box_x, box_y);
        }
    };
    /*canvas.addEventListener('click', this.Click, false);
     $(canvas).on('contextmenu', canvas, this.RightClick);
     //Jquery
     //$('#canvas').on('mouseover', canvas, game.MouseOver);

     if (this.mouse_over_events) {
     canvas.addEventListener('mousemove', this.MouseMove, false);
     canvas.addEventListener('mouseover', this.MouseOver, false);
     canvas.addEventListener('mouseout', this.MouseOut, false);
     }*/
    this.Initialize = function() {
        this.box_width = this.canvas_width / this.width;
        this.box_height = (this.canvas_height - this.score_height) / this.height;
        this.boxes = new Array(this.width);
        for (var i = 0; i < this.width; i++) {
            this.boxes[i] = new Array(this.height);
            for (var j = 0; j < this.height; j++) {
                this.boxes[i][j] = new minefield.Box(i, j);
            }
        }
        var b = 0;
        var x, y;
        while (b < this.bombs) {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
            if (!this.boxes[x][y].getBomb()) {
                this.boxes[x][y].setBomb(true);
                this.addToNeigbours(x, y);
                b++;
            }
        }
        //this.Draw();
        //this.DrawMenu();
        //this.context.setMouseover( this.MouseOver );
    };

    this.menu_items = [{
        label : 'Play',
        action : this.Menu_Play
    }, {
        label : 'Settings',
        action : this.Menu_Settings
    }, {
        label : 'About',
        action : this.Menu_About
    }];
    this.menu_items_continue = {
        label : 'Continue',
        action : this.ContinueGame
    };
    //this.canvas.addEventListener('click', this.MenuClick, false);
    //$(this.canvas).on('contextmenu', this.canvas, this.MenuClick);
    //this.canvas.addEventListener('mousemove', this.MenuMouseMove, false);
    this.ShowMenu(false);
    this.DrawMenu();
}
/*minefield.Game.prototype.
 };*/

$(document).ready(function() {
    //alert( minefield.theme.box );

    //Canvas stuff
    var canvas = $("#canvas")[0];
    //var context = canvas.getContext("2d");
    //var width = $("#canvas").width();
    //var height = $("#canvas").height();

    //var XXX = new minefield.Box(3, 3);
    var game = new minefield.Game(canvas);
    /*canvas.addEventListener('click', game.Click, false);
    $('#canvas').on('contextmenu', canvas, game.RightClick);
    //$('#canvas').on('mouseover', canvas, game.MouseOver);
    canvas.addEventListener('mousemove', game.MouseMove, false);
    canvas.addEventListener('mouseover', game.MouseOver, false);
    canvas.addEventListener('mouseout', game.MouseOut, false);*/
    //$('#canvas').on('onmousemove', canvas, game.MouseMove);
    //$('#canvas').on('mouseleave', canvas, game.MouseLeave);
    // function(e){ console.log(e); return false; });
    //game.Initialize();

    //console.log(XXX.getX());
    //console.log(game.getScore());

    /*ctx.fillRect(50,50,300,300);
     ctx.fillStyle = "black";
     ctx.strokeStyle = "black";
     ctx.fillText( "score_text" , 30, 30);
     console.log("test");*/
});
