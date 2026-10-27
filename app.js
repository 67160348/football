const formations = {
 "4-3-3":[["LW"],["ST"],["RW"],["CM"],["CM"],["CM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "4-2-3-1":[["ST"],["LW"],["CAM"],["RW"],["CDM"],["CDM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "4-4-2":[["ST"],["ST"],["LM"],["CM"],["CM"],["RM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "4-1-2-1-2":[["ST"],["ST"],["CAM"],["CM"],["CM"],["CDM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "4-3-2-1":[["ST"],["CF"],["CF"],["CM"],["CM"],["CM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "3-4-3":[["LW"],["ST"],["RW"],["LM"],["CM"],["CM"],["RM"],["CB"],["CB"],["CB"],["GK"]],
 "3-5-2":[["ST"],["ST"],["LM"],["CM"],["CAM"],["CM"],["RM"],["CB"],["CB"],["CB"],["GK"]],
 "5-3-2":[["ST"],["ST"],["CM"],["CM"],["CM"],["LWB"],["CB"],["CB"],["CB"],["RWB"],["GK"]],
 "5-4-1":[["ST"],["LM"],["CM"],["CM"],["RM"],["LWB"],["CB"],["CB"],["CB"],["RWB"],["GK"]],
 "4-5-1":[["ST"],["LM"],["CM"],["CDM"],["CM"],["RM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "4-2-2-2":[["ST"],["ST"],["LAM"],["RAM"],["CDM"],["CDM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "3-4-2-1":[["ST"],["LAM"],["RAM"],["LM"],["CM"],["CM"],["RM"],["CB"],["CB"],["CB"],["GK"]],
 "4-1-4-1":[["ST"],["LM"],["CM"],["CM"],["RM"],["CDM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "4-3-1-2":[["ST"],["ST"],["CAM"],["CM"],["CM"],["CM"],["LB"],["CB"],["CB"],["RB"],["GK"]],
 "3-2-4-1":[["ST"],["LW"],["LAM"],["RAM"],["RW"],["CDM"],["CDM"],["CB"],["CB"],["CB"],["GK"]],
 "4-2-1-3":[["LW"],["ST"],["RW"],["CAM"],["CDM"],["CDM"],["LB"],["CB"],["CB"],["RB"],["GK"]]
};
const $=id=>document.getElementById(id);
let squads=[], activePlayer=1, roster=[], kept=[], winnerName="", angle=0, spinning=false;
const palette=["#c6ff4d","#50e3dc","#ffb86b","#b69cff","#ff7892","#72a8ff","#f6e96b","#6fe0a2","#ff8c60","#d6a8ff"];
function initFormation(){ $("formation").innerHTML=Object.keys(formations).map(f=>`<option>${f}</option>`).join(""); $("formation").value="4-3-3"; renderPitch();}
function renderPitch(){
 const f=$("formation").value; $("formationLabel").textContent=f;
 const positions=formations[f]; const rows=[positions.slice(0,3),positions.slice(3,6),positions.slice(6,10),positions.slice(10)];
 $("pitch").innerHTML=rows.filter(r=>r.length).map(row=>`<div class="formation-row">${row.map(pos=>`<label class="slot"><span class="shirt">✦</span><span class="pos">${pos}</span><input maxlength="32" data-pos="${pos}" placeholder="${pos} — ชื่อนักเตะ"></label>`).join("")}</div>`).join("");
}
$("formation").addEventListener("change",renderPitch);
function currentSquad(){return {manager:$("managerName").value.trim()||`ผู้เล่น ${activePlayer}`,team:$("teamName").value.trim()||`ทีม ${activePlayer}`,formation:$("formation").value,players:[...$("pitch").querySelectorAll("input")].map(i=>({pos:i.dataset.pos,name:i.value.trim()}))};}
function renderSaved(){
 const box=$("savedTeams"); if(!squads.length){box.innerHTML='<div class="empty">ยังไม่มีทีมที่บันทึกไว้ เริ่มจัดทีมแรกกันเลย</div>';$("matchArea").classList.add("hidden");return;}
 box.innerHTML=squads.map((s,i)=>`<article class="team-card"><h3>${esc(s.team)}</h3><p>${esc(s.manager)} · แผน ${s.formation}</p><div class="mini-players">${s.players.filter(p=>p.name).map(p=>`${p.pos}: ${esc(p.name)}`).join(" · ")||"ยังไม่ได้ใส่ชื่อนักเตะ"}</div><button class="btn ghost small" style="margin-top:12px" data-edit="${i}">แก้ไขทีมนี้</button></article>`).join("");
 box.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>loadSquad(+b.dataset.edit));
 if(squads.length===2)$("matchArea").classList.remove("hidden");else $("matchArea").classList.add("hidden");
}
function loadSquad(i){const s=squads[i];activePlayer=i+1;$("playerNumber").textContent=activePlayer;$("managerName").value=s.manager;$("teamName").value=s.team;$("formation").value=s.formation;renderPitch();[...$("pitch").querySelectorAll("input")].forEach((el,j)=>el.value=s.players[j]?.name||"");$("saveStatus").textContent=`กำลังแก้ไข ${s.team}`;window.scrollTo({top:0,behavior:"smooth"});}
$("saveTeam").onclick=()=>{
 const s=currentSquad(); if(squads[activePlayer-1])squads[activePlayer-1]=s;else squads.push(s);
 if(activePlayer===1 && squads.length===1){activePlayer=2;$("playerNumber").textContent="2";$("managerName").value="";$("teamName").value="";renderPitch();$("saveStatus").textContent="บันทึกทีมผู้เล่น 1 แล้ว! ถึงตาผู้เล่น 2 เลือกแผนและจัดทีมได้เลย";}
 else if(squads.length===2){$("saveStatus").textContent="บันทึกทีมผู้เล่น 2 แล้ว! พร้อมวิเคราะห์แมตช์";activePlayer=2;}
 else {$("saveStatus").textContent="บันทึกทีมแล้ว";}
 renderSaved();$("playerNumber").textContent=activePlayer;
};
$("clearTeam").onclick=()=>{[...$("pitch").querySelectorAll("input")].forEach(i=>i.value="");$("saveStatus").textContent="ล้างรายชื่อนักเตะในสนามแล้ว";};
$("resetGame").onclick=()=>{if(!confirm("เริ่มเกมใหม่และลบทีมที่บันทึกไว้ทั้งหมด?"))return;squads=[];activePlayer=1;$("playerNumber").textContent="1";$("managerName").value="";$("teamName").value="";renderPitch();renderSaved();$("saveStatus").textContent="เริ่มเกมใหม่แล้ว";$("analysisResult").innerHTML="";};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("analyze").onclick=()=>{
 if(squads.length<2)return; const [a,b]=squads;
 const score=s=>{const filled=s.players.filter(p=>p.name).length;let n=filled*1.6;const f=s.formation;if(f.startsWith("3-"))n+=1.1;if(f.includes("2-1-3"))n+=1.2;if(f==="5-4-1"||f==="5-3-2")n+=.5;return {filled,n};};
 const A=score(a),B=score(b),diff=A.n-B.n;let ga=Math.max(0,Math.round(1.35+diff*.24+(Math.random()*.8-.4))),gb=Math.max(0,Math.round(1.25-diff*.24+(Math.random()*.8-.4)));
 const all=[...a.players.filter(p=>p.name),...b.players.filter(p=>p.name)];
 const scorer=(s)=>s.players.filter(p=>p.name&&(/ST|CF|LW|RW|CAM|LAM|RAM/.test(p.pos))).map(p=>p.name);
 const as=scorer(a),bs=scorer(b);const goals=(names,n)=>n?Array.from({length:n},(_,i)=>names.length?names[i%names.length]:"กองหน้าตัวหลัก (ยังไม่ได้ระบุชื่อ)"):[];
 const strengths=s=>s.formation.startsWith("5-")?"เกมรับแน่นและมีโอกาสสวนกลับ":"มีสมดุลระหว่างเกมรุกกับการครองบอล";
 const weaknesses=s=>s.formation.startsWith("3-")?"พื้นที่ริมเส้นด้านหลังเซ็นเตอร์อาจเปิด":"ถ้าฟูลแบ็กเติมสูง อาจโดนสวนกลับด้านข้าง";
 const report=`<div class="match-report"><h3>🏆 ${esc(a.team)} ${ga} – ${gb} ${esc(b.team)}</h3><p><b>ภาพรวม:</b> ${Math.abs(diff)<1.2?"ทั้งสองทีมสูสีกัน เกมอาจตัดสินจากจังหวะสุดท้ายและความผิดพลาดเล็ก ๆ":diff>0?`${esc(a.team)} ดูได้เปรียบเล็กน้อยจากจำนวนตำแหน่งที่ใส่ครบและโครงสร้างทีม`:`${esc(b.team)} ดูได้เปรียบเล็กน้อยจากจำนวนตำแหน่งที่ใส่ครบและโครงสร้างทีม`}.</p><p><b>${esc(a.team)} (${a.formation})</b><br>ข้อดี: ${strengths(a)} และมีผู้เล่นระบุชื่อ ${A.filled}/11 ตำแหน่ง<br>ข้อควรระวัง: ${weaknesses(a)}.</p><p><b>${esc(b.team)} (${b.formation})</b><br>ข้อดี: ${strengths(b)} และมีผู้เล่นระบุชื่อ ${B.filled}/11 ตำแหน่ง<br>ข้อควรระวัง: ${weaknesses(b)}.</p><p><b>ผู้ทำประตูที่คาดการณ์:</b><br>${esc(a.team)}: ${goals(as,ga).map(esc).join(", ")||"ไม่มีประตู"}<br>${esc(b.team)}: ${goals(bs,gb).map(esc).join(", ")||"ไม่มีประตู"}</p><p class="tiny">คะแนนและผู้ทำประตูเป็นการสุ่มจำลองเพื่อความบันเทิง ไม่ใช่การทำนายจากสถิติจริง และไม่ได้ประเมินค่าความสามารถนักเตะรายบุคคล</p></div>`;
 $("analysisResult").innerHTML=report;
};
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===b.dataset.page));});
const canvas=$("wheelCanvas"),ctx=canvas.getContext("2d");
function drawWheel(){const n=roster.length;ctx.clearRect(0,0,500,500);ctx.save();ctx.translate(250,250);if(!n){ctx.beginPath();ctx.arc(0,0,238,0,Math.PI*2);ctx.fillStyle="#13263a";ctx.fill();ctx.strokeStyle="#c6ff4d";ctx.lineWidth=5;ctx.stroke();ctx.fillStyle="#94a9bd";ctx.font="20px Kanit";ctx.textAlign="center";ctx.fillText("เพิ่มรายชื่อนักเตะ",0,8);ctx.restore();return;}
 const arc=Math.PI*2/n;roster.forEach((name,i)=>{const start=angle+i*arc;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,238,start,start+arc);ctx.closePath();ctx.fillStyle=palette[i%palette.length];ctx.fill();ctx.strokeStyle="#081625";ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.rotate(start+arc/2);ctx.textAlign="right";ctx.fillStyle="#07111f";ctx.font=n>45?"bold 10px Kanit":n>25?"bold 12px Kanit":"bold 14px Kanit";let label=name.length>18?name.slice(0,17)+"…":name;ctx.fillText(label,220,4);ctx.restore();});ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fillStyle="#07111f";ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#c6ff4d";ctx.font="bold 17px Kanit";ctx.textAlign="center";ctx.fillText("GO!",0,6);ctx.restore();}
function updateRoster(){ $("countPill").textContent=`${roster.length} / 120 คน`;$("spin").disabled=!roster.length||spinning;$("rosterList").innerHTML=roster.map((n,i)=>`<div class="roster-item"><span class="name">${i+1}. ${esc(n)}</span><button title="ลบ ${esc(n)}" data-del="${i}">×</button></div>`).join("")||'<span class="muted">ยังไม่มีรายชื่อ</span>';$("rosterList").querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{const n=roster.splice(+b.dataset.del,1)[0];if(n===winnerName)winnerName="";updateRoster();drawWheel();});$("keptList").innerHTML=kept.map(n=>`<span class="kept-chip">${esc(n)}</span>`).join("")||'<span class="muted">ยังไม่มีชื่อที่เก็บไว้</span>';drawWheel();}
$("addNames").onclick=()=>{const names=$("playerInput").value.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);let added=0;for(const n of names){if(roster.length>=120)break;if(!roster.includes(n)){roster.push(n);added++;}}$("playerInput").value="";$("winner").textContent=added?`เพิ่ม ${added} รายชื่อแล้ว`:"ไม่มีชื่อใหม่ให้เพิ่ม หรือรายชื่อครบ 120 คนแล้ว";updateRoster();};
$("shuffleNames").onclick=()=>{for(let i=roster.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[roster[i],roster[j]]=[roster[j],roster[i]];}winnerName="";$("winner").textContent="สลับลำดับรายชื่อแล้ว";updateRoster();};
$("demoNames").onclick=()=>{const names=["Lionel Messi","Cristiano Ronaldo","Kylian Mbappé","Erling Haaland","Jude Bellingham","Kevin De Bruyne","Vinícius Júnior","Mohamed Salah","Harry Kane","Luka Modrić","Neymar Jr.","Robert Lewandowski","Lamine Yamal","Bukayo Saka","Phil Foden","Rodri","Virgil van Dijk","Rúben Dias","Alisson Becker","Thibaut Courtois","Wayne Rooney","Zinedine Zidane","Ronaldinho","David Beckham","Thierry Henry","Andrés Iniesta","Xavi","Sergio Ramos","Son Heung-min","Bruno Fernandes"];roster=[];names.forEach(n=>{if(roster.length<120)roster.push(n)});winnerName="";$("winner").textContent="ใส่รายชื่อตัวอย่างแล้ว หมุนได้เลย!";updateRoster();};
$("spin").onclick=()=>{if(spinning||!roster.length)return;spinning=true;$("spin").disabled=true;$("keepWinner").disabled=true;$("removeWinner").disabled=true;const start=angle;const extra=Math.PI*2*(5+Math.random()*5)+Math.random()*Math.PI*2;const duration=4300;const begin=performance.now();function animate(now){const t=Math.min(1,(now-begin)/duration);const eased=1-Math.pow(1-t,4);angle=start+extra*eased;drawWheel();if(t<1){requestAnimationFrame(animate);}else{spinning=false;const n=roster.length;const norm=((Math.PI*1.5-angle)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);const idx=Math.floor(norm/(Math.PI*2/n))%n;winnerName=roster[idx];$("winner").textContent=`🎉 ได้ ${winnerName}!`;$("keepWinner").disabled=false;$("removeWinner").disabled=false;$("spin").disabled=false;}}requestAnimationFrame(animate);};
$("keepWinner").onclick=()=>{if(winnerName&&!kept.includes(winnerName))kept.push(winnerName);$("winner").textContent=`เก็บ ${winnerName} ไว้แล้ว`;updateRoster();};
$("removeWinner").onclick=()=>{if(!winnerName)return;roster=roster.filter(n=>n!==winnerName);$("winner").textContent=`ลบ ${winnerName} ออกจากวงล้อแล้ว`;winnerName="";$("keepWinner").disabled=true;$("removeWinner").disabled=true;updateRoster();};
initFormation();updateRoster();