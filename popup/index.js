
const openSidebar = async ( title, text ) => {
    await browser.sidebarAction.open();

    let response = false;
    while( !Boolean(response) ){
        try{
            response = await browser.runtime.sendMessage({ title, text });
        }catch{
            response = false;
        }
        console.log( response );
    }
}
const createCard = ( title, text )=> {
    const card = document.createElement('div');
    const trash = document.createElement('img');

    card.innerHTML = title;
    card.classList.add('card');
    card.style.width = '200px';
    card.style.minWidth = '200px';
    card.style.height = '50px'; 
    card.style.marginTop = '5%';
    card.style.marginRight = '20px';
    card.style.paddingLeft = '5%';
    card.style.paddingRight = '5%';
    card.style.paddingTop = '15%';
    card.style.backgroundColor = 'var(--secondary-color)';
    card.style.borderRadius = '5px';
    card.addEventListener( 'click', () => openSidebar( title, text ) )

    trash.src = '../icons/trash.svg';
    trash.style.position = 'absolute';
    trash.style.right = '20px';
    trash.width = '20';
    trash.height = '20';
    trash.addEventListener('click', async e =>{
        e.stopPropagation();
        card.remove();
        await browser.storage.local.remove(title);
    })
    card.append(trash);

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
