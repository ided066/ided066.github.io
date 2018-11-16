
function Category (name, label, inputMethod) {
    this.name = name;
    this.label = label;
    this.showLabel = function(td) {
        td.textContent = label;
    }
    this.inputMethod = inputMethod;
}
function InputNumber (min, max, defaultValue) {
    this.min = min;
    this.max = max;
    this.defaultValue = (defaultValue == null) ? 0 : defaultValue;
    this.set = function (td) {
        var input = document.createElement("input");
        input.setAttribute("type", "number");
        if(min != null) {
            input.setAttribute("min", min);
            if(defaultValue < min) {
                defaultValue = min;
            }
        }
        if(max != null) {
            input.setAttribute("max", max);
            if(defaultValue > max) {
                defaultValue = max;
            }
        }
        if(defaultValue != null) {
            input.setAttribute("value", defaultValue);
        }
        td.appendChild(input);
        return input;
    }
}
var categories = [
    new Category("fields", "畑", new InputNumber(0, null, 0)),
    new Category("pastures", "柵", new InputNumber(0, null, 0)),
    new Category("grain", "小麦", new InputNumber(0, null, 0)),
    new Category("vegetables", "野菜", new InputNumber(0, null, 0)),
    new Category("sheep", "羊", new InputNumber(0, null, 0)),
    new Category("wildBoar", "豚", new InputNumber(0, null, 0)),
    new Category("catle", "牛", new InputNumber(0, null, 0)),
    new Category("unusedFarmyardSpaces", "未使用スペース", new InputNumber(0, 13, 0)),
    new Category("fencedStables", "柵で囲われた厩", new InputNumber(0, 4, 0)),
    new Category("roomNumber", "部屋数", new InputNumber(2, null, 2)),
    new Category("hutsHouses", "家の種類", new InputNumber(0, 2, 0)),
    new Category("familyMembers", "家族の人数", new InputNumber(2, 5, 2)),
    new Category("pointsForCards", "カード点", new InputNumber(0, null, 0)),
    new Category("bonusPoints", "ボーナス", new InputNumber(0, null, 0)),
    new Category("total", "総合", new InputNumber(null, null, 0))
];
var RoomType = {
    Wood : 0,
    Cray : 1,
    Stone : 2
};
function Farm() {
    this.name = "playerXX"
    this.fields = 0;
    this.pastures = 0;
    this.grain = 0;
    this.vegitables = 0;
    this.sheep = 0;
    this.wildBoar = 0;
    this.catle = 0;
    this.unusedFarmyardSpace = 0;
    this.fencedStables = 0;
    this.roomNumber = 2;
    this.hutsHouses = RoomType.Wood;
    this.familyMembers = 2;
    this.pointsForCards = 0;
    this.bonusPoints = 0;
    this.total = 0;
    this.totalDisp = null;
    this.calcTotal = function () {
        this.total = 0;
        if(this.fields < 2) {
            this.total -= 1;
        } else {
            this.total += this.fields-1;
        }
        if(this.pastures == 0) {
            this.total -= 1;
        } else {
            this.total += Math.min(this.pastures, 4);
        }
        if(this.grain == 0) {
            this.total -= 1;
        } else {
            this.total += Math.min(Math.ceil((this.grain-1)/2), 4);
        }
        if(this.vegitables == 0) {
            this.total -= 1;
        } else {
            this.total += Math.min(this.vegitables, 4);
        }
        if(this.sheep == 0) {
            this.total -= 1;
        } else {
            this.total += Math.min(Math.ceil((this.sheep-1)/2), 4);
        }
        if(this.wildBoar == 0) {
            this.total -= 1;
        } else {
            this.total += Math.min(Math.ceil((this.wildBoar)/2), 4);
        }
        if(this.catle == 0) {
            this.total -= 1;
        } else {
            this.total += Math.min(Math.ceil((this.catle+1)/2), 4);
        }
        this.total -= this.unusedFarmyardSpace;
        this.total += this.fencedStables;
        this.total += this.roomNumber*this.hutsHouses;
        this.total += this.familyMembers*3;
        this.total += this.pointsForCards;
        this.total += this.bonusPoints;
        this.totalDisp.value = this.total;
    }
    this.dump = function () {
        console.log(this.name);
        for(var i = 0; i < categories.length; ++i) {
            console.log(categories[i].name+":"+this[categories[i].name]);
        }
    }
}
function setValue(obj, name, value) {
    obj[name] = value;
}

function Game() {
    this.farms = [];
    this.createBase = function() {
        var p = document.createElement("p");
        this.table = document.createElement("table");
        p.appendChild(this.table);
        var input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", "計算");
        input.onclick = this.calcTotal;
        p.appendChild(input);
        var root = document.getElementById("games");
        root.appendChild(p);
    }
    this.makeTable = function (row, column) {
        var table = this.table;
        var farms = this.farms;
        for(i = 0; i < row-1; ++i) {
            farms.push(new Farm());
            farms[i].name = "player"+(i+1);
        }
        for(var j = 0; j < column+1; ++j) {
            var tr = document.createElement("tr");
            for(var i = 0; i < row; ++i) {
                if(j == 0) {
                    var th = document.createElement("th");
                    if(i == 0) {
                        th.textContent = "";
                    } else {
                        var input = document.createElement("input");
                        input.setAttribute("type", "text");
                        input.setAttribute("name", "player"+(i+1));
                        input.setAttribute("list", "playerList");
                        th.appendChild(input);
                        (function () {
                            var farm = farms[i-1];
                            input.onchange = function () {
                                farm["name"] = this.value;
                            };}());
        
                    }
                    tr.appendChild(th);
                } else {
                    var td = document.createElement("td");
                    if(i == 0) {
                        categories[j-1].showLabel(td);
                    } else {
                        var input = categories[j-1].inputMethod.set(td);
                        (function () {
                        var farm = farms[i-1];
                        var name = categories[j-1].name;
                        console.log(categories[j-1].name);
                        input.onchange = function () {
                            farm[name] = this.value;
                        };}());
                        if(j == column) {
                            farms[i-1].totalDisp = input;
                        }
                    }
                    tr.appendChild(td);
                }
            }
            table.appendChild(tr);
        }
    }
    this.calcTotal = function () {
        var farms = this.farms;
        for(var i = 0; i < farms.length; ++i) {
            farms[i].calcTotal();
        }
        farms[0].dump();
    }
        
}


function init() {
    newGame();
}

init();



function newGame() {
    var game = new Game();
    game.createBase();
    game.makeTable(5+1, categories.length+1);
}
