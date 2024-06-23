
const openSidebar = async ( title, text ) => {
    await browser.sidebarAction.open();

    let response = false;
    while( !Boolean(response) ){
        try{
            response = await browser.runtime.sendMessage({ title, text });
        }catch{
            response = false;
        }
    }
    window.close();
}
/**
 * 
 * @param {string} title 
 * @param {string} text 
 * @returns 
 */
const createCard = ( title, text )=> {
    const card = document.createElement('div');
    const trash = document.createElement('img');
    const cloud = document.createElement('img');
    const wrapper = document.createElement('ul');
    const item1 = document.createElement('li');
    const item2 = document.createElement('li');
    const item3 = document.createElement('li');

    let padding = 0;

    if( title.length < 20 )
        padding = ( 20 - title.length )*10;

    wrapper.append( item1, item2, item3 );

    item1.style.marginRight = `${padding + 10}px`;
    item1.style.paddingLeft = '0 !important';
    item1.style.marginLeft = '0 !important';
    item1.style.fontSize = '16px';
    item1.innerHTML = title.length > 20? `${title.substring(0, 17)}...`: title;
    item2.append( cloud );
    item3.append( trash );

    card.style.width = '250px';
    card.style.minWidth = '250px';
    card.style.height = '50px'; 
    card.style.paddingLeft = '5%';
    card.style.paddingRight = '5%';
    card.style.paddingTop = '5%';
    card.style.marginTop = '2%';
    card.style.backgroundColor = 'var(--secondary-color)';
    card.style.borderRadius = '5px';
    card.title = text.substring( 0, 100 );
    card.addEventListener( 'click', () => openSidebar( title, text ) )

    trash.src = '../icons/trash.svg';
    trash.width = '20';
    trash.height = '20';
    trash.classList.add('icon-button');
    trash.title = 'Delete';
    trash.addEventListener('click', async e =>{
        e.stopPropagation();
        card.remove();
        await browser.storage.local.remove(title);
    })

    cloud.src = '../icons/cloud.svg';
    cloud.width = '20';
    cloud.height = '20';
    cloud.classList.add('icon-button');
    cloud.title = 'Download';
    cloud.addEventListener( 'click', async ()=>{
        e.stopPropagation();
        const blob = new Blob( [text], { type: 'text/plain' } );

        await browser.downloads.download({
            url: window.URL.createObjectURL( blob ),
            saveAs: true,
        });
    })

    card.append( wrapper );

    return card;
}

const main = async ()=>{

    const container = document.getElementById('container');
    const collection = await browser.storage.local.get() || {};

    for( const [k,v] of Object.entries( collection ) ){
        container.append( createCard( k, v ) );
    }
    document.getElementById('new').addEventListener('click', ()=> openSidebar( '', '' ) );
}
browser.runtime.onMessage.addListener( request => {
    if( !request || typeof request !== 'object' || !('title' in request) || !('text' in request) )
        return;
    container.append( createCard( request.title, request.text ) );
});
main();
