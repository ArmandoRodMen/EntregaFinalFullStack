function addProductToCart(idCart, idProduct) {
    fetch(`/api/carts/${idCart}/products/${idProduct}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    }).then(response => {
        if(response.ok) {
            Toastify({
                text: "Producto añadido al carrito exitosamente",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
            }).showToast();
        } else {
            Toastify({
                text: "Error al añadir el producto al carrito",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                },
            }).showToast();
        }
    }).catch(error => {
        console.error('Error:', error);
        Toastify({
            text: "Error al procesar la petición",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
        }).showToast();
    });
}