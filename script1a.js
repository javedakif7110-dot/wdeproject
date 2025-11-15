const products = [
    {id:1,name:'Wireless Headphones',price:79.99,emoji:'🎧'},
    {id:2,name:'Smart Watch',price:199.99,emoji:'⌚'},
    {id:3,name:'USB-C Cable',price:14.99,emoji:'🔌'},
    {id:4,name:'Phone Case',price:24.99,emoji:'📱'},
    {id:5,name:'Portable Charger',price:49.99,emoji:'🔋'},
    {id:6,name:'Screen Protector',price:9.99,emoji:'🛡️'},
    {id:7,name:'Bluetooth Speaker',price:89.99,emoji:'🔊'},
    {id:8,name:'Laptop Stand',price:39.99,emoji:'💻'}
];

let state = {user:null,orders:[],wishlist:[],reviews:[]};

document.addEventListener('DOMContentLoaded',()=>{
    renderProducts('featured',products.slice(0,4));
    renderProducts('allProducts',products);
    document.getElementById('hamburger').addEventListener('click',()=>
        document.getElementById('navMenu').classList.toggle('active')
    );
});

function showPage(id){
    if(id==='dashboard'&&!state.user)return showPage('login');
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('navMenu').classList.remove('active');
    window.scrollTo(0,0);
}

function renderProducts(id,list){
    document.getElementById(id).innerHTML=list.map(p=>`
        <div class="product-card">
            <div class="product-image">${p.emoji}</div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">$${p.price}</div>
                <div class="product-buttons">
                    <button class="btn-add" onclick="addCart(${p.id},'${p.name}')">Add</button>
                    <button class="btn-wishlist" onclick="addWish(${p.id},'${p.name}')">♡</button>
                </div>
            </div>
        </div>
    `).join('');
}

const validators={
    email:e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
    password:p=>p.length>=8&&/[A-Z]/.test(p)&&/\d/.test(p),
    name:n=>n.trim().length>=3
};

function handleAuth(e,type){
    e.preventDefault();
    const fields={login:{email:'loginEmail',password:'loginPassword'},register:{name:'regName',email:'regEmail',password:'regPassword',confirm:'regConfirm'}}[type];
    const vals=Object.fromEntries(Object.entries(fields).map(([k,v]=>[k,document.getElementById(v).value]));
    let valid=true;

    ['email','password',type==='register'?'name':'','confirm'].forEach(f=>{
        if(!f)return;
        let msg='';
        const id=`${type}${f.charAt(0).toUpperCase()+f.slice(1)}Error`;
        if(f==='email'&&!validators.email(vals.email))msg='Invalid email';
        else if(f==='password'&&!validators.password(vals.password))msg='Password needs 8+, uppercase, number';
        else if(f==='name'&&!validators.name(vals.name))msg='Name 3+ chars';
        else if(f==='confirm'&&vals.password!==vals.confirm)msg='Passwords don\'t match';
        if(msg){document.getElementById(id).textContent=msg;valid=false;}
    });

    if(valid){
        state.user={name:type==='login'?vals.email.split('@')[0]:vals.name.split(' ')[0],email:vals.email};
        if(type==='login')state.orders=[
            {id:'ORD001',product:'Wireless Headphones',price:79.99,date:'2025-01-10',status:'delivered'},
            {id:'ORD002',product:'Smart Watch',price:199.99,date:'2025-01-15',status:'shipped'}
        ];
        document.getElementById('userName').textContent=state.user.name;
        const el=document.getElementById(`${type}Success`);
        el.textContent='Success!';el.classList.add('show');
        setTimeout(()=>{el.classList.remove('show');showPage('dashboard');e.target.reset();},1500);
    }
}

function handleLogout(){state={user:null,orders:[],wishlist:[],reviews:[]};showPage('home');}
function addCart(id,name){if(!state.user)showPage('login');else alert(name+' added!');}
function addWish(id,name){
    if(!state.user){showPage('login');return;}
    if(!state.wishlist.find(i=>i.id===id)){state.wishlist.push({id,name});alert(name+' added!');renderList();}
    else alert('Already wishlist');
}

function renderList(){
    const w=state.wishlist;document.getElementById('wishlistItems').innerHTML=w.length?w.map(i=>`
        <div class="wishlist-item"><h3>${i.name}</h3><button class="btn-secondary" onclick="delWish(${i.id})">Remove</button></div>
    `).join(''):'<p>Empty</p>';
}
function delWish(id){state.wishlist=state.wishlist.filter(i=>i.id!==id);renderList();}

function renderOrders(){
    const o=state.orders;document.getElementById('ordersList').innerHTML=o.length?o.map(i=>`
        <div class="order-item"><h3>${i.product}</h3><p>${i.id} | ${i.date} | $${i.price}</p>
        <span class="order-status status-${i.status}">${i.status}</span></div>
    `).join(''):'<p>No orders</p>';
}

function submitReview(e){
    e.preventDefault();
    state.reviews.push({product:document.getElementById('productName').value,rating:document.getElementById('rating').value,text:document.getElementById('reviewText').value});
    e.target.reset();
    const r=state.reviews;document.getElementById('reviewsList').innerHTML=r.map(i=>`
        <div class="review-item"><h3>${i.product}</h3><p>${'⭐'.repeat(i.rating)} ${i.text}</p></div>
    `).join('');
}

function submitReport(e){
    e.preventDefault();
    const el=document.getElementById('reportSuccess');
    el.textContent='Report submitted!';el.classList.add('show');
    setTimeout(()=>{e.target.reset();el.classList.remove('show');},2000);
}

function handleContactForm(e){
    e.preventDefault();
    alert('Thank you! We\'ll contact you soon.');
    e.target.reset();
}

function switchTab(e,tab){
    document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    e.target.classList.add('active');
    if(tab==='orders')renderOrders();
    if(tab==='wishlist')renderList();
    if(tab==='reviews')submitReview.__name='renderReviews';
}

