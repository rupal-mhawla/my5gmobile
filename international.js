let ildData = [], ildPage = 0;
const ildPageSize = 30;
const ildSearch = document.querySelector('#ild-search');
const ildAllowance = document.querySelector('#ild-allowance');
const ildType = document.querySelector('#ild-type');
function ildRouteType(row) {
 if (/satellite|inmarsat|gmss|international networks|personal numbering|premium services|special|globalstar/i.test(row.route)) return 'special';
 return row.mobile ? 'mobile' : 'landline';
}
function ildFiltered() {
 const query = ildSearch.value.trim().toLocaleLowerCase();
 return ildData.filter(row => row.route.toLocaleLowerCase().includes(query) && (ildAllowance.value === 'all' || (ildAllowance.value === 'unlimited' ? row.minutes === 'Unlimited' : row.minutes !== 'Unlimited')) && (ildType.value === 'all' || ildRouteType(row) === ildType.value));
}
function ildRender() {
 const filtered = ildFiltered();
 const pages = Math.max(1, Math.ceil(filtered.length / ildPageSize));
 ildPage = Math.min(ildPage, pages - 1);
 const start = ildPage * ildPageSize;
 const body = document.querySelector('#ild-rows'); body.replaceChildren();
 filtered.slice(start, start + ildPageSize).forEach(row => {
  const tr = document.createElement('tr');
  const route = document.createElement('th'); route.scope = 'row'; route.textContent = row.route;
  const type = document.createElement('td'); type.className = 'ild-route-type'; type.textContent = ({landline: 'Landline', mobile: 'Mobile', special: 'Special route'})[ildRouteType(row)];
  const allowance = document.createElement('td');
  const badge = document.createElement('span'); badge.className = row.minutes === 'Unlimited' ? 'ild-badge unlimited' : 'ild-badge limited'; badge.textContent = row.minutes === 'Unlimited' ? 'Unlimited' : `${row.minutes} min`;
  allowance.append(badge); tr.append(route, type, allowance); body.append(tr);
 });
 document.querySelector('#ild-result-count').textContent = filtered.length ? `Showing ${start + 1}–${Math.min(start + ildPageSize, filtered.length)} of ${filtered.length} routes` : '0 routes found';
 document.querySelector('#ild-page').textContent = `Page ${ildPage + 1} of ${pages}`;
 document.querySelector('#ild-prev').disabled = ildPage === 0;
 document.querySelector('#ild-next').disabled = ildPage + 1 >= pages;
 document.querySelector('#ild-empty').hidden = filtered.length > 0;
}
[ildSearch, ildAllowance, ildType].forEach(control => control.addEventListener(control === ildSearch ? 'input' : 'change', () => { ildPage = 0; ildRender(); }));
document.querySelector('#ild-prev').addEventListener('click', () => { ildPage--; ildRender(); });
document.querySelector('#ild-next').addEventListener('click', () => { ildPage++; ildRender(); });
document.querySelector('#ild-reset').addEventListener('click', () => { ildSearch.value = ''; ildAllowance.value = 'all'; ildType.value = 'all'; ildPage = 0; ildRender(); });
fetch('assets/international-routes.json').then(response => { if (!response.ok) throw new Error('Load failed'); return response.json(); }).then(data => { ildData = data; ildRender(); }).catch(() => { document.querySelector('#ild-result-count').textContent = 'The calling list could not load. Please refresh the page.'; });

const viewTabs = [document.querySelector('#countries-tab'), document.querySelector('#details-tab')];
function showCallingView(index, focus = false) {
 viewTabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
 document.querySelector('#countries-panel').hidden = index !== 0;
 document.querySelector('#details-panel').hidden = index !== 1;
 if (focus) viewTabs[index].focus();
}
viewTabs.forEach((tab, index) => {
 tab.addEventListener('click', () => showCallingView(index));
 tab.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); showCallingView(event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index, true); } });
});
fetch('assets/international-countries.json').then(r => { if(!r.ok) throw new Error('Load failed'); return r.json(); }).then(countries => {
 const grid = document.querySelector('#country-flag-grid');
 countries.filter(country => country.unlimited).forEach(country => {
  const card = document.createElement('button'); card.className = 'country-flag-card'; card.type = 'button'; card.setAttribute('aria-label', `See calling allowances for ${country.name}`);
  const img = document.createElement('img'); img.src = `https://flagcdn.com/w80/${country.code}.png`; img.alt = ''; img.loading = 'lazy'; img.width = 40; img.height = 28;
  const name = document.createElement('span'); name.textContent = country.name;
  const arrow = document.createElement('span'); arrow.className = 'country-card-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
  card.append(img, name, arrow);
  card.addEventListener('click', () => { showCallingView(1); ildSearch.value = country.name; ildAllowance.value = 'all'; ildType.value = 'all'; ildPage = 0; ildRender(); ildSearch.focus({preventScroll:true}); document.querySelector('.ild-tabs').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'}); });
  grid.append(card);
 });
}).catch(() => { document.querySelector('#country-flag-grid').textContent = 'The country list could not load. Open Calling Details to search.'; });
