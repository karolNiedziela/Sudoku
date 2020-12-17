const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "-4--1-7-35729-----1-6-42--8-5--34----84---63----16--5-3--52-4-9-----82678-9-7--1-",
    "-1-----359--3-5--4-75-91--8----1768---96-47---6352----6--28-51-8--7-6--923-----4-",
    "---6395---75--2--94-3-7--82546--7-2---74-39---8-2--41796--2-3-82--9--75---8314---"
];

const easySolution = [
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298",
    "948615723572983146136742598651834972784259631293167854367521489415398267829476315",
    "416872935928365174375491268542917683189634752763528491694283517851746329237159846",
    "812639574675842139493571682546197823127483965389256417961725348234968751758314296"
];

const medium = [
    "---8---35-----7--9-5---34-7--236-----3--9--7-----483--7-41---9-8--5-----51---6---",
    "-8------7-7-51-6-----3--15-9--2-176-----------276-3--9-94--5-----3-69-8-8------1-",
    "-7--23-----8-5---456--8-3--8----14--45-----21--62----5--2-9--861---6-9-----31--4-",
    "32-86-71----1----81--32---6--9---54--3-----2--41---3--6---74--59----3----52-86-73"
];

const mediumSolution = [
    "247819635386457219951623487472361958638295174195748326764182593826534761513976842",
    "581926437372514698649378152958241763436897521127653849294185376713469285865732914",
    "974623518238157694561984372823571469459836721716249835342795186187462953695318247",
    "325869714796145238184327956269738541837451629541692387613274895978513462452986173"
];

const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "--47---98-----4-3--8---3--536---87----5---9----71---566--8---4--2-6-----49---26--",
    "--8-9-4-2---5-6------28---12----38---8--6--4---79----34---28------3-9---3-9-4-1--",
    "-5---1-8--7--9----6--3--4----14------936-854------52----9--3--2----8--6--3-7---1-"

];

const hardSolution = [
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
    "134765298956284137782913465369528714815476923247139856673891542521647389498352671",
    "638197452124536978975284361216473895593861247847952613451628739762319584389745126",
    "954261783372894156618357429581432697293678541746915238169543872427189365835726914"
];

var timer;
var timeRemaining;
var pause;
var errors;
var disableSelect;
var selectedCell;
var selectedNumber;
var randomNumber;
var solution;
var hints;

window.onload = function() {
    id("play-btn").addEventListener('click', startGame);
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function() {
            if (!disableSelect) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNumber = null;
                } else {
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }

                    this.classList.add("selected");
                    selectedNumber = this;
                    updateMove();
                }
            }
        });
    }

    if (hints === 0) {
        id("hints").text = "No hints";
        id("hint-btn").hidden = true;
    }
}

function startGame() {
    randomNumber = getRandomInt(0, easy.length);
    let board;
    if (id("diff-1").checked)
        board = easy[randomNumber];
    else if (id("diff-2").checked)
        board = medium[randomNumber];
    else
        board = hard[randomNumber];

    errors = 5;
    hints = 3;
    pause = false;
    disableSelect = false;

    id("errors").textContent = "Errors remaining: " + errors;
    id("hints").textContent = "Hints remaining: " + hints;

    if (id("diff-1").checked)
        solution = easySolution[randomNumber];
    else if (id("diff-2").checked)
        solution = mediumSolution[randomNumber];
    else
        solution = hard[1];

    generateBoard(board);

    startTimer();

    id("features").removeAttribute("hidden");
    id("hint-btn").removeAttribute("hidden");
    id('pause-btn').addEventListener('click', pauseTimer);
    id('hint-btn').addEventListener('click', hint);

    id("number-container").removeAttribute("hidden");
}

function generateBoard(board) {
    clearPrevious();

    let idCount = 0;

    for (let i = 0; i < 81; i++) {
        let cell = document.createElement("p");
        if (board.charAt(i) != "-") {
            cell.textContent = board.charAt(i);

        } else {
            cell.classList.add("cell-empty");
            cell.addEventListener("click", function() {
                if (!disableSelect) {
                    if (cell.classList.contains("selected")) {
                        cell.classList.remove("selected");
                        selectedCell = null;
                    } else {
                        for (let i = 0; i < 81; i++) {
                            document.querySelectorAll(".cell")[i].classList.remove("selected");
                        }

                        cell.classList.add("selected");
                        selectedCell = cell;
                        updateMove();
                    }
                }
            });
        }

        cell.id = idCount;
        idCount++;

        cell.classList.add("cell");

        if ((cell.id > 17 && cell.id < 27) || (cell.id > 44 && cell.id < 54)) {
            cell.classList.add("bottomBorder");
        }
        if ((cell.id + 1) % 9 == 3 || (cell.id + 1) % 9 == 6) {
            cell.classList.add("rightBorder");
        }

        id("board").appendChild(cell);
    }
}

function updateMove() {
    if (selectedCell && selectedNumber) {
        selectedCell.textContent = selectedNumber.textContent;
        if (checkCorrect(selectedCell)) {
            selectedCell.classList.remove("selected");
            selectedCell.classList.remove("cell-empty");
            selectedNumber.classList.remove("selected");
            selectedNumber = null;
            selectedCell = null;

            if (checkDone()) {
                endGame();
            }
        } else {
            disableSelect = true;
            selectedCell.classList.add("incorrect");

            setTimeout(function() {
                errors--;
                if (errors === 0)
                    endGame();
                else {
                    id("errors").textContent = "Errors remaining: " + errors;
                    disableSelect = false;
                }

                selectedCell.classList.remove("incorrect");
                selectedCell.classList.remove("selected");
                selectedNumber.classList.remove("selected");

                selectedCell.textContent = "";
                selectedCell = null;
                selectedNumber = null;
            }, 1000);
        }
    }
}

function checkDone() {
    let cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === "")
            return false;
    }

    return true;
}

function hint() {
    var emptyCell = false;
    let cells = document.querySelectorAll(".cell");

    while (emptyCell != true) {
        let randomHintNumber = getRandomInt(0, cells.length);
        if (cells[randomHintNumber].textContent === '') {
            cells[randomHintNumber].textContent = solution.charAt(randomHintNumber);
            emptyCell = true;
            hints--;
            cells[randomHintNumber].classList.add("hinted");

            setTimeout(function() {
                cells[randomHintNumber].classList.remove("hinted");
                cells[randomHintNumber].classList.remove("cell-empty");
            }, 1500);

            id("hints").textContent = "Hints remaining: " + hints;

            if (hints === 0) {
                id("hints").text = "No hints";
                id("hint-btn").hidden = true;
            }
        }
    }

    if (checkDone()) {
        endGame();
    }
}

function checkCorrect(cell) {
    if (solution.charAt(cell.id) === cell.textContent)
        return true;
    else
        return false;
}

function endGame() {
    disableSelect = true;
    clearTimeout(timer);

    if (errors === 0 || timer === 0) {
        id("errors").textContent = "You Lost!";
    } else {
        id("errors").textContent = "You Won!";
        id("features").hidden = true;
    }
}



function clearPrevious() {
    let cells = document.querySelectorAll(".cell");

    for (let i = 0; i < cells.length; i++) {
        cells[i].remove();
    }

    if (timer)
        clearTimeout(timer);

    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }


    selectedCell = null;
    selectedNumber = null;
}

function startTimer() {
    if (id("time-1").checked)
        timeRemaining = 420;
    else if (id("time-2").checked)
        timeRemaining = 900;
    else
        timeRemaining = 1200;

    id("timer").textContent = "Time left: " + timeConversion(timeRemaining);

    timer = setInterval(function() {
        timeRemaining--;
        if (timeRemaining === 0)
            endGame();

        id("timer").textContent = "Time left: " + timeConversion(timeRemaining);
    }, 1000);
}

function pauseTimer() {
    if (!pause) {
        clearTimeout(timer);
        id("timer").textContent = "Time paused: " + timeConversion(timeRemaining);
        id("pause-btn").textContent = "Unpause";
        pause = true;
        disableSelect = true;
    } else {
        timer = setInterval(function() {
            timeRemaining--;
            if (timeRemaining === 0)
                endGame();

            id("timer").textContent = "Time left: " + timeConversion(timeRemaining);
        }, 1000);

        id("pause-btn").textContent = "Pause";
        pause = false;
        disableSelect = false;
    }

}

function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10)
        minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10)
        seconds = "0" + seconds;

    return minutes + ":" + seconds;
}

function id(id) {
    return document.getElementById(id);
}

function info() {
    if (id("info").classList.contains("info-hidden")) {
        id("info").classList.remove("info-hidden");
    } else {
        id("info").classList.add("info-hidden");
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}