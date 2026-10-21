// Чтение локального JSON продукта (имитация данных)
fetch('JSON/product.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Ой, ошибка в fetch: ' + response.statusText);
        }
        return response.json();
    })
    .then(jsonData => getProductData(jsonData))
    .catch(error => console.error('Ошибка при исполнении запроса: ', error));

// Чтение локального JSON категорий (имитация данных)
fetch('JSON/categories.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Ой, ошибка в fetch: ' + response.statusText);
        }
        return response.json();
    })
    .then(jsonData => getCategoriesData(jsonData))
    .catch(error => console.error('Ошибка при исполнении запроса: ', error));


// Функция заполнения категорий
function getCategoriesData(data) {
    const catrgoriesContent = document.getElementsByClassName('catrgories-content')[0];

    let catrgoriesMoreBtn = document.getElementsByClassName('catrgories-more')[0];
    catrgoriesMoreBtn.textContent = '...';

    function drawCategorie(counter){
        let categorie = document.createElement('div');
        categorie.setAttribute('class', 'categorie');

        const categorieName = document.createElement('p');
        categorieName.textContent = data.categories[counter];
        categorie.appendChild(categorieName);

        const categorieArrow = document.createElement('i');
        categorieArrow.setAttribute('class', 'icon-keyboard_arrow_right');
        categorie.appendChild(categorieArrow);

        catrgoriesContent.appendChild(categorie)
    }

    // Функция просмотра наличия раскрытого меню категорий
    catrgoriesMoreBtn.addEventListener('click', function(){
        if(catrgoriesContent.children.length <= 10){
            for(let k = 10; k < data.categories.length; k++){
                drawCategorie(k);
            }
        }else if(catrgoriesContent.children.length > 10){
            while(catrgoriesContent.children.length != 10){
                catrgoriesContent.lastElementChild.remove();
            }
        }
    });

    for(let l = 0; l < data.categories.length; l++){

        if(l >= 10)return;

        drawCategorie(l);
    }
}

// Функция отрисовки элементов, требующих данные из JSON
function getProductData(data) {

    const productName = document.getElementsByClassName('product-name')[0];
    const container = document.getElementsByClassName('product-packagings')[0];

    const picMainContainer = document.getElementsByClassName('product-pic-main')[0];
    const picPreviewContainer = document.getElementsByClassName('product-pic-preview')[0];

    productName.textContent = data.name;

    picMainContainer.children[0].setAttribute('src', data.mainPic);

    // Функция зума главной картинки
    picMainContainer.addEventListener('click', function(){
        const pic = this.children[0];
        const clonePic = pic.cloneNode(true);

        const fullScreenPic = document.createElement('div');
        fullScreenPic.setAttribute('class', 'full-screen-pic');

        fullScreenPic.appendChild(clonePic);

        const fullScreenPicClose = document.createElement('div');
        fullScreenPicClose.setAttribute('class', 'full-screen-pic-close');

        const fullScreenPicName = document.createElement('p');
        fullScreenPicName.textContent = data.name;
        fullScreenPicClose.appendChild(fullScreenPicName);

        const fullScreenPicCloseIcon = document.createElement('i');
        fullScreenPicCloseIcon.setAttribute('Class', 'icon-cross');
        fullScreenPicClose.appendChild(fullScreenPicCloseIcon);

        fullScreenPic.appendChild(fullScreenPicClose);

        fullScreenPic.addEventListener('click', function(){
            this.remove();
        });

        document.body.appendChild(fullScreenPic);
    })

    // Заполнение превьюшек
    for (let j = 0; j < data.previewPics.length; j++) {
        let picPreview = document.createElement('img');
        picPreview.setAttribute('src', data.previewPics[j]);

        picPreviewContainer.appendChild(picPreview);
    }

    // Заполнение блока с фасовками
    for (let i = 0; i < data.packages.length; i++) {

        let packContainer = document.createElement('div');
        packContainer.setAttribute('class', 'pack-container');
        packContainer.setAttribute('data-id', data.packages[i].id)

        packContainer.addEventListener('click', function(){
            for(let q = 0; q < data.packages.length; q++){
                if(data.packages[q].id == Number(this.getAttribute('data-id'))){
                    
                    
                    let packAddToCart = packContainer.getElementsByClassName('pack-add-to-cart')[0].lastElementChild;
                    let packCount = packAddToCart.textContent ? 
                        Number(packAddToCart.textContent) : 0;

                    packAddToCart.textContent = packCount + 1;


                    const addToCartNotification = document.getElementsByClassName("addToCartNotification")[0];

                    let cartNot = document.createElement('div');
                    cartNot.setAttribute('class', 'cart-not')

                    let imgNot = document.createElement('img');
                    imgNot.setAttribute('src', data.mainPic)
                    cartNot.appendChild(imgNot);

                    let cartNotContainer = document.createElement('div');
                    let cartNotTextProps = document.createElement('p');
                    cartNotTextProps.setAttribute('class', 'cart-not-text-props');
                    cartNotTextProps.textContent = data.name + ', ' + data.packages[q].weight;
                    cartNotContainer.appendChild(cartNotTextProps);

                    let cartNotText = document.createElement('p');
                    cartNotText.setAttribute('class', 'cart-not-text');
                    cartNotText.textContent = 'Товар добавлен в корзину';
                    cartNotContainer.appendChild(cartNotText);

                    let placeAnOrderBtn = document.createElement('p');
                    placeAnOrderBtn.setAttribute('class', 'place-an-order-btn');
                    placeAnOrderBtn.textContent = 'Оформить заказ';
                    cartNotContainer.appendChild(placeAnOrderBtn);

                    let closeNot= document.createElement('i');
                    closeNot.setAttribute('class', 'icon-cross close-not')
                    cartNot.appendChild(closeNot);

                    closeNot.addEventListener('click', function(){
                        cartNot.remove();
                    })

                    cartNot.appendChild(cartNotContainer);

                    addToCartNotification.appendChild(cartNot)

                    setTimeout(() => {
                        if(cartNot)
                            cartNot.remove();
                    }, 3000);

                    return
                }
            }
        });


        // Блок веса и артикула
        let packWSKU = document.createElement('div');
        packWSKU.setAttribute('class', 'pack-hsku')
        packContainer.appendChild(packWSKU);

        let packWeight = document.createElement('p');
        packWeight.setAttribute('class', 'pack-weight')
        packWeight.textContent = data.packages[i].weight;
        packWSKU.appendChild(packWeight);

        let packSKU = document.createElement('p');
        packSKU.setAttribute('class', 'pack-sku')
        packSKU.textContent = 'арт: ' + data.packages[i].SKU;
        packWSKU.appendChild(packSKU);


        // Блок цен
        let packPrices = document.createElement('div');
        packPrices.setAttribute('class', 'pack-prices')
        packContainer.appendChild(packPrices);

        let packNewPrice = document.createElement('p');
        packNewPrice.setAttribute('class', 'pack-new-price')
        packNewPrice.textContent = data.packages[i].newPrice;
        packPrices.appendChild(packNewPrice);

        let packOldPrice = document.createElement('p');
        packOldPrice.setAttribute('class', 'pack-old-price')
        packOldPrice.textContent = data.packages[i].oldPrice;
        packPrices.appendChild(packOldPrice);


        // Блок корзины
        let packAddToCart = document.createElement('div');
        packAddToCart.setAttribute('class', 'pack-add-to-cart')
        packContainer.appendChild(packAddToCart);

        let packCart = document.createElement('li');
        packCart.setAttribute('class', 'icon-cart')
        packAddToCart.appendChild(packCart);

        let counterCart = document.createElement('p');
        counterCart.setAttribute('class', 'counter-cart')
        counterCart.textContent = "0";
        packAddToCart.appendChild(counterCart);


        // Блок с параметром наличия
        let packAvailability = document.createElement('div');
        packAvailability.setAttribute('class', 'pack-availability')
        packContainer.appendChild(packAvailability);

        let packAv = document.createElement('p');
        packAv.setAttribute('class', 'pack-av')
        packAv.textContent = 'наличие';
        packAvailability.appendChild(packAv);

        let packAvVal = document.createElement('p');
        packAvVal.setAttribute('class', 'pack-av-val')
        packAvVal.textContent = data.packages[i].availability;
        packAv.appendChild(packAvVal);

        container.appendChild(packContainer);
    }
}