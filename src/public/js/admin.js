function deleteUser(idUser) {
    fetch(`/api/users/${idUser}`, {
        method: 'DELETE',
    }).then(response => {
        if(response.ok) {
            location.reload();
        } else {
            alert('Error al eliminar el usuario');
        }
    }).catch(error => console.error('Error:', error));
}

function changeUserRole(event, idUser) {
    console.log("Event: ",event,"\nidUser: ",idUser);
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRole = formData.get('newRole');

    fetch(`/api/users/${idUser}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
    }).then(response => {
        if(response.ok) {
            location.reload();
        } else {
            alert('Error al cambiar el rol del usuario',);
        }
    }).catch(error => console.error('Error:', error));
}