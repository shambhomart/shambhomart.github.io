/* ShambhoMART: connect the newly uploaded numbered assets to product cards.
   Existing folders/files are preserved; this only changes which assets the UI displays. */
(function(){
  const folderByName={
    'Pigeon by Stovekraft Limited Handy Mini Vegetable & Fruit Chopper':'Pigeon by Stovekraft Limited Handy Mini Vegetable & Fruit Chopper',
    'DECORASIA Non Chemical Spoon Set for Kitchen Lovers - Wooden Measuring Spoon Set':'DECORASIA Non Chemical Spoon Set for Kitchen Lovers - Wooden Measuring Spoon Set',
    'NARIYA 360 Degree Revolving Spice Rack Set - Black':'NARIYA 360 Degree Revolving Spice Rack Set - Black',
    'GOLDFINCH 500 ml Cooking Oil Dispenser':'GOLDFINCH 500 ml Cooking Oil Dispenser',
    'Kitchenium Greek Yogurt & Hung Curd Maker Yogurt Maker':'Kitchenium Greek Yogurt & Hung Curd Maker Yogurt Maker',
    'QUYZO Pack of 56 Multicolour Multipurpose Heavy-Duty Plastic Cloth Clips':'QUYZO Pack of 56 Multicolour Multipurpose Heavy-Duty Plastic Cloth Clips',
    'cello Quick Boil - Lifestyle Electric Kettle':'cello Quick Boil - Lifestyle Electric Kettle',
    'Misuhrobir Electronic Kitchen Scale 10Kg Weighing Scale':'Misuhrobir Electronic Kitchen Scale 10Kg Weighing Scale',
    'ACTIVA Pluto Pro 500W Mixer Grinder':'ACTIVA Pluto Pro 500W Mixer Grinder',
    'Mteaser Foldable Drawer Rectangular Storage Basket with Lid & Handle':'Mteaser Foldable Drawer Rectangular Storage Basket with Lid & Handle',
    'Beco Max Kitchen Cleaner':'Beco Max Kitchen Cleaner',
    'CAMPUS HURRICANE Running Shoes for Men':'CAMPUS HURRICANE Running Shoes for Men'
  };
  const ext=['webp','png','jpg','jpeg'];
  const cache=new Map();
  const imgExists=src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(src);i.onerror=()=>resolve(null);i.src=src;});
  async function getImages(folder){
    if(cache.has(folder))return cache.get(folder);
    const out=[];
    for(let n=1;n<=12;n++){
      let found=null;
      for(const e of ext){found=await imgExists(`assets/${folder}/${n}.${e}`);if(found)break;}
      if(found)out.push(found);else if(n>1)break;
    }
    cache.set(folder,out);return out;
  }
  async function refreshCards(){
    const cards=[...document.querySelectorAll('#productGrid .product')];
    await Promise.all(cards.map(async card=>{
      const title=card.querySelector('h3')?.textContent?.trim();
      const folder=folderByName[title];
      if(!folder)return;
      const imgs=await getImages(folder);
      if(imgs[0]){
        const main=card.querySelector('.product-img img');
        if(main)main.src=imgs[0];
      }
    }));
  }
  async function refreshModal(){
    const title=document.querySelector('#modalBody .product-detail-copy h2')?.textContent?.trim();
    const folder=folderByName[title];
    if(!folder)return;
    const imgs=await getImages(folder);
    if(!imgs.length)return;
    const gallery=document.getElementById('galleryThumbs');
    const main=document.getElementById('galleryMain');
    if(!gallery||!main)return;
    main.src=imgs[0];
    gallery.innerHTML=imgs.map((src,i)=>`<button type="button" class="gallery-thumb ${i===0?'active':''}" data-src="${src}" aria-label="Product image ${i+1}"><img src="${src}" alt="${title} view ${i+1}" loading="lazy"></button>`).join('');
    gallery.onclick=e=>{const btn=e.target.closest('.gallery-thumb');if(!btn)return;main.src=btn.dataset.src;gallery.querySelectorAll('.gallery-thumb').forEach(x=>x.classList.remove('active'));btn.classList.add('active')};
    const count=document.querySelector('.gallery-count');if(count)count.textContent=`${imgs.length} product images`;
  }
  function addSocialLinks(){
    const footer=document.querySelector('footer');
    if(!footer||footer.querySelector('.social-links'))return;
    const box=document.createElement('div');
    box.className='social-links';
    box.setAttribute('aria-label','ShambhoMART social media');
    box.innerHTML='<span>Follow Us</span><a href="https://www.facebook.com/ShambhoMart" target="_blank" rel="noopener" aria-label="ShambhoMART Facebook">Facebook</a><a href="https://www.instagram.com/shambhomart/" target="_blank" rel="noopener" aria-label="ShambhoMART Instagram">Instagram</a>';
    footer.appendChild(box);
    if(!document.getElementById('shambhomart-social-schema')){
      const script=document.createElement('script');
      script.id='shambhomart-social-schema';
      script.type='application/ld+json';
      script.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"ShambhoMART","url":"https://shambhomart.github.io/shambhomart/","sameAs":["https://www.facebook.com/ShambhoMart","https://www.instagram.com/shambhomart/"]});
      document.head.appendChild(script);
    }
  }
  const observer=new MutationObserver(()=>{refreshCards();if(document.getElementById('modal')?.classList.contains('show'))setTimeout(refreshModal,50)});
  const grid=document.getElementById('productGrid');
  if(grid)observer.observe(grid,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(e.target.closest('.details'))setTimeout(refreshModal,80);
  });
  refreshCards();
  addSocialLinks();
})();
