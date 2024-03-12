function validatePasswords() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        document.getElementById("passwordMismatch").style.display = "block";
        return false;
    }

    return true;
}