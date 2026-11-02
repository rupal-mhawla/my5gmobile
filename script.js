const plans = [
  {name:'Starter',price:10,data:1,tag:'1GB for light data use',features:['Unlimited Talk & Text','1GB of high-speed data','Perfect for light data use','Flexible, affordable add-ons']},
  {name:'Explore',price:20,autopay:18,data:5,tag:'5GB for everyday use',features:['Unlimited Talk & Text','5GB of high-speed data','Flexible, affordable add-ons','Free roaming in Mexico & Canada']},
  {name:'Premium',price:30,autopay:27,data:12,tag:'12GB for streaming and more',featured:true,features:['Unlimited Talk & Text','12GB of high-speed data','Calling to 100+ international destinations','Free roaming in Mexico & Canada']},
  {name:'Unlimited',price:40,autopay:38,data:30,tag:'30GB for heavier data use',features:['Unlimited data','30GB of high-speed data','Calling to 100+ international destinations','Free roaming in Mexico & Canada']},
  {name:'Unlimited Plus',price:50,autopay:46,data:50,tag:'50GB for your busiest days',features:['Unlimited data','Unlimited Talk & Text','Calling to 100+ international destinations','Free roaming in Mexico & Canada']}
];
const grid = document.querySelector('#plan-grid');
const dialog = document.querySelector('#plan-dialog');
let selection;
function renderPlans(filter='all') {
  grid.replaceChildren();
  plans.filter(p=>filter==='all'||(filter==='light'?p.data<=5:p.data>5)).forEach(p=>{
    const card=document.createElement('article');
    card.className=`plan-card${p.featured?' featured':''}`;
    card.innerHTML=`${p.featured?'<div class="card-ribbon">THE MIDDLE GROUND</div>':''}<p class="plan-name">${p.name}</p><p class="plan-tag">${p.tag}</p><p class="price"><span>$</span>${p.price}<small>/mo</small></p>${p.autopay?`<p class="autopay">$${p.autopay} with Auto Pay</p>`:'<p class="autopay autopay-empty" aria-hidden="true">&nbsp;</p>'}<div class="data-amount">${p.data}<span>GB</span><small>${p.data===50?'listed data allowance':'high-speed data'}</small></div><ul>${p.features.map(f=>`<li><span aria-hidden="true">✓</span>${f}</li>`).join('')}<li><span aria-hidden="true">✓</span>Hotspot included</li></ul><button class="plan-button" aria-label="Select ${p.name} plan">Choose ${p.name}<span aria-hidden="true">↗</span></button>`;
    card.querySelector('button').addEventListener('click',()=>{
      selection=p;
      document.querySelector('#dialog-title').textContent=`${p.name} · $${p.price}/month`;
      document.querySelector('#selected-description').textContent=`${p.data}GB. ${p.autopay ? `$${p.autopay} with Auto Pay. ` : ''}${p.features.join('. ')}. Hotspot included. Terms and pricing must be confirmed before purchase.`;
      document.querySelector('#copy-status').textContent='';
      dialog.showModal();
    });
    {
      const factsLink = document.createElement('a');
      factsLink.className = 'plan-facts-link';
      factsLink.href = `#facts-${p.name.toLowerCase().replaceAll(' ', '-')}`;
      factsLink.textContent = 'Broadband Facts';
      factsLink.addEventListener('click', () => { document.querySelector(factsLink.getAttribute('href')).open = true; });
      card.append(factsLink);
    }
    grid.append(card);
  });
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  renderPlans(button.dataset.filter);
}));
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
document.querySelector('#copy-plan').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(`5GMobile — ${selection.name}: $${selection.price}/month, ${selection.data}GB. ${selection.autopay ? `$${selection.autopay} with Auto Pay. ` : ''}${selection.features.join('. ')}. Hotspot included. Confirm pricing and terms before purchase. This is not an order.`);
    status.textContent='Plan details copied.';
  } catch { status.textContent='Copying is unavailable in this browser. You can select and copy the details above.'; }
});
document.querySelector('#year').textContent=new Date().getFullYear();
renderPlans();

document.querySelectorAll('.compare-scroll a[href^="#facts-"]').forEach(link => link.addEventListener('click', () => { const disclosure = document.querySelector(link.getAttribute('href')); if(disclosure) disclosure.open = true; }));
