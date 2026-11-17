const $=s=>document.querySelector(s);
const store={
  users:()=>{try{return JSON.parse(localStorage.getItem('ch_users'))||[]}catch(e){return[]}},
  save:u=>localStorage.setItem('ch_users',JSON.stringify(u)),
  session:()=>localStorage.getItem('ch_session'),
  setSession:e=>e?localStorage.setItem('ch_session',e):localStorage.removeItem('ch_session')
};
const SUBJECTS=[
 {code:'IT 101',name:'Intro to Computing',units:3,grade:1.25,day:'Mon',time:'8:00–9:30',room:'Lab 2'},
 {code:'IT 112',name:'Web Development',units:3,grade:1.5,day:'Tue',time:'10:00–11:30',room:'Lab 4'},
 {code:'MATH 21',name:'Discrete Mathematics',units:3,grade:1.75,day:'Wed',time:'1:00–2:30',room:'Rm 305'},
 {code:'ENG 10',name:'Technical Writing',units:3,grade:1.25,day:'Thu',time:'9:00–10:30',room:'Rm 210'},
 {code:'PE 2',name:'Fitness & Wellness',units:2,grade:1.0,day:'Fri',time:'3:00–5:00',room:'Gym'}
];
function toast(msg,ok){
  const el=document.createElement('div');
  el.className='toast align-items-center text-bg-'+(ok?'success':'danger')+' border-0';
  el.setAttribute('role',ok?'status':'alert');
  el.innerHTML='<div class="d-flex"><div class="toast-body fw-semibold"></div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>';
  el.querySelector('.toast-body').textContent=msg;
  $('#toasts').append(el);
  const t=new bootstrap.Toast(el,{delay:3500});t.show();
  el.addEventListener('hidden.bs.toast',()=>el.remove());
}
function showErr(id,msg){const e=$(id);e.textContent=msg;e.classList.toggle('hidden',!msg);}

$('#signupPane').addEventListener('submit',e=>{
  e.preventDefault();
  const f={name:$('#sName').value.trim(),id:$('#sId').value.trim(),course:$('#sCourse').value,email:$('#sEmail').value.trim().toLowerCase(),pass:$('#sPass').value};
  let err='';
  if(!f.name||!f.id||!f.email||!f.pass)err='Fill in every field to continue.';
  else if(!/^\S+@\S+\.\S+$/.test(f.email))err='Enter a valid email, such as name@school.edu.';
  else if(!/^\d{4}-\d{3,6}$/.test(f.id))err='Student ID must look like 2026-00123.';
  else if(f.pass.length<6)err='Use a password with at least 6 characters.';
  else if(f.pass!==$('#sPass2').value)err='Passwords do not match.';
  else if(store.users().some(u=>u.email===f.email))err='An account with this email already exists. Log in instead.';
  showErr('#sErr',err);
  if(err){toast('Sign up failed: '+err,false);return;}
  const users=store.users();users.push({...f,phone:'',address:''});store.save(users);
  toast('Successful! Your account has been created. You can log in now.',true);
  e.target.reset();
  bootstrap.Tab.getOrCreateInstance(document.querySelector('[data-bs-target="#loginPane"]')).show();
  $('#lEmail').value=f.email;$('#lPass').focus();
});

$('#loginPane').addEventListener('submit',e=>{
  e.preventDefault();
  const email=$('#lEmail').value.trim().toLowerCase(),pass=$('#lPass').value;
  const u=store.users().find(x=>x.email===email&&x.pass===pass);
  if(!u){const m=!email||!pass?'Enter your email and password.':'Wrong email or password. Check your details and try again.';showErr('#lErr',m);toast('Login failed: '+m,false);return;}
  showErr('#lErr','');store.setSession(email);toast('Successful! Welcome back, '+u.name.split(' ')[0]+'.',true);
  e.target.reset();enter();
});

$('#logout').addEventListener('click',()=>{store.setSession(null);$('#app').classList.add('hidden');$('#auth').classList.remove('hidden');toast('You have been logged out.',true);});
$('#menu').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)render(b.dataset.view);});

const me=()=>store.users().find(u=>u.email===store.session());
const gpa=()=>{const u=SUBJECTS.reduce((a,s)=>a+s.units,0);return SUBJECTS.reduce((a,s)=>a+s.grade*s.units,0)/u;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function enter(){
  const u=me();if(!u)return;
  $('#auth').classList.add('hidden');$('#app').classList.remove('hidden');
  $('#sbName').textContent=u.name;$('#sbId').textContent=u.id;$('#avatar').textContent=u.name[0].toUpperCase();
  render('overview');
}
function render(v){
  document.querySelectorAll('#menu [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  const u=me(),V=$('#view');
  if(v==='overview'){
    const units=SUBJECTS.reduce((a,s)=>a+s.units,0);
    V.innerHTML=`<h2 class="mb-1">Hello, ${esc(u.name.split(' ')[0])}</h2><p class="text-secondary">${esc(u.course)} · 1st semester</p>
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-4"><div class="panel stat p-3"><div class="small text-secondary">Semester GWA</div><div class="h2 mb-0">${gpa().toFixed(2)}</div></div></div>
      <div class="col-sm-6 col-xl-4"><div class="panel stat gold p-3"><div class="small text-secondary">Units enrolled</div><div class="h2 mb-0">${units}</div></div></div>
      <div class="col-sm-12 col-xl-4"><div class="panel stat p-3"><div class="small text-secondary">Subjects</div><div class="h2 mb-0">${SUBJECTS.length}</div></div></div>
    </div>
    <div class="panel p-3"><h3 class="h5">Next classes</h3><ul class="list-group list-group-flush">
    ${SUBJECTS.slice(0,3).map(s=>`<li class="list-group-item d-flex justify-content-between"><span>${s.code} · ${s.name}</span><span class="text-secondary">${s.day} ${s.time}</span></li>`).join('')}</ul></div>`;
  }else if(v==='grades'){
    V.innerHTML=`<h2 class="mb-3">Grades</h2><div class="panel p-3"><div class="mb-3"><input id="q" class="form-control" placeholder="Search subjects" aria-label="Search subjects"></div>
    <div class="table-responsive"><table class="table align-middle"><thead><tr><th>Code</th><th>Subject</th><th>Units</th><th>Grade</th><th>Status</th></tr></thead><tbody id="gb"></tbody></table></div>
    <div class="fw-bold">GWA: ${gpa().toFixed(2)}</div></div>`;
    const draw=t=>{$('#gb').innerHTML=SUBJECTS.filter(s=>(s.code+s.name).toLowerCase().includes(t)).map(s=>`<tr><td>${s.code}</td><td>${s.name}</td><td>${s.units}</td><td class="grade">${s.grade.toFixed(2)}</td><td><span class="badge text-bg-${s.grade<=3?'success':'danger'}">${s.grade<=3?'Passed':'Failed'}</span></td></tr>`).join('')||'<tr><td colspan="5" class="text-secondary">No subjects match that search.</td></tr>';};
    draw('');$('#q').addEventListener('input',e=>draw(e.target.value.toLowerCase()));
  }else if(v==='schedule'){
    V.innerHTML=`<h2 class="mb-3">Weekly schedule</h2><div class="row g-3">${SUBJECTS.map(s=>`<div class="col-md-6 col-xl-4"><div class="panel p-3 h-100"><div class="small text-secondary">${s.day} · ${s.time}</div><div class="h5 my-1">${s.name}</div><div>${s.code} · ${s.room}</div></div></div>`).join('')}</div>`;
  }else{
    V.innerHTML=`<h2 class="mb-3">Profile</h2><form id="pf" class="panel p-4" style="max-width:560px" novalidate>
    <div class="mb-3"><label class="form-label" for="pName">Full name</label><input id="pName" class="form-control" value="${esc(u.name)}"></div>
    <div class="mb-3"><label class="form-label" for="pEmail">Email</label><input id="pEmail" class="form-control" value="${esc(u.email)}" disabled></div>
    <div class="mb-3"><label class="form-label" for="pPhone">Phone</label><input id="pPhone" class="form-control" value="${esc(u.phone||'')}" placeholder="0917 123 4567"></div>
    <div class="mb-3"><label class="form-label" for="pAddr">Address</label><input id="pAddr" class="form-control" value="${esc(u.address||'')}"></div>
    <button class="btn btn-primary" type="submit">Save changes</button></form>`;
    $('#pf').addEventListener('submit',e=>{
      e.preventDefault();
      const n=$('#pName').value.trim(),ph=$('#pPhone').value.trim();
      if(!n){toast('Name cannot be empty.',false);return;}
      if(ph&&!/^[\d\s+()-]{7,15}$/.test(ph)){toast('Enter a valid phone number.',false);return;}
      const users=store.users(),i=users.findIndex(x=>x.email===u.email);
      Object.assign(users[i],{name:n,phone:ph,address:$('#pAddr').value.trim()});store.save(users);
      $('#sbName').textContent=n;$('#avatar').textContent=n[0].toUpperCase();
      toast('Successful! Profile saved.',true);
    });
  }
}
if(me())enter();
