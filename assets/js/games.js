(function(){'use strict';const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);let active='catch';const panel=$('#gamePanel');const games={catch:renderCatch,debug:renderDebug,stack:renderStack,bug:renderBug};$$('.game-tab').forEach(b=>b.addEventListener('click',()=>{$$('.game-tab').forEach(x=>x.classList.toggle('active',x===b));active=b.dataset.game;games[active]()}));
function renderCatch(){panel.innerHTML=`<div class="game-intro"><div class="game-icon">⌁</div><div><h3>Code Catcher</h3><p>Catch HTML, CSS, PHP, JS and SQL; dodge the bugs. Use ← → or A / D.</p></div><button class="btn-glow" id="startCatch">START GAME ↗</button></div><canvas id="catchCanvas" width="850" height="330"></canvas><div class="game-hud"><span>Score <b id="catchScore">0</b></span><span>Time <b id="catchTime">30</b>s</span><span>Best <b id="catchBest">${localStorage.getItem('sherinCatchBest')||0}</b></span><button id="pauseCatch">Ⅱ Pause</button></div><div class="touch-controls"><button id="moveLeft">←</button><button id="moveRight">→</button></div>`;const canvas=$('#catchCanvas'),ctx=canvas.getContext('2d');let running=false,paused=false,score=0,time=30,last=0,spawn=0,items=[],keys={},player=425,raf,timer;const symbols=['PHP','JS','CSS','HTML','SQL','BUG'];function start(){cancelAnimationFrame(raf);clearInterval(timer);running=true;paused=false;score=0;time=30;spawn=0;items=[];player=425;last=performance.now();$('#catchScore').textContent=0;$('#catchTime').textContent=30;$('#pauseCatch').textContent='Ⅱ Pause';timer=setInterval(()=>{if(!paused&&running){time--;$('#catchTime').textContent=time;if(time<=0)end()}},1000);loop(last)}function end(){running=false;clearInterval(timer);cancelAnimationFrame(raf);let best=+localStorage.getItem('sherinCatchBest')||0;if(score>best){best=score;localStorage.setItem('sherinCatchBest',best)}$('#catchBest').textContent=best;draw();ctx.fillStyle='#09070ddd';ctx.fillRect(0,0,850,330);ctx.fillStyle='#ffb06b';ctx.textAlign='center';ctx.font='bold 30px sans-serif';ctx.fillText('TIME UP!',425,145);ctx.fillStyle='white';ctx.font='16px sans-serif';ctx.fillText('You collected '+score+' code symbols',425,180);ctx.font='12px sans-serif';ctx.fillText('Press START GAME to try again',425,210)}function draw(){ctx.clearRect(0,0,850,330);ctx.strokeStyle='#52336e';ctx.lineWidth=1;for(let x=0;x<850;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,330);ctx.stroke()}for(let y=0;y<330;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(850,y);ctx.stroke()}ctx.fillStyle='#b58aff';ctx.fillRect(player-27,285,54,12);ctx.fillStyle='#ff9b56';ctx.fillRect(player-15,274,30,13);ctx.fillStyle='#fff';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('SP',player,294);items.forEach(o=>{ctx.fillStyle=o.bad?'#ff745e':'#c49bff';ctx.beginPath();ctx.roundRect(o.x-22,o.y-14,44,28,8);ctx.fill();ctx.fillStyle='#170d22';ctx.font='bold 11px monospace';ctx.fillText(o.s,o.x,o.y+4)})}function loop(now){if(!running)return;raf=requestAnimationFrame(loop);if(paused){draw();return}const dt=Math.min((now-last)/16,2);last=now;player=Math.max(30,Math.min(820,player+((keys.ArrowLeft||keys.a?-1:0)+(keys.ArrowRight||keys.d?1:0))*6*dt));spawn+=dt;if(spawn>34){spawn=0;let s=symbols[Math.floor(Math.random()*symbols.length)];items.push({x:25+Math.random()*800,y:-20,s,bad:s==='BUG',v:2+Math.random()*2})}items.forEach(o=>o.y+=o.v*dt);items=items.filter(o=>{if(o.y>270&&o.y<315&&Math.abs(o.x-player)<42){score+=o.bad?-3:5;$('#catchScore').textContent=score;return false}return o.y<350});draw()}function move(dir){player=Math.max(30,Math.min(820,player+dir*32))}$('#startCatch').onclick=start;$('#pauseCatch').onclick=()=>{paused=!paused;$('#pauseCatch').textContent=paused?'▶ Resume':'Ⅱ Pause'};$('#moveLeft').onpointerdown=()=>move(-1);$('#moveRight').onpointerdown=()=>move(1);window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key)&&active==='catch'&&running){keys[e.key.length===1?e.key.toLowerCase():e.key]=true;e.preventDefault()}});window.addEventListener('keyup',e=>{keys[e.key.length===1?e.key.toLowerCase():e.key]=false});draw()}
const questions=[
{q:'Which PHP symbol starts a variable?',opts:['#','$','@'],a:1,why:'PHP variables begin with the dollar sign.'},
{q:'Which method sends data in the request body?',opts:['GET','POST','LINK'],a:1,why:'POST sends submitted data in the request body.'},
{q:'Which operator checks both value and type in JavaScript?',opts:['==','===','='],a:1,why:'Strict equality checks value and type.'},
{q:'What closes a PHP statement?',opts:[';','</php>','::'],a:0,why:'A semicolon terminates a PHP statement.'},
{q:'Which SQL clause filters grouped results?',opts:['WHERE','HAVING','ORDER BY'],a:1,why:'HAVING filters groups after aggregation.'}
];
function renderDebug(){
 let i=0,score=0;
 function show(){
  const q=questions[i];
  panel.innerHTML=`<div class="game-intro"><div class="game-icon">{ }</div><div><h3>Debug the Code</h3><p>Question ${i+1} of ${questions.length} · Score ${score}</p></div></div><div style="background:#0c0912;border:1px solid #3c2850;border-radius:12px;padding:25px;margin:18px 0"><div style="font:11px monospace;color:#b58aff;margin-bottom:18px">// Find the correct fix</div><h3 style="font:600 22px 'Space Grotesk';margin-bottom:24px">${q.q}</h3><div id="debugOptions" style="display:grid;gap:10px">${q.opts.map((o,n)=>`<button data-answer="${n}" style="text-align:left;background:#1b1126;border:1px solid #62437d;border-radius:9px;padding:14px;color:#eee;font:12px monospace">${String.fromCharCode(65+n)}. ${o}</button>`).join('')}</div><p id="debugFeedback" style="font-size:12px;margin:15px 0 0;color:#b58aff"></p></div><button class="btn-glow" id="debugNext" disabled>${i===questions.length-1?'SEE RESULTS':'NEXT QUESTION →'}</button>`;
  $$('#debugOptions button').forEach(b=>b.onclick=()=>{
   if(!$('#debugNext').disabled)return;
   const ok=Number(b.dataset.answer)===q.a;if(ok)score+=10;
   $('#debugFeedback').textContent=(ok?'✓ Correct! ':'✕ Not quite. ')+q.why;
   $('#debugFeedback').style.color=ok?'#9be4b2':'#ffad8a';
   $$('#debugOptions button').forEach(x=>{x.disabled=true;if(Number(x.dataset.answer)===q.a)x.style.borderColor='#76c99a'});
   $('#debugNext').disabled=false;
  });
  $('#debugNext').onclick=()=>{
   if(i<questions.length-1){i++;show();}
   else{panel.innerHTML=`<div style="text-align:center;padding:70px 10px"><div style="font-size:50px;color:#ff9b56">✦</div><h3 style="font:32px 'Space Grotesk'">Debugging complete!</h3><p style="color:#b9a8c8">Your score: ${score} / ${questions.length*10}</p><button class="btn-glow" id="debugAgain">PLAY AGAIN ↗</button></div>`;$('#debugAgain').onclick=()=>{i=0;score=0;show();};}
  };
 }
 show();
}
function renderStack(){const groups=['FRONTEND','BACKEND','DATABASE','TOOLS'];const techs=['HTML5','CSS3','Bootstrap','PHP','Python','MySQL','SQL','Git','GitHub','Figma','JavaScript','jQuery'];let placed=0;panel.innerHTML=`<div class="game-intro"><div class="game-icon">▦</div><div><h3>Build the Tech Stack</h3><p>Drag each technology into the category where it belongs.</p></div><b style="margin-left:auto;color:#ff9b56;font:12px monospace" id="stackCount">0 / ${techs.length}</b></div><div id="techBank" style="display:flex;flex-wrap:wrap;gap:8px;padding:15px;background:#0d0912;border-radius:12px;margin:15px 0">${techs.map(t=>`<span draggable="true" data-tech="${t}" style="cursor:grab;background:#35204a;border:1px solid #8058a3;border-radius:8px;padding:9px 12px;font:11px monospace">${t}</span>`).join('')}</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px" id="dropZones">${groups.map(g=>`<div data-group="${g}" style="min-height:115px;border:1px dashed #775594;border-radius:12px;padding:13px;background:#170f21"><b style="font:10px monospace;color:#ff9b56">${g}</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px"></div></div>`).join('')}</div><p id="stackFeedback" style="font-size:11px;color:#b58aff;margin-top:15px">Tip: select and drag a tile into a category.</p><button class="btn-outline" id="stackReset">↻ Reset puzzle</button>`;const correct={HTML5:'FRONTEND',CSS3:'FRONTEND',Bootstrap:'FRONTEND',JavaScript:'FRONTEND',jQuery:'FRONTEND',PHP:'BACKEND',Python:'BACKEND',MySQL:'DATABASE',SQL:'DATABASE',Git:'TOOLS',GitHub:'TOOLS',Figma:'TOOLS'};function handle(tile,zone){if(!tile||!zone||tile.dataset.done)return;let good=correct[tile.dataset.tech]===zone.dataset.group;if(good){tile.dataset.done='1';tile.draggable=false;tile.style.background='#24533e';zone.querySelector('div').appendChild(tile);placed++;$('#stackCount').textContent=placed+' / '+techs.length;$('#stackFeedback').textContent=placed===techs.length?'Amazing! You built the complete stack.':'Nice placement!';$('#stackFeedback').style.color='#9be4b2'}else{$('#stackFeedback').textContent='Not quite — try another category.';$('#stackFeedback').style.color='#ffad8a'}}$$('[data-tech]').forEach(t=>{t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',t.dataset.tech));t.addEventListener('click',()=>{let z=prompt('Place '+t.dataset.tech+' in: FRONTEND, BACKEND, DATABASE or TOOLS');if(z){let zone=$(`[data-group="${z.toUpperCase()}"]`);handle(t,zone)}})});$$('[data-group]').forEach(z=>{z.addEventListener('dragover',e=>e.preventDefault());z.addEventListener('drop',e=>{e.preventDefault();let tile=$(`[data-tech="${e.dataTransfer.getData('text/plain')}"]`);handle(tile,z)})});$('#stackReset').onclick=renderStack}

function renderBug() {

    // SQL mission bank
    const puzzles = [
        {
            title: "Build a student lookup",
            parts: [
                "SELECT name",
                "FROM students",
                'WHERE department = "CS"',
                "ORDER BY name;"
            ]
        },
        {
            title: "Count students by course",
            parts: [
                "SELECT course, COUNT(*)",
                "FROM students",
                "GROUP BY course",
                "HAVING COUNT(*) > 10;"
            ]
        },
        {
            title: "Find recent applications",
            parts: [
                "SELECT applicant_name",
                "FROM applications",
                'WHERE applied_at >= "2026-01-01"',
                "ORDER BY applied_at DESC;"
            ]
        },
        {
            title: "Find employees by salary",
            parts: [
                "SELECT employee_name, salary",
                "FROM employees",
                "WHERE salary > 30000",
                "ORDER BY salary DESC;"
            ]
        },
        {
            title: "List active courses",
            parts: [
                "SELECT course_name",
                "FROM courses",
                "WHERE status = 'Active'",
                "ORDER BY course_name;"
            ]
        },
        {
            title: "Find the highest product price",
            parts: [
                "SELECT product_name, price",
                "FROM products",
                "WHERE price > 1000",
                "ORDER BY price DESC;"
            ]
        },
        {
            title: "Count orders per customer",
            parts: [
                "SELECT customer_id, COUNT(*)",
                "FROM orders",
                "GROUP BY customer_id",
                "HAVING COUNT(*) > 2;"
            ]
        },
        {
            title: "Find students with high marks",
            parts: [
                "SELECT student_name, marks",
                "FROM exam_results",
                "WHERE marks >= 80",
                "ORDER BY marks DESC;"
            ]
        },
        {
            title: "Find pending payments",
            parts: [
                "SELECT payment_id, amount",
                "FROM payments",
                "WHERE status = 'Pending'",
                "ORDER BY amount DESC;"
            ]
        },
        {
            title: "Find departments with many employees",
            parts: [
                "SELECT department, COUNT(*)",
                "FROM employees",
                "GROUP BY department",
                "HAVING COUNT(*) >= 5;"
            ]
        },
        {
            title: "Find recently registered users",
            parts: [
                "SELECT username, created_at",
                "FROM users",
                "WHERE created_at >= '2026-01-01'",
                "ORDER BY created_at DESC;"
            ]
        },
        {
            title: "Find products in a price range",
            parts: [
                "SELECT product_name, price",
                "FROM products",
                "WHERE price BETWEEN 500 AND 2000",
                "ORDER BY price ASC;"
            ]
        }
    ];

    const totalMissions = puzzles.length;
    const pointsPerMission = 20;

    let missionDeck = [];
    let round = 0;
    let score = 0;
    let order = [];
    let answered = false;

    // Shuffle an array using Fisher-Yates
    function shuffleArray(array) {
        const result = [...array];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }

    // Create a fresh mission order for every playthrough
    function createMissionDeck() {
        missionDeck = shuffleArray(
            puzzles.map((_, index) => index)
        );

        // Avoid repeating the first mission from the previous playthrough
        const previousFirst = window.__queryArchitectLastFirst;

        if (
            missionDeck.length > 1 &&
            missionDeck[0] === previousFirst
        ) {
            [missionDeck[0], missionDeck[1]] =
                [missionDeck[1], missionDeck[0]];
        }

        window.__queryArchitectLastFirst = missionDeck[0];
    }

    // Shuffle SQL clauses and avoid showing the correct order initially
    function shuffleClauses() {
        const correctOrder = puzzles[missionDeck[round]].parts.map(
            (_, index) => index
        );

        order = shuffleArray(correctOrder);

        if (order.every((value, index) => value === index)) {
            [order[0], order[1]] = [order[1], order[0]];
        }
    }

    // Display current mission
    function showMission() {
        const question = puzzles[missionDeck[round]];
        answered = false;

        panel.innerHTML = `
            <div class="game-intro">
                <div class="game-icon">⌘</div>

                <div>
                    <h3>Query Architect</h3>
                    <p>
                        Mission ${round + 1} of ${totalMissions}
                        · Score ${score}
                    </p>
                </div>

                <b style="margin-left:auto;color:#ff9b56;font:12px monospace">
                    ${Math.round((round / totalMissions) * 100)}% COMPLETE
                </b>
            </div>

            <div style="
                height:5px;
                background:#25172f;
                border-radius:20px;
                overflow:hidden;
                margin:15px 0;
            ">
                <div style="
                    height:100%;
                    width:${(round / totalMissions) * 100}%;
                    background:linear-gradient(90deg,#9958e8,#ff9b56);
                    transition:width .3s;
                "></div>
            </div>

            <div style="
                background:#0b0910;
                border:1px solid #4d3564;
                border-radius:12px;
                padding:22px;
                margin:15px 0;
            ">
                <div style="
                    font:10px monospace;
                    color:#b58aff;
                    margin-bottom:8px;
                ">
                    MISSION ${String(round + 1).padStart(2, "0")}
                </div>

                <h3 style="
                    font:600 18px 'Space Grotesk';
                    margin-bottom:7px;
                ">
                    ${question.title}
                </h3>

                <p style="
                    font-size:11px;
                    color:#a995ba;
                    margin-bottom:17px;
                ">
                    Arrange the SQL clauses in the correct order.
                </p>

                <div id="queryOrder" style="display:grid;gap:8px">
                    ${order.map((index, position) => `
                        <div style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                            background:#1b1126;
                            border:1px solid #54386d;
                            border-radius:9px;
                            padding:8px 10px;
                        ">
                            <span style="
                                color:#8d76a5;
                                font:10px monospace;
                                width:18px;
                            ">
                                ${String(position + 1).padStart(2, "0")}
                            </span>

                            <code style="
                                flex:1;
                                color:#e9d9f5;
                                font-size:11px;
                            ">
                                ${question.parts[index]
                                    .replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")}
                            </code>

                            <button
                                type="button"
                                data-up="${position}"
                                aria-label="Move up"
                                ${position === 0 ? "disabled" : ""}
                                style="
                                    background:#332044;
                                    border:1px solid #654782;
                                    border-radius:6px;
                                    color:#fff;
                                    padding:5px 9px;
                                "
                            >↑</button>

                            <button
                                type="button"
                                data-down="${position}"
                                aria-label="Move down"
                                ${position === order.length - 1 ? "disabled" : ""}
                                style="
                                    background:#332044;
                                    border:1px solid #654782;
                                    border-radius:6px;
                                    color:#fff;
                                    padding:5px 9px;
                                "
                            >↓</button>
                        </div>
                    `).join("")}
                </div>

                <p id="queryFeedback" style="
                    font-size:11px;
                    color:#b58aff;
                    margin:15px 0 0;
                    min-height:20px;
                ">
                    Rearrange the clauses and check your query.
                </p>
            </div>

            <div style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
            ">
                <button class="btn-glow" id="queryCheck" type="button">
                    CHECK QUERY ↗
                </button>

                <button class="btn-outline" id="queryNext"
                    type="button" hidden>
                    NEXT MISSION →
                </button>

                <button class="btn-outline" id="queryReset" type="button">
                    ↻ SHUFFLE AGAIN
                </button>
            </div>
        `;

        // Move SQL clauses
        function moveClause(position, direction) {
            if (answered) return;

            const target = position + direction;

            if (target < 0 || target >= order.length) return;

            [order[position], order[target]] =
                [order[target], order[position]];

            showMission();
        }

        panel.querySelectorAll("[data-up]").forEach(button => {
            button.addEventListener("click", () => {
                moveClause(Number(button.dataset.up), -1);
            });
        });

        panel.querySelectorAll("[data-down]").forEach(button => {
            button.addEventListener("click", () => {
                moveClause(Number(button.dataset.down), 1);
            });
        });

        // Check the answer
        $("#queryCheck").addEventListener("click", () => {
            if (answered) return;

            const correct = order.every(
                (value, index) => value === index
            );

            const feedback = $("#queryFeedback");

            if (correct) {
                answered = true;
                score += pointsPerMission;

                feedback.textContent =
                    `✓ Correct! +${pointsPerMission} points. Excellent SQL ordering!`;

                feedback.style.color = "#9be4b2";

                $("#queryCheck").disabled = true;
                $("#queryCheck").textContent = "MISSION COMPLETED ✓";

                // Reveal the next mission button only after a correct answer
                $("#queryNext").hidden = false;

                $("#queryReset").disabled = true;

                if (round === totalMissions - 1) {
                    $("#queryNext").textContent = "VIEW FINAL SCORE →";
                }

            } else {
                feedback.textContent =
                    "Not quite! Check the SQL clause sequence and try again.";

                feedback.style.color = "#ffad8a";
            }
        });

        // Proceed to the next mission
        $("#queryNext").addEventListener("click", () => {
            if (!answered) return;

            if (round < totalMissions - 1) {
                round++;

                shuffleClauses();
                showMission();

            } else {
                showResults();
            }
        });

        // Shuffle the current mission again
        $("#queryReset").addEventListener("click", () => {
            if (answered) return;

            shuffleClauses();
            showMission();
        });
    }

    // Final results screen
    function showResults() {
        const percentage = Math.round(
            (score / (totalMissions * pointsPerMission)) * 100
        );

        let rank = "SQL Explorer";

        if (percentage === 100) {
            rank = "Query Architect Master";
        } else if (percentage >= 75) {
            rank = "Database Specialist";
        } else if (percentage >= 50) {
            rank = "SQL Developer";
        }

        panel.innerHTML = `
            <div style="
                text-align:center;
                padding:55px 15px;
                background:linear-gradient(145deg,#170e22,#0b0910);
                border:1px solid #51366b;
                border-radius:16px;
            ">
                <div style="
                    font-size:55px;
                    color:#ff9b56;
                    margin-bottom:12px;
                ">✦</div>

                <p style="
                    color:#b58aff;
                    font:11px monospace;
                    letter-spacing:2px;
                ">
                    ALL MISSIONS COMPLETED
                </p>

                <h3 style="
                    font:700 32px 'Space Grotesk';
                    margin:12px 0;
                ">
                    Query Architect Unlocked!
                </h3>

                <p style="color:#b9a8c8;margin-bottom:25px">
                    You completed all ${totalMissions} SQL missions.
                </p>

                <div style="
                    display:flex;
                    justify-content:center;
                    gap:35px;
                    flex-wrap:wrap;
                    margin:25px 0;
                ">
                    <div>
                        <div style="font:700 38px 'Space Grotesk';color:#fff">
                            ${score}
                        </div>
                        <small style="color:#a995ba">TOTAL SCORE / 240</small>
                    </div>

                    <div>
                        <div style="font:700 38px 'Space Grotesk';color:#fff">
                            ${percentage}%
                        </div>
                        <small style="color:#a995ba">ACCURACY</small>
                    </div>
                </div>

                <h3 style="color:#c49aff;margin-bottom:25px">
                    ${rank}
                </h3>

                <button class="btn-glow" id="queryAgain" type="button">
                    PLAY NEW CHALLENGE ↗
                </button>
            </div>
        `;

        $("#queryAgain").addEventListener("click", () => {
            startNewGame();
        });
    }

    // Start a fresh playthrough
    function startNewGame() {
        round = 0;
        score = 0;

        createMissionDeck();
        shuffleClauses();
        showMission();
    }

    // Initialize Query Architect
    startNewGame();
}


// Per-game play counts and short original UI sound cues (stored only in this browser).
const playKey='sherinArcadePlaysV2';let playCounts={catch:0,debug:0,stack:0,bug:0};try{playCounts=Object.assign(playCounts,JSON.parse(localStorage.getItem(playKey)||'{}'))}catch(e){}
let counted=false;
function paintPlayStats(){const ids={catch:'catchPlays',debug:'debugPlays',stack:'stackPlays',bug:'bugPlays'};let total=0;Object.keys(ids).forEach(k=>{let n=Number(playCounts[k])||0;total+=n;const el=document.getElementById(ids[k]);if(el)el.textContent=n});const t=document.getElementById('totalPlays');if(t)t.textContent=total}
function gameTone(kind){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),o=c.createOscillator(),g=c.createGain();const f={catch:520,debug:660,stack:440,bug:780}[kind]||520;o.type=kind==='catch'?'sine':kind==='stack'?'triangle':'sine';o.frequency.setValueAtTime(f,c.currentTime);o.frequency.exponentialRampToValueAtTime(f*1.35,c.currentTime+.09);g.gain.setValueAtTime(.045,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.16);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.17);o.onended=()=>c.close()}catch(e){}}
function recordPlay(){if(counted)return;counted=true;playCounts[active]=(Number(playCounts[active])||0)+1;try{localStorage.setItem(playKey,JSON.stringify(playCounts))}catch(e){}paintPlayStats();gameTone(active)}
panel.addEventListener('click',e=>{if(active==='catch'&&e.target.closest('#startCatch'))recordPlay();else if(active==='debug'&&e.target.closest('#debugOptions button'))recordPlay();else if(active==='stack'&&(e.target.closest('[data-tech]')||e.target.closest('[data-group]')))recordPlay();else if(active==='bug'&&(e.target.closest('[data-up]')||e.target.closest('[data-down]')||e.target.closest('#queryCheck')))recordPlay()});
panel.addEventListener('drop',()=>{if(active==='stack')recordPlay()});
$$('.game-tab').forEach(b=>b.addEventListener('click',()=>{counted=false}));
paintPlayStats();
renderCatch();})();
