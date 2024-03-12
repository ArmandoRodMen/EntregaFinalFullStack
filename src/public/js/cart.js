function deleteProduct(idCart, idProduct) {
    fetch(`/api/carts/${idCart}/products/${idProduct}`, {
        method: 'DELETE',
    }).then(response => {
        if(response.ok) {
            Toastify({
                text: "Producto eliminado del carrito exitosamente",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                },
            }).showToast();
            setTimeout(3000);
            location.reload();
        } else {
            Toastify({
                text: "Error al eliminar el producto",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                },
            }).showToast();
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

function completePurchaseAndRedirect(idCart) {
    fetch(`/api/carts/${idCart}/purchase`, {
        method: 'GET', // Asegúrate de que este método coincida con cómo está configurado tu endpoint
    }).then(response => {
        if(response.ok) {
            Swal.fire({
                title: '¡Compra completada!',
                text: 'Se ha realizado tu compra y se ha enviado un correo electrónico de confirmación.',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/products';
                }
            });
        } else {
            Toastify({
                text: "Error al completar la compra",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
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
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
            },
        }).showToast();
    });
}