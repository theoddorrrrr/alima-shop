//Mobile detectiong
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
                isMobile.Android()
                || isMobile.BlackBerry()
                || isMobile.iOS()
                || isMobile.Opera()
                || isMobile.Windows()
                );
    }
};

//Loader
$(window).on("load", function(){
    $(".loader").fadeOut(300);
});

window.onload = function() {
    document.addEventListener('click', documentActions);
    
    //Actions 
    function documentActions(e) {
        const targetElement = e.target;
        if (window.innerWidth >= 768 && isMobile.any()) {
            if(targetElement.classList.contains('menu__arrow')) {
                targetElement.closest('.menu__item').classList.toggle('_hover')
            }
        }
        if (targetElement.classList.contains('search-form__icon')) {
            document.querySelector('.search-form').classList.toggle('_active');
        } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
            document.querySelector('.search-form').classList.remove('_active')
        }

        if (targetElement.classList.contains('products__more')) {
            getProducts(targetElement);
            e.preventDefault();
        }
        if (targetElement.classList.contains('actions-product__button')) {
            const productId = targetElement.closest('.item-product').dataset.pid;
            addToCart(targetElement, productId);
            e.preventDefault();
        }
        if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
            if (document.querySelector('.cart-list').children.length > 0) {
                document.querySelector('.cart-header').classList.toggle('_active');
            }
            e.preventDefault();
        }  else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
            document.querySelector('.cart-header').classList.remove('_active');
        }
        if (targetElement.classList.contains('cart-list__delete')) {
            const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }
    }

     //GetProducts
     async function getProducts(button) {
        if (!button.classList.contains("_hold")) {
            button.classList.add("_hold");
            const file = "json/products.json";
            let response = await fetch(file, {
                method: "GET"
            });
            if (response.ok) {
                let result = await response.json();
                loadProducts(result);
                button.classList.remove("_hold");
                button.remove();
            } else {
                alert("Oops!")
            }
        }
    }
    function loadProducts(data) {
        const productItems = document.querySelector(".products__items");

        data.products.forEach(item => {
            const productId = item.id;
            const productUrl = item.url; 
            const productImage = item.image; 
            const productTitle = item.title; 
            const productText = item.text; 
            const productPrice = item.price; 
            const productOldPrice = item.priceOld; 
            const productShareUrl = item.shareUrl; 
            const productLikeUrl = item.likeUrl; 
            const productLabels = item.labels;  

            let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
            let productTemplateEnd = `</article>`;

            let productTemplateLabels = '';
            if (productLabels) {
                let productTemplateLabelsStart = `<div class="item-product__labels">`;
                let productTemplateLabelsEnd = `</div>`;
                let productTemplateLabelsContent = '';

                productLabels.forEach(labelItem => {
                    productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
                });

                productTemplateLabels += productTemplateLabelsStart;
                productTemplateLabels += productTemplateLabelsContent;
                productTemplateLabels += productTemplateLabelsEnd;
            }

            let productTemplateImage = `
        <a href="${productUrl}" class="item-product__image _ibg">
            <img src="img/products/${productImage}" alt="${productTitle}">
        </a>
    `;

            let productTemplateBodyStart = `<div class="item-product__body">`;
            let productTemplateBodyEnd = `</div>`;

            let productTemplateContent = `
        <div class="item-product__content">
            <h3 class="item-product__title">${productTitle}</h3>
            <div class="item-product__text">${productText}</div>
        </div>
    `;

            let productTemplatePrices = '';
            let productTemplatePricesStart = `<div class="item-product__prices">`;
            let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
            let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
            let productTemplatePricesEnd = `</div>`;

            productTemplatePrices = productTemplatePricesStart;
            productTemplatePrices += productTemplatePricesCurrent;
            if (productOldPrice) {
                productTemplatePrices += productTemplatePricesOld;
            }
            productTemplatePrices += productTemplatePricesEnd;

            let productTemplateActions = `
        <div class="item-product__actions actions-product">
            <div class="actions-product__body">
                <a href="" class="actions-product__button btn btn_white">Add to cart</a>
                <a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
                <a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
            </div>
        </div>
    `;

            let productTemplateBody = '';
            productTemplateBody += productTemplateBodyStart;
            productTemplateBody += productTemplateContent;
            productTemplateBody += productTemplatePrices;
            productTemplateBody += productTemplateActions;
            productTemplateBody += productTemplateBodyEnd;

            let productTemplate = '';
            productTemplate += productTemplateStart;
            productTemplate += productTemplateLabels;
            productTemplate += productTemplateImage;
            productTemplate += productTemplateBody;
            productTemplate += productTemplateEnd;

            productItems.insertAdjacentHTML('beforeend', productTemplate);
        });
    }

    //Mobile Burger 
    if (window.innerWidth <= 768) {
        const products = document.getElementById('products');
        const rooms = document.getElementById('rooms');

        function Product() {
            products.querySelector('.menu__sub-list').classList.toggle('active');
            document.querySelector('#products').classList.toggle('_hover')
        }

        function Room() {
            rooms.querySelector('.menu__sub-list').classList.toggle('active');
            document.querySelector('#rooms').classList.toggle('_hover')
        }
        products.addEventListener('click', Product);
        rooms.addEventListener('click', Room);
    }

    if (window.innerWidth < 992) {
        //Replace btn
        let btn = document.querySelector('.content__button');
        let parrentTo = document.querySelector('.main-slider__container');
        btn.remove();
        parrentTo.appendChild(btn);
    }

    //AddToCart
    function addToCart(productButton, productId) {
        if (!productButton.classList.contains('_hold')) {
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');

            const cart = document.querySelector('.cart-header__icon');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.item-product__image');

            const productImageFly = productImage.cloneNode(true);

            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;

            productImageFly.setAttribute('class', '_flyImage _ibg');
            productImageFly.style.cssText = 
                `
            left: ${productImageFlyLeft}px;
            top: ${productImageFlyTop}px;
            width: ${productImageFlyWidth}px;
            height: ${productImageFlyHeight}px
                `;

            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText = 
                `
            left: ${cartFlyLeft}px;
            top: ${cartFlyTop}px;
            width: 0px;
            height: 0px;
            opacity: 0;
                `;

            productImageFly.addEventListener('transitionend', function() {
                if (productButton.classList.contains('_fly')) {
                    productImageFly.remove();
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');
                };
            });
        }
    }

    function updateCart(productButton, productId, productAdd = true) {
        const cart = document.querySelector('.cart-header');
        const cartIcon = cart.querySelector('.cart-header__icon');
        const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = document.querySelector('.cart-list')
        if (productAdd) {
            if (cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
                cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
            }
            if (!cartProduct) {
                const product = document.querySelector(`[data-pid="${productId}"]`);
                const cartProductImage = product.querySelector('.item-product__image').innerHTML;
                const cartProducTitle = product.querySelector('.item-product__title').innerHTML;
                const cartProductContent = `
                    <a hre="" class="cart-list__image">${cartProductImage}</a>
                    <div class="cart-list__body">
                        <a href="" class="cart-list__title">${cartProducTitle}</a>
                        <div class="cart-list__quantity">Quantity: <span>1</span></div>
                        <a hre="" class="cart-list__delete">Delete</a>
                    </div>
                `;
                cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
            } else {
                const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
            }
            //To add one item in cart more than 1
            productButton.classList.remove('_hold')
        }  else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            } 
            
            const cartQuantityValue = --cartQuantity.innerHTML;

            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue;
            } else {
                cartQuantity.remove();
                cart.classList.remove('_active');
            }
        }
    }
}

//Transform into vanilla JS 
$(document).ready(function() {
    $('.icon-menu').click(function(event){
        $('.icon-menu, .menu__body').toggleClass('_active');
        $('body').toggleClass('lock')
    });
});


//Fixed header
$(document).ready(function() {
    const headerOffSet = $('.header').offset().top;
    
    $(window).scroll(function() {
        const scrolled = $(this).scrollTop();
        
        if (scrolled > headerOffSet) {
            $('.wrapper').addClass('wrapper-fixed')
            // $('.header__body').addClass('header__body-fixed')
        } else if ( scrolled <= headerOffSet) {
            $('.wrapper').removeClass('wrapper-fixed')
            // $('.header__body').removeClass('header__body-fixed')
        }
    })
}) 


 //Slider
 let imgSwiper = new Swiper('.slider-main__body', {
    watchOverflow: true,
    loopAdditionalSlides: 5,
    slidesPerView: 1,
    spaceBetween: 40,
    parallax: true,
    speed: 1000,
    loop: true,
    autoplay: true,

    pagination: {
        el: '.controls-slider-main__dotts',
        clickable: true,
    },

    navigation: {
        nextEl: '.slider-main .slider-arrow_next',
        prevEl: '.slider-main .slider-arrow_prev',
    },
});
let roomsSwiper = new Swiper('.slider-rooms__body', {
    watchOverflow: true,
    loopAdditionalSlides: 5,
    slidesPerView: 1,
    spaceBetween: 25,
    parallax: true,
    speed: 1000,
    loop: true,
    autoplay: true,

    pagination: {
        el: '.slider-rooms__dotts',
        clickable: true,
    },

    navigation: {
        nextEl: '.slider-rooms .slider-arrow_next',
        prevEl: '.slider-rooms .slider-arrow_prev',
    },
})
let tipsSwiper = new Swiper('.slider-tips__body', {
    watchOverflow: true,
    parallax: true,
    speed: 1000,
    loop: true,
    autoplay: true,

    pagination: {
        el: '.slider-tips__dotts',
        clickable: true,
    },

    breakpoints: {
        320: {
            slidesPerView: 1.1,
            spaceBetween: 15,
        },
        480: {
            slidesPerView: 1.5,
            spaceBetween: 15,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 25,
        },
    }
})
//Pause Slider
let sliderBlock1 = document.querySelector('.slider-main__body');
sliderBlock1.addEventListener('mouseenter', function(e) {
    imgSwiper.autoplay.stop();
    
});
sliderBlock1.addEventListener("mouseleave", function(e) {
    imgSwiper.autoplay.start();
});


//Header mobile
// $(document).ready(function() {
//     $('.block__title').click(function(event) {
//         if($('.block').hasClass('one')){
//             $('.block__title').not($(this)).removeClass('active');
//             $('.block__text').not($(this).next()).slideUp(300);
//         }
//         $(this).toggleClass('active').next().slideToggle(300);
//     });
// });





