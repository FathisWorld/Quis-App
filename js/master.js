let quesCount = document.querySelector(".count span");
let spansCon = document.querySelector(".spans");
let quisArea = document.querySelector(".quis-area");
let answersArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit");
let bulltsS = document.querySelector(".bulets");
let results = document.querySelector(".results");
let countDoun = document.querySelector(".countDoun");

let Qindex = 0;
let rightAnswers = 0;
let countDownInterval;


function getQuestions() {
    let myQues = new XMLHttpRequest();
    myQues.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let quesObject = JSON.parse(this.responseText);
            let quesCount = quesObject.length;
            quesCountf(quesCount);
            spansCount(quesCount);
            addQCount(quesObject[Qindex], quesCount);

            countDown(6, quesCount);

            submit.onclick = () => {
                let rAnswer = quesObject[Qindex].right_answer;
                Qindex++;
                checkAnswers(rAnswer, quesCount);
                quisArea.innerHTML = "";
                answersArea.innerHTML = "";
                addQCount(quesObject[Qindex], quesCount);
                handelSpans();
                clearInterval(countDownInterval);
                countDown(6, quesCount);
                showRes(quesCount)
            }
        }
    }

    myQues.open("get", "quis.json", true);
    myQues.send();
}

getQuestions();

function quesCountf(num) {
    quesCount.innerHTML = num;
}

function spansCount(num) {
    for (let c = 0; c < num; c++) {
        let spans = document.createElement("span");

        if (c === 0) {
            spans.className = "active";
        };

        spansCon.appendChild(spans);
    }
}

function addQCount(opj, count) {
    if (Qindex < count) {
        let Qh2 = document.createElement("h2");
        let Qh2Text = document.createTextNode(opj.title);
        Qh2.appendChild(Qh2Text);
        quisArea.prepend(Qh2);

        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            let radioBtn = document.createElement("input");
            radioBtn.name = "questions";
            radioBtn.type = "radio";
            radioBtn.id = `answer_${i}`;
            radioBtn.dataset.answer = opj[`answer_${i}`];

            if (i === 1) {
                radioBtn.checked = true;
            }

            let labl = document.createElement("label");
            labl.style.marginRight = "10px"
            labl.htmlFor = `answer_${i}`
            let lblText = document.createTextNode(opj[`answer_${i}`]);

            labl.appendChild(lblText);

            mainDiv.appendChild(radioBtn);
            mainDiv.appendChild(labl);
            answersArea.appendChild(mainDiv)
        }
    }
}

function checkAnswers(rq, count) {
    let answers = document.getElementsByName("questions");
    let theCanswer;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            theCanswer = answers[i].dataset.answer;
            if (rq === theCanswer) {
                rightAnswers++;
                console.log("good")
            }
        }

    }
}

function handelSpans() {
    let bulltsSpans = document.querySelectorAll(".bulets .spans span");
    let arrOfSpans = Array.from(bulltsSpans);
    arrOfSpans.forEach((span, index) => {
        if (Qindex === index) {
            span.className = "active";
        }
    })
}

function showRes(count) {
    let theRes;
    if (Qindex === count) {
        quisArea.remove();
        answersArea.remove();
        submit.remove();
        bulltsS.remove()
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theRes = `Your Score Is ${rightAnswers} From ${count} (Good answers)`
        } else if (rightAnswers === count) {
            let per = document.createElement("span");
            per.className = "perfect";
            let perT = document.createTextNode("Perfect ");
            per.appendChild(perT);
            theRes = `  All answers is Correct Your Score is ${rightAnswers} From ${count}`
            results.appendChild(per);
            results.style.width = "458px";
        } else {
            theRes = `${rightAnswers} from ${count} (Try Again)`
        }
        let resT = document.createTextNode(theRes);
        results.appendChild(resT);
        results.style.display = "flex";
    };
}

function countDown(du, count) {
    if (Qindex < count) {
        let min, sec;
        countDownInterval = setInterval(() => {
            min = parseInt(du / 60);
            sec = parseInt(du % 60);
            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;
            countDoun.innerHTML = `${min} : ${sec}`

            if (--du < 0) {
                clearInterval(countDownInterval);
                submit.onclick();
            };
        }, 1000);
    };
};